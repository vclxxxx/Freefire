import { useState } from 'react'

export default function Home() {
  const [uid, setUid] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const actions = [
    { key: 'check_ban', label: 'Check Ban' },
    { key: 'info', label: 'Account Info' },
    { key: 'profile_card', label: 'Cover Image' },
    { key: 'profile', label: 'Equipped Skins' },
  ]

  async function handle(action) {
    if (!uid) {
      setError('Vui lòng nhập UID')
      return
    }
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      let url = ''
      let isImage = false
      if (action === 'check_ban') url = `http://raw.thug4ff.com/check_ban/${uid}`
      if (action === 'info') url = `http://raw.thug4ff.com/info?uid=${uid}`
      if (action === 'profile_card') {
        url = `http://profile.thug4ff.com/api/profile_card?uid=${uid}`
        isImage = true
      }
      if (action === 'profile') url = `http://profile.thug4ff.com/api/profile?uid=${uid}`

      const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`)
      if (!res.ok) throw new Error('Request failed')
      const ct = res.headers.get('content-type') || ''
      if (isImage || ct.startsWith('image/')) {
        const blob = await res.blob()
        const imgUrl = URL.createObjectURL(blob)
        setResult({ type: 'image', url: imgUrl })
      } else {
        const text = await res.text()
        try {
          setResult({ type: 'json', data: JSON.parse(text) })
        } catch {
          setResult({ type: 'text', data: text })
        }
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h1>FF Check (Ban / Info / Skins)</h1>
      <input
        value={uid}
        onChange={(e) => setUid(e.target.value)}
        placeholder="Nhập UID..."
        style={{ padding: 8, fontSize: 16, width: '100%', marginBottom: 12 }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {actions.map((a) => (
          <button key={a.key} onClick={() => handle(a.key)} style={{ padding: 8 }}>
            {a.label}
          </button>
        ))}
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result?.type === 'json' && (
        <pre style={{ marginTop: 16, background: '#eee', padding: 12 }}>
          {JSON.stringify(result.data, null, 2)}
        </pre>
      )}
      {result?.type === 'text' && (
        <pre style={{ marginTop: 16, background: '#eee', padding: 12 }}>{result.data}</pre>
      )}
      {result?.type === 'image' && (
        <div style={{ marginTop: 16 }}>
          <img src={result.url} alt="Profile card" style={{ maxWidth: '100%', borderRadius: 8 }} />
        </div>
      )}
    </div>
  )
}
