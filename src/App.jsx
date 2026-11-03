import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import LandingPage from './LandingPage'
import MarketRoutes from './market/MarketApp'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tienda/*" element={<MarketRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
