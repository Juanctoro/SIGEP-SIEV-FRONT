import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { ExternalLink, LogOut, Menu, X } from 'lucide-react'
import logo from '../assets/LogoSIEV.png'
import { useAuth } from '../auth/useAuth'
import { visibleNav } from './navigation'
import './admin.css'

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U'
}

function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth()
  const sections = visibleNav(user)
  return (
    <div className="flex h-full flex-col bg-[#1c2060] text-[#c9cbf0]">
      <div className="flex items-center gap-3 px-5 pb-6 pt-6">
        <Link to="/admin" onClick={onNavigate} className="grid h-11 w-[74px] place-items-center rounded-lg bg-white px-2" aria-label="SIEV, panel de administración">
          <img src={logo} alt="SIEV" className="h-8 w-auto object-contain" />
        </Link>
        <div className="leading-tight">
          <p className="m-0 text-[13px] font-semibold text-white">SIGEP-SIEV</p>
          <p className="m-0 text-[11px] text-[#9ea2dc]">Administración</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3" aria-label="Panel de administración">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#7f84c9]">{section.title}</p>
            <ul className="m-0 list-none space-y-1 p-0">
              {section.items.map(({ to, label, description, icon: Icon }) => (
                <li key={to}>
                  <NavLink to={to} onClick={onNavigate}
                    className={({ isActive }) => `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition ${isActive ? 'bg-white/[.09] text-white' : 'hover:bg-white/[.05] hover:text-white'}`}>
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-principal" aria-hidden="true" />}
                        <span className={`grid size-9 shrink-0 place-items-center rounded-lg transition ${isActive ? 'bg-principal text-white' : 'bg-white/[.06] text-[#b7baf0] group-hover:text-white'}`}><Icon size={18} /></span>
                        <span className="min-w-0">
                          <span className="block text-[13px] font-semibold">{label}</span>
                          <span className="block truncate text-[11px] text-[#9ea2dc]">{description}</span>
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link to="/tienda" onClick={onNavigate} className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold hover:bg-white/[.05] hover:text-white"><ExternalLink size={15} /> Ver tienda</Link>
        <div className="flex items-center gap-3 rounded-lg bg-white/[.05] p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-principal text-[12px] font-bold text-white" aria-hidden="true">{initials(user?.name)}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-white">{user?.name}</span>
            <span className="block truncate text-[11px] text-[#9ea2dc]">{user?.email}</span>
          </span>
          <button type="button" onClick={logout} className="grid size-8 place-items-center rounded-md text-[#b7baf0] hover:bg-white/10 hover:text-white" aria-label="Cerrar sesión" title="Cerrar sesión"><LogOut size={16} /></button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="adm-root min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] lg:block"><Sidebar /></aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <button type="button" className="adm-fade-in absolute inset-0 bg-[#0d0f2b]/50" onClick={() => setOpen(false)} aria-label="Cerrar menú" />
          <aside className="adm-slide-in relative h-full w-[280px] max-w-[85vw]">
            <Sidebar onNavigate={() => setOpen(false)} />
            <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg text-white hover:bg-white/10" aria-label="Cerrar menú"><X size={18} /></button>
          </aside>
        </div>
      )}

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-[#e4e5ee] bg-white/90 px-4 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setOpen(true)} className="grid size-9 place-items-center rounded-lg hover:bg-[#f0f1f7]" aria-label="Abrir menú" aria-expanded={open}><Menu size={20} /></button>
          <img src={logo} alt="SIEV" className="h-8 w-auto" />
          <span className="text-[13px] font-semibold text-secundario">Administración</span>
        </header>
        <main id="contenido" className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10 lg:py-9"><Outlet /></main>
      </div>
    </div>
  )
}
