import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/globals.css'
import App from './App.jsx'
import { AlertsProvider } from './context/AlertsContext'
import { ResponseActionsProvider } from './context/ResponseActionsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ResponseActionsProvider>
      <AlertsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlertsProvider>
    </ResponseActionsProvider>
  </StrictMode>,
)
