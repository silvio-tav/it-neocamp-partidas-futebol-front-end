export function toInputDateTime(value) {
  if (!value) return ''
  return value.slice(0, 16)
}

export function formatDate(value) {
  if (!value) return '-'

  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value

  return `${day}/${month}/${year}`
}

export function formatDateTime(value) {
  if (!value) return '-'

  const [date, time = ''] = value.split('T')
  const [year, month, day] = date.split('-')
  const [hour = '00', minute = '00'] = time.split(':')

  if (!year || !month || !day) return value

  return `${day}/${month}/${year} ${hour}:${minute}`
}

export function formatBool(value) {
  return value ? 'Ativo' : 'Inativo'
}
