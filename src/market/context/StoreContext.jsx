import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { findProduct } from '../services/catalogService'
import { lineKey, priceFor } from '../lib/cart'

// Estado global de la tienda (carrito, listas, pedidos, vistos recientemente y reseñas propias).
// Se guarda en localStorage para que la maqueta conserve los datos entre recargas.
// Cuando exista backend, estas acciones deben llamar a los endpoints de carrito/listas/pedidos.

const StoreContext = createContext(null)
const STORAGE_KEY = 'siev-market:v1'
const DEFAULT_LIST = { id: 'favoritos', name: 'Favoritos', items: [], createdAt: new Date(0).toISOString(), locked: true }

const initialState = {
  cart: [],
  lists: [DEFAULT_LIST],
  orders: [],
  recent: [],
  myReviews: {},
  coupon: null,
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved) return initialState
    const lists = saved.lists?.length ? saved.lists : [DEFAULT_LIST]
    return { ...initialState, ...saved, lists: lists.some((l) => l.id === 'favoritos') ? lists : [DEFAULT_LIST, ...lists] }
  } catch {
    return initialState
  }
}

let toastId = 0

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [cartOpen, setCartOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const [listDialog, setListDialog] = useState(null)
  const timers = useRef(new Map())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Almacenamiento no disponible (modo privado): la maqueta sigue funcionando en memoria.
    }
  }, [state])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id))
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
  }, [])

  const notify = useCallback((message, options = {}) => {
    const id = ++toastId
    setToasts((current) => [...current.slice(-2), { id, message, tone: options.tone ?? 'success', action: options.action }])
    timers.current.set(id, setTimeout(() => dismissToast(id), options.duration ?? 3800))
  }, [dismissToast])

  // ---------- Carrito ----------
  const addToCart = useCallback((product, { qty = 1, color, option, silent = false, openDrawer = true } = {}) => {
    const colorName = color ?? product.colors[0]?.name
    const optionLabel = option ?? product.options?.values[0]?.label ?? null
    const key = lineKey(product.id, colorName, optionLabel)
    const current = state.cart.find((l) => l.key === key)?.qty ?? 0
    const limited = Math.min(current + qty, product.stock, 10) < current + qty
    setState((s) => {
      const existing = s.cart.find((l) => l.key === key)
      const nextQty = Math.min((existing?.qty ?? 0) + qty, product.stock, 10)
      const cart = existing
        ? s.cart.map((l) => (l.key === key ? { ...l, qty: nextQty } : l))
        : [...s.cart, { key, productId: product.id, color: colorName, option: optionLabel, qty: nextQty, addedAt: Date.now() }]
      return { ...s, cart }
    })
    if (!silent) {
      notify(limited ? 'Alcanzaste la cantidad máxima disponible para este producto.' : `${product.name} se agregó al carrito.`, { tone: limited ? 'warning' : 'success' })
      if (openDrawer && !limited) setCartOpen(true)
    }
  }, [state.cart, notify])

  const updateQty = useCallback((key, qty) => {
    setState((s) => ({
      ...s,
      cart: s.cart.map((l) => {
        if (l.key !== key) return l
        const product = findProduct(l.productId)
        return { ...l, qty: Math.max(1, Math.min(qty, product?.stock ?? 1, 10)) }
      }),
    }))
  }, [])

  const removeFromCart = useCallback((key) => {
    const removed = state.cart.find((l) => l.key === key)
    setState((s) => ({ ...s, cart: s.cart.filter((l) => l.key !== key) }))
    notify('Producto eliminado del carrito.', {
      tone: 'neutral',
      action: { label: 'Deshacer', run: () => removed && setState((s) => (s.cart.some((l) => l.key === removed.key) ? s : { ...s, cart: [...s.cart, removed] })) },
    })
  }, [state.cart, notify])

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [], coupon: null })), [])
  const setCoupon = useCallback((coupon) => setState((s) => ({ ...s, coupon })), [])

  const cartLines = useMemo(() => state.cart
    .map((line) => {
      const product = findProduct(line.productId)
      if (!product) return null
      const { price, oldPrice } = priceFor(product, line.option)
      return { ...line, product, unitPrice: price, unitOldPrice: oldPrice, colorHex: product.colors.find((c) => c.name === line.color)?.hex }
    })
    .filter(Boolean), [state.cart])

  // ---------- Listas ----------
  const isInList = useCallback((listId, productId) => state.lists.find((l) => l.id === listId)?.items.some((i) => i.productId === productId) ?? false, [state.lists])
  const isSaved = useCallback((productId) => state.lists.some((l) => l.items.some((i) => i.productId === productId)), [state.lists])

  const toggleInList = useCallback((listId, product, { silent = false } = {}) => {
    const list = state.lists.find((l) => l.id === listId)
    if (!list) return
    const present = list.items.some((i) => i.productId === product.id)
    setState((s) => ({
      ...s,
      lists: s.lists.map((l) => l.id !== listId ? l : {
        ...l,
        items: present ? l.items.filter((i) => i.productId !== product.id) : [{ productId: product.id, addedAt: Date.now() }, ...l.items],
      }),
    }))
    if (!silent) notify(present ? `Se quitó de "${list.name}".` : `Se guardó en "${list.name}".`, { tone: present ? 'neutral' : 'success' })
  }, [state.lists, notify])

  const createList = useCallback((name, product) => {
    const id = `lista-${Date.now().toString(36)}`
    setState((s) => ({
      ...s,
      lists: [...s.lists, { id, name: name.trim(), items: product ? [{ productId: product.id, addedAt: Date.now() }] : [], createdAt: new Date().toISOString() }],
    }))
    notify(product ? `Se creó la lista "${name.trim()}" con el producto.` : `Se creó la lista "${name.trim()}".`)
    return id
  }, [notify])

  const renameList = useCallback((id, name) => {
    setState((s) => ({ ...s, lists: s.lists.map((l) => (l.id === id ? { ...l, name: name.trim() } : l)) }))
    notify('Lista actualizada.')
  }, [notify])

  const deleteList = useCallback((id) => {
    setState((s) => ({ ...s, lists: s.lists.filter((l) => l.id !== id || l.locked) }))
    notify('Lista eliminada.', { tone: 'neutral' })
  }, [notify])

  const moveCartLineToList = useCallback((key, listId = 'favoritos') => {
    const line = state.cart.find((l) => l.key === key)
    if (!line) return
    setState((s) => ({
      ...s,
      cart: s.cart.filter((l) => l.key !== key),
      lists: s.lists.map((l) => l.id !== listId || l.items.some((i) => i.productId === line.productId) ? l : { ...l, items: [{ productId: line.productId, addedAt: Date.now() }, ...l.items] }),
    }))
    notify('Producto movido a Favoritos.')
  }, [state.cart, notify])

  // ---------- Pedidos, recientes y reseñas ----------
  const addOrder = useCallback((order) => setState((s) => ({ ...s, orders: [order, ...s.orders], cart: [], coupon: null })), [])

  const trackView = useCallback((productId) => {
    setState((s) => ({ ...s, recent: [productId, ...s.recent.filter((id) => id !== productId)].slice(0, 12) }))
  }, [])

  const addReview = useCallback((productId, review) => {
    setState((s) => ({ ...s, myReviews: { ...s.myReviews, [productId]: [review, ...(s.myReviews[productId] ?? [])] } }))
    notify('¡Gracias! Tu reseña fue publicada.')
  }, [notify])

  const value = useMemo(() => ({
    ...state,
    cartLines,
    cartCount: cartLines.reduce((n, l) => n + l.qty, 0),
    savedCount: new Set(state.lists.flatMap((l) => l.items.map((i) => i.productId))).size,
    cartOpen, setCartOpen,
    toasts, notify, dismissToast,
    listDialog, openListDialog: setListDialog, closeListDialog: () => setListDialog(null),
    addToCart, updateQty, removeFromCart, clearCart, setCoupon,
    isInList, isSaved, toggleInList, createList, renameList, deleteList, moveCartLineToList,
    addOrder, trackView, addReview,
  }), [state, cartLines, cartOpen, toasts, notify, dismissToast, listDialog, addToCart, updateQty, removeFromCart, clearCart, setCoupon, isInList, isSaved, toggleInList, createList, renameList, deleteList, moveCartLineToList, addOrder, trackView, addReview])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore debe usarse dentro de <StoreProvider>')
  return context
}
