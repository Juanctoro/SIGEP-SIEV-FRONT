import { useEffect, useState } from 'react'
import { RefreshCw, Zap } from 'lucide-react'
import { loadCatalog } from './services/catalogService'
import { Link, Outlet, Route, Routes, useLocation } from 'react-router'
import './market.css'
import { StoreProvider } from './context/StoreContext'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ListDialog from './components/ListDialog'
import Toasts from './components/Toasts'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Lists from './pages/Lists'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Help from './pages/Help'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0 }) }, [pathname])
  return null
}

// La tienda se pinta cuando el catálogo del backend ya está cargado, para que el
// carrito, las listas y los pedidos guardados encuentren sus productos.
function CatalogGate({ children }) {
  const [state, setState] = useState({ status: 'loading', error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    loadCatalog()
      .then(() => { if (active) setState({ status: 'ready', error: null }) })
      .catch((error) => { if (active) setState({ status: 'error', error }) })
    return () => { active = false }
  }, [attempt])

  if (state.status === 'ready') return children
  return (
    <div className="mk-root grid min-h-screen place-items-center px-5">
      <div className="max-w-sm text-center">
        <span className="mx-auto mb-5 grid size-14 place-items-center bg-[#eeeff7] text-secundario"><Zap size={26} className={state.status === 'loading' ? 'animate-pulse' : ''} /></span>
        {state.status === 'loading' ? (
          <p role="status" className="text-[14px] text-[#626570]">Cargando catálogo…</p>
        ) : (
          <>
            <h1 className="mb-2 text-[20px] font-semibold">No pudimos cargar la tienda</h1>
            <p className="mb-6 text-[13px] text-[#626570]">{state.error?.message}</p>
            <div className="flex justify-center gap-3">
              <button type="button" onClick={() => { setState({ status: 'loading', error: null }); setAttempt((n) => n + 1) }} className="inline-flex items-center gap-2 bg-secundario px-5 py-3 text-[13px] font-semibold text-white"><RefreshCw size={15} /> Reintentar</button>
              <Link to="/" className="inline-flex items-center px-5 py-3 text-[13px] font-semibold text-secundario">Ir al inicio</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MarketLayout() {
  return (
    <CatalogGate>
    <StoreProvider>
      <div className="mk-root flex min-h-screen flex-col">
        <a href="#contenido" className="fixed -top-24 left-3 z-[100] bg-white p-3 text-[13px] font-semibold focus:top-3">Saltar al contenido</a>
        <ScrollToTop />
        <Header />
        <main id="contenido" className="flex-1"><Outlet /></main>
        <Footer />
        <CartDrawer />
        <ListDialog />
        <Toasts />
      </div>
    </StoreProvider>
    </CatalogGate>
  )
}

// Rutas relativas al montaje /tienda/* del enrutador principal.
export default function MarketRoutes() {
  return (
    <Routes>
      <Route element={<MarketLayout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalog />} />
        <Route path="producto/:slug" element={<ProductDetail />} />
        <Route path="carrito" element={<Cart />} />
        <Route path="listas" element={<Lists />} />
        <Route path="listas/:listId" element={<Lists />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pedidos" element={<Orders />} />
        <Route path="pedidos/:orderId" element={<Orders />} />
        <Route path="ayuda" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
