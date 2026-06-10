import { RANKING_TIPOS } from '../../constants/options'
import { EmptyState } from '../shared/EmptyState'

export function RankingTab({ ranking, rankingTipo, loading, onChangeRankingTipo }) {
  return (
    <section className="panel data-panel full-panel">
      <div className="panel-header">
        <h2>Ranking</h2>
        <div className="segmented">
          {RANKING_TIPOS.map((tipo) => (
            <button
              key={tipo}
              type="button"
              className={rankingTipo === tipo ? 'active' : ''}
              onClick={() => onChangeRankingTipo(tipo)}
              disabled={loading}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {ranking.length === 0 ? (
        <EmptyState>Nenhum ranking encontrado.</EmptyState>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Clube</th>
                <th>Pontos</th>
                <th>Gols</th>
                <th>Vitórias</th>
                <th>Jogos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((item, index) => (
                <tr key={item.clubeId}>
                  <td className="rank">{index + 1}</td>
                  <td>
                    <strong>{item.nome}</strong>
                  </td>
                  <td>{item.pontos}</td>
                  <td>{item.gols}</td>
                  <td>{item.vitorias}</td>
                  <td>{item.jogos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
