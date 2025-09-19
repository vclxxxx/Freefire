// Simple safe proxy for the allowed thug4ff endpoints
// This file validates url query param and forwards the request server-side.

export default async function handler(req, res) {
  const { url } = req.query
  if (!url) {
    res.status(400).json({ error: 'Missing url param' })
    return
  }

  let decoded
  try {
    decoded = decodeURIComponent(url)
  } catch (e) {
    decoded = url
  }

  // Only allow these base hosts to prevent open proxy abuse
  const allowedHosts = ['raw.thug4ff.com', 'profile.thug4ff.com']
  try {
    const target = new URL(decoded)
    if (!allowedHosts.includes(target.hostname)) {
      res.status(403).json({ error: 'Host not allowed' })
      return
    }

    // Forward request
    const fetchRes = await fetch(target.toString(), {
      method: req.method === 'GET' ? 'GET' : 'GET',
      headers: {
        // pass-through some headers if needed; don't forward client cookies
        accept: '*/*',
        'user-agent': 'ff-check-vercel-proxy/1.0'
      }
    })

    // If the target returns an image, stream it with proper content-type
    const contentType = fetchRes.headers.get('content-type') || ''

    if (contentType.startsWith('image/')) {
      const arrayBuffer = await fetchRes.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      res.setHeader('Content-Type', contentType)
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
      res.status(200).send(buffer)
      return
    }

    // For JSON or other text responses
    const text = await fetchRes.text()
    // try to parse JSON
    try {
      const json = JSON.parse(text)
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=5')
      res.status(fetchRes.status).json(json)
    } catch (e) {
      // fallback to plain text
      res.setHeader('Content-Type', 'text/plain')
      res.status(fetchRes.status).send(text)
    }
  } catch (err) {
    console.error('Proxy error', err)
    res.status(500).json({ error: 'Proxy failed', detail: String(err.message) })
  }
  }
