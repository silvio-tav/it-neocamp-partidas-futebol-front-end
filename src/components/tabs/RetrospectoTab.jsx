import { ATUACOES } from '../../constants/options'
import { formatDateTime } from '../../utils/formatters'
import { EmptyState } from '../shared/EmptyState'
import { Stat } from '../shared/Stat'

export function RetrospectoTab({
  clubes,
  retrospectoFiltro,
  setRetrospectoFiltro,
  retrospecto,
  adversarios,
  confronto,
  loading,
  onSubmit,
  onSelectAdversario,
}) {
  return (
    <section className="workspace retrospect-workspace">
      <form className="panel form-panel" onSubmit={onSubmit}>
        <div className="panel-header">
          <h2>Consulta</h2>
        </div>

        <div className="form-grid single">
          <label>
            Clube
            <select
              value={retrospectoFiltro.clubeId}
              onChange={(event) =>
                setRetrospectoFiltro({ ...retrospectoFiltro, clubeId: event.target.value, adversarioId: '' })
              }
              required
            >
              <option value="">Selecione</option>
              {clubes.map((clube) => (
                <option key={clube.clubeId} value={clube.clubeId}>
                  {clube.nome}
                </option>
              ))}
            </select>
          </label>

          <label>
            Atuação
            <select
              value={retrospectoFiltro.atuacao}
              onChange={(event) =>
                setRetrospectoFiltro({ ...retrospectoFiltro, atuacao: event.target.value, adversarioId: '' })
              }
            >
              {ATUACOES.map((atuacao) => (
                <option key={atuacao.value || 'geral'} value={atuacao.value}>
                  {atuacao.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit" className="button primary" disabled={loading}>
          Buscar retrospecto
        </button>
      </form>

      <section className="panel data-panel">
        <div className="panel-header">
          <h2>Retrospecto</h2>
        </div>

        {!retrospecto ? (
          <EmptyState>Selecione um clube.</EmptyState>
        ) : (
          <>
            <div className="stats-grid compact-grid">
              <Stat label="Jogos" value={retrospecto.totalJogos} tone="blue" />
              <Stat label="Vitórias" value={retrospecto.vitorias} tone="green" />
              <Stat label="Empates" value={retrospecto.empates} tone="orange" />
              <Stat label="Derrotas" value={retrospecto.derrotas} tone="red" />
              <Stat label="Gols feitos" value={retrospecto.golsFeitos} tone="purple" />
              <Stat label="Gols sofridos" value={retrospecto.golsSofridos} tone="neutral" />
            </div>

            <div className="subsection">
              <h3>Adversários</h3>
              {adversarios.length === 0 ? (
                <EmptyState>Nenhum adversário encontrado.</EmptyState>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Adversário</th>
                        <th>J</th>
                        <th>V</th>
                        <th>E</th>
                        <th>D</th>
                        <th>GF</th>
                        <th>GS</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adversarios.map((item) => (
                        <tr key={item.adversario?.clubeId}>
                          <td>
                            <strong>{item.adversario?.nome}</strong>
                          </td>
                          <td>{item.totalJogos}</td>
                          <td>{item.vitorias}</td>
                          <td>{item.empates}</td>
                          <td>{item.derrotas}</td>
                          <td>{item.golsFeitos}</td>
                          <td>{item.golsSofridos}</td>
                          <td>
                            <button
                              type="button"
                              className="button compact"
                              onClick={() => onSelectAdversario(item.adversario?.clubeId)}
                            >
                              Ver jogos
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {confronto && (
              <div className="subsection">
                <h3>Confronto direto</h3>
                <div className="stats-grid compact-grid">
                  <Stat label="Jogos" value={confronto.totalJogos} tone="blue" />
                  <Stat label="Vitórias" value={confronto.vitorias} tone="green" />
                  <Stat label="Empates" value={confronto.empates} tone="orange" />
                  <Stat label="Derrotas" value={confronto.derrotas} tone="red" />
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Jogo</th>
                        <th>Placar</th>
                        <th>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(confronto.partidas || []).map((partida) => (
                        <tr key={partida.partidaId}>
                          <td>
                            <strong>{partida.clubeCasa?.nome}</strong>
                            <span>{partida.clubeVisitante?.nome}</span>
                          </td>
                          <td className="score">
                            {partida.golsCasa} x {partida.golsVisitante}
                          </td>
                          <td>{formatDateTime(partida.dataHoraPartida)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </section>
  )
}
