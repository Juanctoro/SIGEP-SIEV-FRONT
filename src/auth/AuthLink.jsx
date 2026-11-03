import { Link, useLocation } from 'react-router'
import { useAuth } from './useAuth'

export default function AuthLink({ className, onClick, children }) {
  const { user } = useAuth()
  const { pathname, search } = useLocation()
  const next = pathname.startsWith('/tienda') ? pathname + search : '/cuenta'
  return <Link className={className} onClick={onClick} to={user ? '/cuenta' : `/login?next=${encodeURIComponent(next)}`}>{children}{user ? 'Mi cuenta' : 'Iniciar sesión'}</Link>
}
