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

  const allowedHosts = ['raw.thug4ff.com', 'profile.thug4ff.com']

  try {
    const target = new URL(decoded)
    if (!allowedHosts.includes(target.hostname)) {
      res.status(403).json({ error: 'Host not allowed' })
      return
    }

    const fetchRes = await fetch(target.toString(), {
      method: 'GET',
      headers: {
        accept: '*/*',
        'user-agent': 'ff-check-vercel-proxy/1.0',
      },
    })

    const contentType = fetchRes.headers.get('content-type') || 'application/octet-stream'
    const status = fetchRes.status

    // Trả lại y nguyên dữ liệu
    res.setHeader('Content-Type', contentType)
    res.status(status)

    if (contentType.startsWith('image/')) {
      const buffer = Buffer.from(await fetchRes.arrayBuffer())
      res.send(buffer)
    } else {
      const text = await fetchRes.text()
      try {
        const json = JSON.parse(text)
        res.json(json)
      } catch {
        res.send(text)
      }
    }
  } catch (err) {
    console.error('Proxy error', err)
    res.status(500).json({ error: 'Proxy failed', detail: String(err.message) })
  }
}
