export function AppHeader({ loading, message, onRefresh, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">Spring Boot + React</span>
        <h1>Partidas de Futebol</h1>
      </div>

      <div className="top-actions">
        <span className={`api-status ${message?.type === 'error' ? 'offline' : 'online'}`}>
          {message?.type === 'error' ? 'API indisponível' : 'API local'}
        </span>
        <button type="button" className="button secondary" onClick={onRefresh} disabled={loading}>
          {loading ? 'Carregando' : 'Atualizar'}
        </button>
        <button type="button" className="button secondary" onClick={onLogout}>
          Sair
        </button>
      </div>
    </header>
  )
}
