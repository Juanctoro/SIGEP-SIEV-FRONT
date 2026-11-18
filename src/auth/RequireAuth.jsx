import { Navigate, useLocation } from 'react-router'
import { useAuth } from './useAuth'

// Protege rutas: exige sesión y, con `staff`, que el usuario sea is_staff en el backend.
// Uso: <Route path="/admin/*" element={<RequireAuth staff><AdminApp /></RequireAuth>} />
// Es solo para la interfaz: el backend debe validar los permisos de cada endpoint.
export default function RequireAuth({ staff = false, children }) {
  const { user, loading } = useAuth()
  const { pathname, search } = useLocation()
  if (loading) return <p role="status" className="auth-loading">Verificando sesión…</p>
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(pathname + search)}`} replace />
  if (staff && !user.isStaff) return <Navigate to="/cuenta" replace />
  return children
}
