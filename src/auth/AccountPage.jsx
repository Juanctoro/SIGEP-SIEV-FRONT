import { Link, Navigate } from 'react-router'
import { LogOut, ArrowUpRight } from 'lucide-react'
import { useAuth } from './useAuth'
import logo from '../assets/LogoSIEV.png'
import './auth.css'

export default function AccountPage() {
  const { user, logout } = useAuth()
  if (!user) return <Navigate to="/login?next=%2Fcuenta" replace />
  return <main className="account-page"><header className="account-header"><Link to="/" aria-label="SIEV, volver al inicio"><img src={logo} alt="SIEV" /></Link><button type="button" onClick={logout}><LogOut size={16} /> Cerrar sesión</button></header><section className="account-card"><p className="eyebrow">Mi cuenta</p><h1>Hola, <em>{user.name}.</em></h1><p className="auth-demo">Sesión de demostración: no otorga acceso a sistemas internos. Se cerrará al recargar la página.</p><dl><div><dt>Usuario</dt><dd>{user.username}</dd></div><div><dt>Correo electrónico</dt><dd>{user.email}</dd></div></dl><div className="account-actions"><Link className="button button-secondary" to="/tienda">Explorar tienda <ArrowUpRight size={16} /></Link><Link className="auth-back" to="/">Ir al sitio institucional →</Link></div></section></main>
}
