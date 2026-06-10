import { EmptyState } from '../shared/EmptyState'

export function EstadiosTab({
  estadios,
  estadioForm,
  setEstadioForm,
  editingEstadioId,
  loading,
  estadiosFiltro,
  setEstadiosFiltro,
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
          <h2>{editingEstadioId ? 'Editar estádio' : 'Novo estádio'}</h2>
          {editingEstadioId && (
            <button type="button" className="button ghost" onClick={onCancelEdit}>
              Cancelar
            </button>
          )}
        </div>

        <div className="form-grid single">
          <label>
            Nome
            <input
              type="text"
              minLength="3"
              value={estadioForm.nome}
              onChange={(event) => setEstadioForm({ ...estadioForm, nome: event.target.value })}
              required
            />
          </label>
        </div>

        <button type="submit" className="button primary" disabled={loading}>
          {editingEstadioId ? 'Salvar estádio' : 'Cadastrar estádio'}
        </button>
      </form>

      <section className="panel data-panel">
        <div className="panel-header">
          <h2>Estádios</h2>
          <form className="filters" onSubmit={onFilter}>
            <input
              type="search"
              placeholder="Nome"
              value={estadiosFiltro.nomeEstadio}
              onChange={(event) => setEstadiosFiltro({ ...estadiosFiltro, nomeEstadio: event.target.value })}
            />
            <button type="submit" className="button secondary" disabled={loading}>
              Filtrar
            </button>
          </form>
        </div>

        {estadios.length === 0 ? (
          <EmptyState>Nenhum estádio encontrado.</EmptyState>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {estadios.map((estadio) => (
                  <tr key={estadio.estadioId}>
                    <td>
                      <strong>{estadio.nome}</strong>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="button compact" onClick={() => onEdit(estadio)}>
                          Editar
                        </button>
                        <button
                          type="button"
                          className="button compact danger"
                          onClick={() => onDelete(estadio.estadioId)}
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
