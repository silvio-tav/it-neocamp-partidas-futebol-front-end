import { getToken, removeToken } from './auth'

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export async function request(path, options = {}) {
  const token = getToken()

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    removeToken()
    window.dispatchEvent(new Event('auth:logout'))
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const detail = data?.detail || data?.message || data?.title || data
    throw new Error(detail || `Erro HTTP ${response.status}`)
  }

  return data
}

export async function authRequest(path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  if (!response.ok) {
    const detail = data?.detail || data?.message || data?.title || data
    throw new Error(detail || `Erro HTTP ${response.status}`)
  }

  return data
}
