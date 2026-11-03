import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router'
import { ChevronDown, Heart, LayoutGrid, Menu, Package, Search, ShoppingCart, User, X } from 'lucide-react'
import logo from '../../assets/LogoSIEV.png'
import ProductArt from './ProductArt'
import { Dialog } from './ui'
import { button, cx } from './styles'
import { useStore } from '../context/StoreContext'
import { categories } from '../data/catalog'
import { quickSearch } from '../services/catalogService'
import { formatPrice } from '../lib/format'
import { paths } from '../routes'

const quickLinks = [
  { label: 'Ofertas', to: paths.catalog({ oferta: '1', orden: 'descuento' }), accent: true },
  { label: 'Televisores', to: paths.category('televisores') },
  { label: 'Portátiles', to: paths.category('portatiles') },
  { label: 'Celulares', to: paths.category('celulares') },
  { label: 'Audio', to: paths.category('audio') },
  { label: 'Gaming', to: paths.category('gaming') },
  { label: 'Monitores', to: paths.category('monitores') },
]

function SearchBox({ onDone, autoFocus = false }) {
  const [params] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [value, setValue] = useState(() => (location.pathname.endsWith('/catalogo') ? params.get('q') ?? '' : ''))
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const listId = useId()
  const results = quickSearch(value)

  function go(product) {
    setOpen(false)
    onDone?.()
    if (product) navigate(paths.product(product.slug))
    else navigate(paths.catalog({ q: value.trim() }))
  }

  return (
    <form role="search" className="relative w-full" onSubmit={(e) => { e.preventDefault(); go(active >= 0 ? results[active] : null) }}>
      <label htmlFor={`${listId}-input`} className="sr-only">Buscar productos</label>
      <div className="flex h-11 border border-[#dddfe5] bg-[#fafafa] transition focus-within:border-secundario focus-within:bg-white">
        <input
          id={`${listId}-input`} autoFocus={autoFocus} type="search" autoComplete="off" value={value}
          placeholder="Busca televisores, portátiles, audífonos…"
          role="combobox" aria-expanded={open && results.length > 0} aria-controls={listId} aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          className="min-w-0 flex-1 bg-transparent px-4 text-[13px] outline-none placeholder:text-[#9a9ca5] [&::-webkit-search-cancel-button]:hidden"
          onChange={(e) => { setValue(e.target.value); setOpen(true); setActive(-1) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)) }
            if (e.key === 'Escape') setOpen(false)
          }}
        />
        {value && <button type="button" aria-label="Borrar búsqueda" className="px-2 text-[#8a8c94] hover:text-[#222630]" onClick={() => setValue('')}><X size={16} /></button>}
        <button type="submit" className="grid w-12 place-items-center bg-secundario text-white hover:bg-[#232968]" aria-label="Buscar"><Search size={18} /></button>
      </div>
      {open && results.length > 0 && (
        <ul id={listId} role="listbox" className="mk-fade absolute inset-x-0 top-full z-50 mt-1 border border-[#e2e2e8] bg-white py-2 shadow-xl">
          {results.map((p, i) => (
            <li key={p.id} id={`${listId}-${i}`} role="option" aria-selected={active === i}>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => go(p)} className={cx('flex w-full items-center gap-3 px-3 py-2 text-left', active === i ? 'bg-[#f3f3f8]' : 'hover:bg-[#f7f7fa]')}>
                <span className="h-10 w-14 shrink-0 bg-[#f3f3f0]"><ProductArt type={p.art} color={p.colors[0].hex} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{p.name}</span>
                  <span className="text-[11px] text-[#73757d]">{p.brand} · {p.categoryName}</span>
                </span>
                <span className="text-[13px] font-semibold">{formatPrice(p.price)}</span>
              </button>
            </li>
          ))}
          <li className="mt-1 border-t border-[#eeeef2] px-3 pt-2">
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => go(null)} className="text-[12px] font-semibold text-secundario hover:underline">Ver todos los resultados para “{value}”</button>
          </li>
        </ul>
      )}
    </form>
  )
}

function IconAction({ to, onClick, icon: Icon, label, count }) {
  const content = <>
    <span className="relative">
      <Icon size={21} strokeWidth={1.8} />
      {count > 0 && <span className="absolute -right-2 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-principal px-1 text-[10px] font-bold text-white">{count > 99 ? '99+' : count}</span>}
    </span>
    <span className="hidden text-[11px] font-semibold xl:block">{label}</span>
  </>
  const className = 'flex flex-col items-center gap-1 px-2 py-1 text-[#222630] transition hover:text-secundario'
  const aria = count > 0 ? `${label} (${count})` : label
  return to ? <Link to={to} className={className} aria-label={aria}>{content}</Link> : <button type="button" onClick={onClick} className={className} aria-label={aria}>{content}</button>
}

export default function Header() {
  const { cartCount, savedCount, setCartOpen } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const location = useLocation()
  const megaRef = useRef(null)

  // Cierra los menús al navegar (ajuste de estado durante el render, sin efecto).
  const route = location.pathname + location.search
  const [lastRoute, setLastRoute] = useState(route)
  if (route !== lastRoute) {
    setLastRoute(route)
    setMenuOpen(false)
    setMegaOpen(false)
  }

  useEffect(() => {
    if (!megaOpen) return
    const close = (e) => { if (!megaRef.current?.contains(e.target)) setMegaOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') setMegaOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [megaOpen])

  return (
    <>
      <div className="bg-secundario text-[11px] text-[#e3e4ff]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-6 px-5 py-2 sm:justify-between">
          <p className="m-0"><span className="text-principal">ϟ</span> Envío gratis en compras desde {formatPrice(299900)}</p>
          <p className="m-0 hidden gap-6 sm:flex"><span>12 cuotas sin interés</span><span>Garantía oficial</span><Link to={paths.help} className="underline-offset-2 hover:underline">Ayuda</Link></p>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#e9e9ed] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-5 py-3 lg:gap-8">
          <button type="button" className="grid size-10 place-items-center text-secundario lg:hidden" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}><Menu size={24} /></button>
          <Link to={paths.home} className="flex shrink-0 items-center gap-3" aria-label="Tienda SIEV, ir al inicio">
            <img src={logo} alt="SIEV" className="h-11 w-auto object-contain sm:h-12" />
            <span className="hidden border-l border-[#e2e2e8] pl-3 text-[10px] font-bold uppercase leading-tight tracking-[.18em] text-secundario sm:block">Tienda<br /><span className="text-principal">tecnología</span></span>
          </Link>
          <div className="hidden flex-1 md:block"><SearchBox /></div>
          <nav className="ml-auto flex items-center gap-1 sm:gap-2" aria-label="Acciones de la cuenta">
            <button type="button" onClick={() => setLoginOpen(true)} className="hidden items-center gap-2 border border-secundario px-3.5 py-2.5 text-[12px] font-semibold text-secundario transition hover:bg-secundario hover:text-white lg:flex">
              <User size={16} /> Iniciar sesión
            </button>
            <IconAction to={paths.orders} icon={Package} label="Pedidos" />
            <IconAction to={paths.lists} icon={Heart} label="Listas" count={savedCount} />
            <IconAction onClick={() => setCartOpen(true)} icon={ShoppingCart} label="Carrito" count={cartCount} />
          </nav>
        </div>
        <div className="px-5 pb-3 md:hidden"><SearchBox /></div>

        <div className="hidden border-t border-[#efeff2] lg:block">
          <div className="mx-auto flex max-w-[1280px] items-center gap-7 px-5 text-[13px] font-semibold">
            <div ref={megaRef} className="relative">
              <button type="button" aria-expanded={megaOpen} aria-controls="mega-menu" onClick={() => setMegaOpen((o) => !o)}
                className={cx('flex items-center gap-2 py-3 transition', megaOpen ? 'text-principal' : 'text-secundario hover:text-principal')}>
                <LayoutGrid size={16} /> Categorías <ChevronDown size={14} className={cx('transition', megaOpen && 'rotate-180')} />
              </button>
              {megaOpen && (
                <div id="mega-menu" className="mk-pop absolute left-0 top-full z-50 grid w-[760px] grid-cols-3 gap-1 border border-[#e2e2e8] bg-white p-4 shadow-2xl">
                  {categories.map((c) => (
                    <Link key={c.id} to={paths.category(c.id)} className="group flex items-center gap-3 p-2.5 hover:bg-[#f6f6f4]">
                      <span className="h-11 w-14 shrink-0 bg-[#f3f3f0]"><ProductArt type={c.art} color="#2d3484" /></span>
                      <span>
                        <span className="block text-[13px] font-semibold group-hover:text-secundario">{c.name}</span>
                        <span className="line-clamp-1 text-[11px] font-normal text-[#73757d]">{c.description}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {quickLinks.map((l) => (
              <NavLink key={l.label} to={l.to} className={cx('border-b-2 border-transparent py-3 transition hover:border-principal hover:text-secundario', l.accent && 'text-principal')}>{l.label}</NavLink>
            ))}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#15182bb3] lg:hidden mk-fade" onMouseDown={(e) => { if (e.target === e.currentTarget) setMenuOpen(false) }}>
          <aside className="mk-drawer-left flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-white" aria-label="Menú principal">
            <div className="flex items-center justify-between border-b border-[#eeeef2] p-4">
              <img src={logo} alt="SIEV" className="h-10" />
              <button type="button" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} className="grid size-10 place-items-center"><X size={22} /></button>
            </div>
            <div className="p-4">
              <button type="button" onClick={() => { setMenuOpen(false); setLoginOpen(true) }} className={button('outline', 'w-full')}><User size={16} /> Iniciar sesión</button>
            </div>
            <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#73757d]">Categorías</p>
            <nav className="flex flex-col px-2">
              <Link to={paths.catalog({ oferta: '1', orden: 'descuento' })} className="px-2 py-3 text-[14px] font-semibold text-principal">Ofertas del día</Link>
              {categories.map((c) => <Link key={c.id} to={paths.category(c.id)} className="border-t border-[#f2f2f5] px-2 py-3 text-[14px]">{c.name}</Link>)}
            </nav>
            <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[#eeeef2] p-4 text-[13px] font-semibold">
              <Link to={paths.orders} className="flex items-center gap-2 py-2"><Package size={16} /> Mis pedidos</Link>
              <Link to={paths.help} className="py-2">Ayuda</Link>
            </div>
          </aside>
        </div>
      )}

      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} labelledBy="login-title">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[.18em] text-secundario">SIGEP-SIEV</p>
        <h2 id="login-title" className="mb-3 text-[28px] font-semibold tracking-[-.04em]">Ingresa a tu cuenta</h2>
        <p className="mb-6 text-[14px] leading-relaxed text-[#626570]">
          El inicio de sesión estará disponible próximamente. Mientras tanto puedes comprar como invitado: tu carrito, tus listas y tus pedidos se guardan en este navegador.
        </p>
        <button type="button" autoFocus onClick={() => setLoginOpen(false)} className={button('secondary')}>Entendido</button>
      </Dialog>
    </>
  )
}
