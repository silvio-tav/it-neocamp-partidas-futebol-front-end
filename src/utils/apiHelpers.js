export function compactPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== '' && value !== null && value !== undefined),
  )
}

export function pageContent(response) {
  if (Array.isArray(response)) return response
  return response?.content || []
}

export function buildQuery(params) {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      search.set(key, value)
    }
  })

  const query = search.toString()
  return query ? `?${query}` : ''
}

export function extractErrorMessage(data, status) {
  const fieldErrors = data?.errors || data?.fieldErrors
  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
    return fieldErrors.map((e) => `${e.field}: ${e.defaultMessage || e.message}`).join('; ')
  }
  const detail = data?.detail || data?.message || data?.title
  if (typeof detail === 'string') return detail
  return `Erro HTTP ${status}`
}
