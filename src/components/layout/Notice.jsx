export function Notice({ message }) {
  if (!message) return null

  return <div className={`notice ${message.type}`}>{message.text}</div>
}
