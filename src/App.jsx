import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import LandingPage from './LandingPage'
import MarketRoutes from './market/MarketApp'
import { AuthProvider } from './auth/AuthContext'
import AuthPage from './auth/AuthPage'
import AccountPage from './auth/AccountPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage key="login" />} />
        <Route path="/registro" element={<AuthPage key="register" mode="register" />} />
        <Route path="/cuenta" element={<AccountPage />} />
        <Route path="/tienda/*" element={<MarketRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
