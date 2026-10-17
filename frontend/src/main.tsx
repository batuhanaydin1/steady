import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/theme.css'
import './index.css'
import './components/ui/ui.css'
import './components/layout/layout.css'
import './features/timer/timer.css'
import './features/tasks/tasks.css'
import './features/sessions/sessions.css'
import './pages/pages.css'
import { ThemeProvider } from './theme/ThemeProvider.tsx'
import { TasksProvider } from './features/tasks/TasksProvider.tsx'
import { SessionsProvider } from './features/sessions/SessionsProvider.tsx'
import { TimerProvider } from './features/timer/TimerProvider.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      {/* Tasks and sessions sit outside the timer: a running focus session reads
          the linked task and records itself into the history when it ends. */}
      <TasksProvider>
        <SessionsProvider>
          <TimerProvider>
            <App />
          </TimerProvider>
        </SessionsProvider>
      </TasksProvider>
    </ThemeProvider>
  </StrictMode>,
)
