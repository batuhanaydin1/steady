import { AppShell } from './components/layout/AppShell.tsx'
import { FocusPage } from './pages/FocusPage.tsx'
import { SettingsPage } from './pages/SettingsPage.tsx'
import { StatsPage } from './pages/StatsPage.tsx'
import { TasksPage } from './pages/TasksPage.tsx'
import { useHashRoute } from './router/useHashRoute.ts'

function App() {
  const { route, current, navigate } = useHashRoute()

  return (
    <AppShell current={current}>
      {route === 'focus' && (
        <FocusPage onOpenTasks={() => navigate('tasks')} onOpenStats={() => navigate('stats')} />
      )}
      {route === 'tasks' && <TasksPage onStartFocus={() => navigate('focus')} />}
      {route === 'stats' && <StatsPage />}
      {route === 'settings' && <SettingsPage />}
    </AppShell>
  )
}

export default App
