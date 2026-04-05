import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n'; // Import i18n config

import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
