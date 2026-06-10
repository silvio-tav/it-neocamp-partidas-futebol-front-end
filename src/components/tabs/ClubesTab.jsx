import { ESTADOS } from '../../constants/options'
import { formatBool, formatDate } from '../../utils/formatters'
import { EmptyState } from '../shared/EmptyState'

export function ClubesTab({
  clubes,
  clubeForm,
  setClubeForm,
  editingClubeId,
  loading,
  clubesFiltro,
  setClubesFiltro,
  onSubmit,
  onCancelEdit,
  onFilter,
  onEdit,
  onDelete,
}) {
  return (
    <section className="workspace">
      <form className="panel form-panel" onSubmit={onSubmit}>
        <div className="panel-header">
          <h2>{editingClubeId ? 'Editar clube' : 'Novo clube'}</h2>
          {editingClubeId && (
            <button type="button" className="button ghost" onClick={onCancelEdit}>
              Cancelar
            </button>
          )}
        </div>

        <div className="form-grid">
          <label>
            Nome
            <input
              type="text"
              minLength="2"
              value={clubeForm.nome}
              onChange={(event) => setClubeForm({ ...clubeForm, nome: event.target.value })}
              required
            />
          </label>

          <label>
            Estado
            <select
              value={clubeForm.estado}
              onChange={(event) => setClubeForm({ ...clubeForm, estado: event.target.value })}
              required
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fundação
            <input
              type="date"
              value={clubeForm.dataCriacao}
              onChange={(event) => setClubeForm({ ...clubeForm, dataCriacao: event.target.value })}
            />
          </label>
        </div>

        <button type="submit" className="button primary" disabled={loading}>
          {editingClubeId ? 'Salvar clube' : 'Cadastrar clube'}
        </button>
      </form>

      <section className="panel data-panel">
        <div className="panel-header">
          <h2>Clubes</h2>
          <form className="filters" onSubmit={onFilter}>
            <input
              type="search"
              placeholder="Nome"
              value={clubesFiltro.nome}
              onChange={(event) => setClubesFiltro({ ...clubesFiltro, nome: event.target.value })}
            />
            <select
              value={clubesFiltro.estado}
              onChange={(event) => setClubesFiltro({ ...clubesFiltro, estado: event.target.value })}
            >
              <option value="">UF</option>
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            <select
              value={clubesFiltro.ativo}
              onChange={(event) => setClubesFiltro({ ...clubesFiltro, ativo: event.target.value })}
            >
              <option value="">Todos</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>
            <button type="submit" className="button secondary" disabled={loading}>
              Filtrar
            </button>
          </form>
        </div>

        {clubes.length === 0 ? (
          <EmptyState>Nenhum clube encontrado.</EmptyState>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Clube</th>
                  <th>UF</th>
                  <th>Fundação</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clubes.map((clube) => (
                  <tr key={clube.clubeId}>
                    <td>
                      <strong>{clube.nome}</strong>
                    </td>
                    <td>{clube.siglaEstado}</td>
                    <td>{formatDate(clube.dataCriacao)}</td>
                    <td>
                      <span className={`pill ${clube.ativo ? 'success' : 'muted'}`}>{formatBool(clube.ativo)}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="button compact" onClick={() => onEdit(clube)}>
                          Editar
                        </button>
                        <button
                          type="button"
                          className="button compact warning"
                          onClick={() => onDelete(clube.clubeId)}
                          disabled={!clube.ativo}
                        >
                          Inativar
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
