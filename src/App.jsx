import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { AppHeader } from './components/layout/AppHeader'
import { LoginPage } from './components/layout/LoginPage'
import { Notice } from './components/layout/Notice'
import { SummaryMetrics } from './components/layout/SummaryMetrics'
import { TabNavigation } from './components/layout/TabNavigation'
import { ClubesTab } from './components/tabs/ClubesTab'
import { EstadiosTab } from './components/tabs/EstadiosTab'
import { PartidasTab } from './components/tabs/PartidasTab'
import { RankingTab } from './components/tabs/RankingTab'
import { RetrospectoTab } from './components/tabs/RetrospectoTab'
import { clubeInicial, estadioInicial, partidaInicial } from './constants/forms'
import { request } from './services/api'
import { isAuthenticated, removeToken } from './services/auth'
import { buildQuery, compactPayload, pageContent } from './utils/apiHelpers'
import { toInputDateTime } from './utils/formatters'

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated)

  useEffect(() => {
    function handleLogout() {
      setAuthenticated(false)
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  function handleLogout() {
    removeToken()
    setMessage(null)
    setAuthenticated(false)
  }

  const [activeTab, setActiveTab] = useState('partidas')
  const [clubes, setClubes] = useState([])
  const [estadios, setEstadios] = useState([])
  const [partidas, setPartidas] = useState([])
  const [ranking, setRanking] = useState([])
  const [retrospecto, setRetrospecto] = useState(null)
  const [adversarios, setAdversarios] = useState([])
  const [confronto, setConfronto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const [clubeForm, setClubeForm] = useState(clubeInicial)
  const [estadioForm, setEstadioForm] = useState(estadioInicial)
  const [partidaForm, setPartidaForm] = useState(partidaInicial)
  const [editingClubeId, setEditingClubeId] = useState(null)
  const [editingEstadioId, setEditingEstadioId] = useState(null)
  const [editingPartidaId, setEditingPartidaId] = useState(null)

  const [clubesFiltro, setClubesFiltro] = useState({ nome: '', estado: '', ativo: '' })
  const [estadiosFiltro, setEstadiosFiltro] = useState({ nomeEstadio: '' })
  const [partidasFiltro, setPartidasFiltro] = useState({ nomeClube: '', nomeEstadio: '', goleada: '' })
  const [rankingTipo, setRankingTipo] = useState('PONTOS')
  const [retrospectoFiltro, setRetrospectoFiltro] = useState({
    clubeId: '',
    atuacao: '',
    adversarioId: '',
  })

  const ativos = useMemo(() => clubes.filter((clube) => clube.ativo).length, [clubes])

  async function loadClubes(filters = clubesFiltro) {
    const response = await request(`/clubes${buildQuery({ ...filters, page: 0, size: 100, sort: 'nome,asc' })}`)
    const content = pageContent(response)
    setClubes(content)
    return content
  }

  async function loadEstadios(filters = estadiosFiltro) {
    const response = await request(`/estadios${buildQuery({ ...filters, page: 0, size: 100, sort: 'nome,asc' })}`)
    const content = pageContent(response)
    setEstadios(content)
    return content
  }

  async function loadPartidas(filters = partidasFiltro) {
    const response = await request(
      `/partidas${buildQuery({ ...filters, page: 0, size: 100, sort: 'dataHoraPartida,desc' })}`,
    )
    const content = pageContent(response)
    setPartidas(content)
    return content
  }

  async function loadRanking(tipo = rankingTipo) {
    const response = await request(`/clubes/ranking${buildQuery({ tipo })}`)
    setRanking(response || [])
    return response || []
  }

  async function loadRetrospecto(filters = retrospectoFiltro) {
    if (!filters.clubeId) {
      setRetrospecto(null)
      setAdversarios([])
      setConfronto(null)
      return
    }

    const query = buildQuery({ atuacao: filters.atuacao })
    const [retrospectoResponse, adversariosResponse] = await Promise.all([
      request(`/clubes/${filters.clubeId}/retrospecto${query}`),
      request(`/clubes/${filters.clubeId}/retrospecto/adversarios${query}`),
    ])

    setRetrospecto(retrospectoResponse)
    setAdversarios(adversariosResponse || [])
  }

  async function loadConfronto(filters = retrospectoFiltro) {
    if (!filters.clubeId || !filters.adversarioId) {
      setConfronto(null)
      return
    }

    const response = await request(
      `/clubes/${filters.clubeId}/retrospecto/adversarios/${filters.adversarioId}${buildQuery({
        atuacao: filters.atuacao,
      })}`,
    )
    setConfronto(response)
  }

  async function refreshAll() {
    setLoading(true)

    try {
      await Promise.all([loadClubes(), loadEstadios(), loadPartidas(), loadRanking()])
      setMessage({ type: 'success', text: 'Dados atualizados.' })
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Não foi possível concluir a ação.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authenticated) return

    const timeoutId = window.setTimeout(() => {
      refreshAll()
    }, 0)

    return () => window.clearTimeout(timeoutId)
    // Carga inicial autenticada; filtros e ações recarregam os dados explicitamente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated])

  async function runAction(action, successMessage, afterAction) {
    setLoading(true)

    try {
      await action()
      if (afterAction) await afterAction()
      setMessage({ type: 'success', text: successMessage })
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Não foi possível concluir a ação.' })
    } finally {
      setLoading(false)
    }
  }

  function resetClubeForm() {
    setClubeForm(clubeInicial)
    setEditingClubeId(null)
  }

  function resetEstadioForm() {
    setEstadioForm(estadioInicial)
    setEditingEstadioId(null)
  }

  function resetPartidaForm() {
    setPartidaForm(partidaInicial)
    setEditingPartidaId(null)
  }

  function editClube(clube) {
    setClubeForm({
      nome: clube.nome || '',
      estado: clube.siglaEstado || 'SP',
      dataCriacao: clube.dataCriacao || '',
    })
    setEditingClubeId(clube.clubeId)
    setActiveTab('clubes')
  }

  function editEstadio(estadio) {
    setEstadioForm({
      nome: estadio.nome || '',
    })
    setEditingEstadioId(estadio.estadioId)
    setActiveTab('estadios')
  }

  function editPartida(partida) {
    setPartidaForm({
      clubeCasaId: partida.clubeCasa?.clubeId || '',
      clubeVisitanteId: partida.clubeVisitante?.clubeId || '',
      estadioId: partida.estadio?.estadioId || '',
      dataHoraPartida: toInputDateTime(partida.dataHoraPartida),
      golsCasa: partida.golsCasa ?? 0,
      golsVisitante: partida.golsVisitante ?? 0,
    })
    setEditingPartidaId(partida.partidaId)
    setActiveTab('partidas')
  }

  function handleClubeSubmit(event) {
    event.preventDefault()
    const payload = compactPayload(clubeForm)
    const path = editingClubeId ? `/clubes/${editingClubeId}` : '/clubes'
    const method = editingClubeId ? 'PUT' : 'POST'

    runAction(
      () => request(path, { method, body: JSON.stringify(payload) }),
      editingClubeId ? 'Clube atualizado.' : 'Clube cadastrado.',
      async () => {
        resetClubeForm()
        await Promise.all([loadClubes(), loadRanking()])
      },
    )
  }

  function handleEstadioSubmit(event) {
    event.preventDefault()
    const payload = compactPayload(estadioForm)
    const path = editingEstadioId ? `/estadios/${editingEstadioId}` : '/estadios'
    const method = editingEstadioId ? 'PUT' : 'POST'

    runAction(
      () => request(path, { method, body: JSON.stringify(payload) }),
      editingEstadioId ? 'Estádio atualizado.' : 'Estádio cadastrado.',
      async () => {
        resetEstadioForm()
        await loadEstadios()
      },
    )
  }

  function handlePartidaSubmit(event) {
    event.preventDefault()
    const payload = compactPayload({
      ...partidaForm,
      golsCasa: Number(partidaForm.golsCasa),
      golsVisitante: Number(partidaForm.golsVisitante),
    })
    const path = editingPartidaId ? `/partidas/${editingPartidaId}` : '/partidas'
    const method = editingPartidaId ? 'PUT' : 'POST'

    runAction(
      () => request(path, { method, body: JSON.stringify(payload) }),
      editingPartidaId ? 'Partida atualizada.' : 'Partida cadastrada.',
      async () => {
        resetPartidaForm()
        await Promise.all([loadPartidas(), loadRanking()])
      },
    )
  }

  function handleDeleteClube(clubeId) {
    runAction(
      () => request(`/clubes/${clubeId}`, { method: 'DELETE' }),
      'Clube inativado.',
      async () => {
        await Promise.all([loadClubes(), loadRanking()])
      },
    )
  }

  function handleDeleteEstadio(estadioId) {
    runAction(
      () => request(`/estadios/${estadioId}`, { method: 'DELETE' }),
      'Estádio removido.',
      async () => {
        await loadEstadios()
      },
    )
  }

  function handleDeletePartida(partidaId) {
    runAction(
      () => request(`/partidas/${partidaId}`, { method: 'DELETE' }),
      'Partida removida.',
      async () => {
        await Promise.all([loadPartidas(), loadRanking()])
      },
    )
  }

  function submitClubesFiltro(event) {
    event.preventDefault()
    runAction(() => loadClubes(), 'Clubes filtrados.')
  }

  function submitEstadiosFiltro(event) {
    event.preventDefault()
    runAction(() => loadEstadios(), 'Estádios filtrados.')
  }

  function submitPartidasFiltro(event) {
    event.preventDefault()
    runAction(() => loadPartidas(), 'Partidas filtradas.')
  }

  function changeRankingTipo(tipo) {
    setRankingTipo(tipo)
    runAction(() => loadRanking(tipo), 'Ranking atualizado.')
  }

  function submitRetrospecto(event) {
    event.preventDefault()
    runAction(() => loadRetrospecto(), 'Retrospecto atualizado.')
  }

  function selectAdversario(adversarioId) {
    const filters = { ...retrospectoFiltro, adversarioId }
    setRetrospectoFiltro(filters)
    runAction(() => loadConfronto(filters), 'Confronto carregado.')
  }

  if (!authenticated) {
    return <LoginPage onLogin={() => { setMessage(null); setAuthenticated(true) }} />
  }

  function renderActiveTab() {
    switch (activeTab) {
      case 'partidas':
        return (
          <PartidasTab
            clubes={clubes}
            estadios={estadios}
            partidas={partidas}
            partidaForm={partidaForm}
            setPartidaForm={setPartidaForm}
            editingPartidaId={editingPartidaId}
            loading={loading}
            partidasFiltro={partidasFiltro}
            setPartidasFiltro={setPartidasFiltro}
            onSubmit={handlePartidaSubmit}
            onCancelEdit={resetPartidaForm}
            onFilter={submitPartidasFiltro}
            onEdit={editPartida}
            onDelete={handleDeletePartida}
          />
        )
      case 'clubes':
        return (
          <ClubesTab
            clubes={clubes}
            clubeForm={clubeForm}
            setClubeForm={setClubeForm}
            editingClubeId={editingClubeId}
            loading={loading}
            clubesFiltro={clubesFiltro}
            setClubesFiltro={setClubesFiltro}
            onSubmit={handleClubeSubmit}
            onCancelEdit={resetClubeForm}
            onFilter={submitClubesFiltro}
            onEdit={editClube}
            onDelete={handleDeleteClube}
          />
        )
      case 'estadios':
        return (
          <EstadiosTab
            estadios={estadios}
            estadioForm={estadioForm}
            setEstadioForm={setEstadioForm}
            editingEstadioId={editingEstadioId}
            loading={loading}
            estadiosFiltro={estadiosFiltro}
            setEstadiosFiltro={setEstadiosFiltro}
            onSubmit={handleEstadioSubmit}
            onCancelEdit={resetEstadioForm}
            onFilter={submitEstadiosFiltro}
            onEdit={editEstadio}
            onDelete={handleDeleteEstadio}
          />
        )
      case 'ranking':
        return (
          <RankingTab
            ranking={ranking}
            rankingTipo={rankingTipo}
            loading={loading}
            onChangeRankingTipo={changeRankingTipo}
          />
        )
      case 'retrospecto':
        return (
          <RetrospectoTab
            clubes={clubes}
            retrospectoFiltro={retrospectoFiltro}
            setRetrospectoFiltro={setRetrospectoFiltro}
            retrospecto={retrospecto}
            adversarios={adversarios}
            confronto={confronto}
            loading={loading}
            onSubmit={submitRetrospecto}
            onSelectAdversario={selectAdversario}
          />
        )
      default:
        return null
    }
  }

  return (
    <main className="app-shell">
      <AppHeader loading={loading} message={message} onRefresh={refreshAll} onLogout={handleLogout} />
      <SummaryMetrics
        ativos={ativos}
        estadiosCount={estadios.length}
        partidasCount={partidas.length}
        rankingCount={ranking.length}
      />
      <TabNavigation activeTab={activeTab} onChangeTab={setActiveTab} />
      <Notice message={message} />
      {renderActiveTab()}
    </main>
  )
}

export default App
