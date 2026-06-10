export function Stat({ label, value, tone = 'neutral' }) {
  return (
    <div className={`stat ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
