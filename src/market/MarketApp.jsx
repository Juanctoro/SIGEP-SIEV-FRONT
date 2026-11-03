import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
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

function MarketLayout() {
  return (
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
  )
}

// Rutas del marketplace. Se montan dentro del <BrowserRouter> de la aplicación.
export default function MarketRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tienda" replace />} />
      <Route path="/tienda" element={<MarketLayout />}>
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
      <Route path="*" element={<Navigate to="/tienda" replace />} />
    </Routes>
  )
}
