import { TABS } from '../../constants/options'

export function TabNavigation({ activeTab, onChangeTab }) {
  return (
    <nav className="tabs" aria-label="Navegação">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activeTab === tab.id ? 'active' : ''}
          onClick={() => onChangeTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
