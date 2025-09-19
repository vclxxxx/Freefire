import { useState } from 'react'

export default function Home() {
  const [uid, setUid] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const allowedActions = [
    { key: 'check_ban', label: 'Check Ban' },
    { key: 'info', label: 'Account Info' },
    { key: 'profile_card', label: 'Cover Image' },
    { key: 'profile', label: 'Equipped Skins' }
  ]

  function proxyFetch(path, asImage = false) {
    setLoading(true)
    setError(null)
    setResult(null)
    const encoded = encodeURIComponent(path)
    return fetch(`/api/proxy?url=${encoded}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const contentType = res.headers.get('content-type') || ''
        if (contentType.startsWith('image/') || asImage) {
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          return { type: 'image', url }
        }
        const data = await res.json()
        return { type: 'json', data }
      })
      .catch((e) => {
        throw e
      })
      .finally(() => setLoading(false))
  }

  async function handle(actionKey) {
    if (!uid) return setError('Vui lòng nhập UID')
    setError(null)
    try {
      let path = ''
      let asImage = false
      switch (actionKey) {
        case 'check_ban':
          path = `http://raw.thug4ff.com/check_ban/${uid}`
          break
        case 'info':
          path = `http://raw.thug4ff.com/info?uid=${uid}`
          break
        case 'profile_card':
          path = `http://profile.thug4ff.com/api/profile_card?uid=${uid}`
          asImage = true
          break
        case 'profile':
          path = `http://profile.thug4ff.com/api/profile?uid=${uid}`
          break
        default:
          return
      }
      setLoading(true)
      const res = await proxyFetch(path, asImage)
      setResult(res)
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>FF Check — Check ban & account info</h1>
      <p>Nhập <strong>UID</strong> rồi chọn hàm muốn gọi. Project dùng serverless API để proxy request (tránh CORS).</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={uid}
          onChange={(e) => setUid(e.target.value.trim())}
          placeholder="Nhập UID, ví dụ 7811379047"
          style={{ flex: 1, padding: '8px 12px', fontSize: 16 }}
        />
        <button onClick={() => { setUid('') }} style={{ padding: '8px 12px' }}>Clear</button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {allowedActions.map(a => (
          <button key={a.key} onClick={() => handle(a.key)} style={{ padding: '8px 12px' }}>{a.label}</button>
        ))}
      </div>

      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {result && result.type === 'json' && (
        <div style={{ marginTop: 16 }}>
          <h3>JSON Result</h3>
          <pre style={{ background: '#f5f5f5', padding: 12, overflowX: 'auto' }}>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}

      {result && result.type === 'image' && (
        <div style={{ marginTop: 16 }}>
          <h3>Cover Image</h3>
          <img src={result.url} alt="cover" style={{ maxWidth: '100%', borderRadius: 8 }} />
        </div>
      )}

      <hr style={{ margin: '24px 0' }} />
      <small>Để deploy: push project lên GitHub rồi import vào Vercel (tự nhận Next.js). Hoặc dùng Vercel CLI.</small>
    </div>
  )
}