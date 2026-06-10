const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const detail = data?.detail || data?.message || data?.title || data
    throw new Error(detail || `Erro HTTP ${response.status}`)
  }

  return data
}
