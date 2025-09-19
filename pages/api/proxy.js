export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'Missing url param' })

  let decoded
  try {
    decoded = decodeURIComponent(url)
  } catch {
    decoded = url
  }

  const allowedHosts = ['raw.thug4ff.com', 'profile.thug4ff.com']
  try {
    const target = new URL(decoded)
    if (!allowedHosts.includes(target.hostname)) {
      return res.status(403).json({ error: 'Host not allowed' })
    }

    const fetchRes = await fetch(target.toString(), { method: 'GET' })
    const ct = fetchRes.headers.get('content-type') || 'application/octet-stream'

    res.setHeader('Content-Type', ct)
    res.status(fetchRes.status)

    if (ct.startsWith('image/')) {
      const buffer = Buffer.from(await fetchRes.arrayBuffer())
      return res.send(buffer)
    } else {
      const text = await fetchRes.text()
      try {
        return res.json(JSON.parse(text))
      } catch {
        return res.send(text)
      }
    }
  } catch (err) {
    console.error('Proxy error:', err)
    return res.status(500).json({ error: 'Proxy failed', detail: err.message })
  }
}
