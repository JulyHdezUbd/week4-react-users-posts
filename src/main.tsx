import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserContextProvider } from './context/UserContextProvider.tsx'
import { AuthContextProvider } from './context/AuthContextProvider.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
