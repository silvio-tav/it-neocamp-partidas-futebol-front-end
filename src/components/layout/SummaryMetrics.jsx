import { Stat } from '../shared/Stat'

export function SummaryMetrics({ ativos, estadiosCount, partidasCount, rankingCount }) {
  return (
    <section className="metrics" aria-label="Resumo">
      <Stat label="Clubes ativos" value={ativos} tone="green" />
      <Stat label="Estádios" value={estadiosCount} tone="blue" />
      <Stat label="Partidas" value={partidasCount} tone="orange" />
      <Stat label="Ranking" value={rankingCount} tone="purple" />
    </section>
  )
}
