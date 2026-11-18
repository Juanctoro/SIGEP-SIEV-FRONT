import { Link } from 'react-router'
import { LogOut, ArrowUpRight } from 'lucide-react'
import { useAuth } from './useAuth'
import RequireAuth from './RequireAuth'
import logo from '../assets/LogoSIEV.png'
import './auth.css'

function role(user) {
  if (user.isSuperuser) return 'Superadministrador'
  if (user.isStaff) return 'Administrador'
  return 'Cliente'
}

function Account() {
  const { user, logout } = useAuth()
  return <main className="account-page"><header className="account-header"><Link to="/" aria-label="SIEV, volver al inicio"><img src={logo} alt="SIEV" /></Link><button type="button" onClick={logout}><LogOut size={16} /> Cerrar sesión</button></header><section className="account-card"><p className="eyebrow">Mi cuenta</p><h1>Hola, <em>{user.name}.</em></h1><dl><div><dt>Usuario</dt><dd>{user.username}</dd></div><div><dt>Correo electrónico</dt><dd>{user.email}</dd></div><div><dt>Rol</dt><dd>{role(user)}</dd></div></dl><div className="account-actions">{user.isStaff && <Link className="button button-primary" to="/admin">Panel de administración <ArrowUpRight size={16} /></Link>}<Link className="button button-secondary" to="/tienda">Explorar tienda <ArrowUpRight size={16} /></Link><Link className="auth-back" to="/">Ir al sitio institucional →</Link></div></section></main>
}

export default function AccountPage() {
  return <RequireAuth><Account /></RequireAuth>
}
