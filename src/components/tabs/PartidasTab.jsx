import { EmptyState } from '../shared/EmptyState'
import { formatDateTime } from '../../utils/formatters'

export function PartidasTab({
  clubes,
  estadios,
  partidas,
  partidaForm,
  setPartidaForm,
  editingPartidaId,
  loading,
  partidasFiltro,
  setPartidasFiltro,
  onSubmit,
  onCancelEdit,
  onFilter,
  onEdit,
  onDelete,
}) {
  const clubesAtivos = clubes.filter((clube) => clube.ativo)

  return (
    <section className="workspace">
      <form className="panel form-panel" onSubmit={onSubmit}>
        <div className="panel-header">
          <h2>{editingPartidaId ? 'Editar partida' : 'Nova partida'}</h2>
          {editingPartidaId && (
            <button type="button" className="button ghost" onClick={onCancelEdit}>
              Cancelar
            </button>
          )}
        </div>

        <div className="form-grid">
          <label>
            Mandante
            <select
              value={partidaForm.clubeCasaId}
              onChange={(event) => setPartidaForm({ ...partidaForm, clubeCasaId: event.target.value })}
              required
            >
              <option value="">Selecione</option>
              {clubesAtivos.map((clube) => (
                <option key={clube.clubeId} value={clube.clubeId}>
                  {clube.nome}
                </option>
              ))}
            </select>
          </label>

          <label>
            Visitante
            <select
              value={partidaForm.clubeVisitanteId}
              onChange={(event) => setPartidaForm({ ...partidaForm, clubeVisitanteId: event.target.value })}
              required
            >
              <option value="">Selecione</option>
              {clubesAtivos.map((clube) => (
                <option key={clube.clubeId} value={clube.clubeId}>
                  {clube.nome}
                </option>
              ))}
            </select>
          </label>

          <label>
            Estádio
            <select
              value={partidaForm.estadioId}
              onChange={(event) => setPartidaForm({ ...partidaForm, estadioId: event.target.value })}
              required
            >
              <option value="">Selecione</option>
              {estadios.map((estadio) => (
                <option key={estadio.estadioId} value={estadio.estadioId}>
                  {estadio.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            Data e hora
            <input
              type="datetime-local"
              value={partidaForm.dataHoraPartida}
              max={new Date().toISOString().slice(0, 16)}
              onChange={(event) => setPartidaForm({ ...partidaForm, dataHoraPartida: event.target.value })}
              required
            />
          </label>

          <label>
            Gols casa
            <input
              type="number"
              min="0"
              value={partidaForm.golsCasa}
              onChange={(event) => setPartidaForm({ ...partidaForm, golsCasa: event.target.value })}
              required
            />
          </label>

          <label>
            Gols visitante
            <input
              type="number"
              min="0"
              value={partidaForm.golsVisitante}
              onChange={(event) => setPartidaForm({ ...partidaForm, golsVisitante: event.target.value })}
              required
            />
          </label>
        </div>

        <button type="submit" className="button primary" disabled={loading}>
          {editingPartidaId ? 'Salvar partida' : 'Cadastrar partida'}
        </button>
      </form>

      <section className="panel data-panel">
        <div className="panel-header">
          <h2>Partidas</h2>
          <form className="filters" onSubmit={onFilter}>
            <input
              type="search"
              placeholder="Clube"
              value={partidasFiltro.nomeClube}
              onChange={(event) => setPartidasFiltro({ ...partidasFiltro, nomeClube: event.target.value })}
            />
            <input
              type="search"
              placeholder="Estádio"
              value={partidasFiltro.nomeEstadio}
              onChange={(event) => setPartidasFiltro({ ...partidasFiltro, nomeEstadio: event.target.value })}
            />
            <select
              value={partidasFiltro.goleada}
              onChange={(event) => setPartidasFiltro({ ...partidasFiltro, goleada: event.target.value })}
            >
              <option value="">Todos</option>
              <option value="true">Goleadas</option>
            </select>
            <button type="submit" className="button secondary" disabled={loading}>
              Filtrar
            </button>
          </form>
        </div>

        {partidas.length === 0 ? (
          <EmptyState>Nenhuma partida encontrada.</EmptyState>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Jogo</th>
                  <th>Placar</th>
                  <th>Estádio</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {partidas.map((partida) => (
                  <tr key={partida.partidaId}>
                    <td>
                      <strong>{partida.clubeCasa?.nome}</strong>
                      <span>{partida.clubeVisitante?.nome}</span>
                    </td>
                    <td className="score">
                      {partida.golsCasa} x {partida.golsVisitante}
                    </td>
                    <td>{partida.estadio?.nome}</td>
                    <td>{formatDateTime(partida.dataHoraPartida)}</td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="button compact" onClick={() => onEdit(partida)}>
                          Editar
                        </button>
                        <button
                          type="button"
                          className="button compact danger"
                          onClick={() => onDelete(partida.partidaId)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  )
}
