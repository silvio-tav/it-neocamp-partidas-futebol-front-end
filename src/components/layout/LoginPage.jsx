import { useState } from 'react'
import { authRequest } from '../../services/api'
import { setToken } from '../../services/auth'

export function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register'
      const data = await authRequest(path, { username, password })
      setToken(data.token)
      onLogin()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell login-shell">
      <div className="login-card panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Spring Boot + React</span>
            <h2>Partidas de Futebol</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-grid single">
          <label>
            Usuário
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </label>

          {error && <p className="notice error">{error}</p>}

          <button type="submit" className="button primary" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p className="login-switch">
          {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button
            type="button"
            className="button ghost login-switch-btn"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
          >
            {mode === 'login' ? 'Criar conta' : 'Entrar'}
          </button>
        </p>
      </div>
    </main>
  )
}
