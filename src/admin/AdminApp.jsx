import { Navigate, Route, Routes } from 'react-router'
import RequireAuth from '../auth/RequireAuth'
import AdminLayout from './AdminLayout'
import ProductsPage from './products/ProductsPage'
import QuoteEditor from './quotes/QuoteEditor'
import QuotesPage from './quotes/QuotesPage'

// Rutas relativas al montaje /admin/* del enrutador principal. Solo personal (is_staff).
export default function AdminRoutes() {
  return (
    <RequireAuth staff>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="productos" replace />} />
          <Route path="productos" element={<ProductsPage />} />
          <Route path="cotizaciones" element={<QuotesPage />} />
          <Route path="cotizaciones/nueva" element={<QuoteEditor />} />
          <Route path="cotizaciones/:id" element={<QuoteEditor />} />
          <Route path="*" element={<Navigate to="productos" replace />} />
        </Route>
      </Routes>
    </RequireAuth>
  )
}
