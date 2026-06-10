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

export function getErrorMessage(error) {
  return error instanceof Error ? error.message : 'Não foi possível concluir a ação.'
}
