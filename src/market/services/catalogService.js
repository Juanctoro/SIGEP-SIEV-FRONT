// Capa de servicios del marketplace.
// El catálogo se descarga una vez del endpoint público GET /api/store/products/
// (loadCatalog) y la búsqueda, filtros y orden se resuelven en el navegador.

import { api } from '../../lib/api'
import { brands, categories, products, setCatalog } from '../data/catalog'
import { generateReviews, ratingDistribution } from '../data/reviews'


let catalogPromise = null
/** Descarga el catálogo público. Se reutiliza la misma petición; tras un error se puede reintentar. */
export function loadCatalog() {
  catalogPromise ??= api('/api/store/products/', { auth: false })
    .then((list) => { setCatalog(list) })
    .catch((error) => { catalogPromise = null; throw error })
  return catalogPromise
}

/** Fuerza a descargar de nuevo el catálogo la próxima vez que se entre a la tienda. */
export function invalidateCatalog() {
  catalogPromise = null
}

export const discountPercent = (product) =>
  product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0

const normalize = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function matchesQuery(product, query) {
  if (!query) return true
  const haystack = normalize(`${product.name} ${product.brand} ${product.categoryName} ${product.summary}`)
  return normalize(query).split(/\s+/).filter(Boolean).every((word) => haystack.includes(word))
}

const sorters = {
  relevancia: (a, b) => b.reviews * b.rating - a.reviews * a.rating,
  'precio-asc': (a, b) => a.price - b.price,
  'precio-desc': (a, b) => b.price - a.price,
  calificacion: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  novedades: (a, b) => new Date(b.date) - new Date(a.date),
  descuento: (a, b) => discountPercent(b) - discountPercent(a),
}

export const sortOptions = [
  { value: 'relevancia', label: 'Más relevantes' },
  { value: 'precio-asc', label: 'Menor precio' },
  { value: 'precio-desc', label: 'Mayor precio' },
  { value: 'calificacion', label: 'Mejor calificados' },
  { value: 'novedades', label: 'Novedades' },
  { value: 'descuento', label: 'Mayor descuento' },
]

/**
 * Búsqueda con filtros, orden y paginación.
 * Se resuelve en el navegador sobre el catálogo cargado (pocos productos). Si crece, mover a
 * GET /api/store/products/?search=&category= y paginar en el backend.
 */
export async function searchProducts({ q = '', category = '', brands: brandFilter = [], min = null, max = null, rating = 0, inStock = false, onSale = false, sort = 'relevancia', page = 1, pageSize = 12 } = {}) {
  const base = products.filter((p) => matchesQuery(p, q) && (!category || p.category === category))

  const filtered = base.filter((p) =>
    (!brandFilter.length || brandFilter.includes(p.brand)) &&
    (min == null || p.price >= min) &&
    (max == null || p.price <= max) &&
    p.rating >= rating &&
    (!inStock || p.stock > 0) &&
    (!onSale || p.oldPrice),
  )

  const sorted = [...filtered].sort(sorters[sort] ?? sorters.relevancia)
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = Math.min(Math.max(1, page), totalPages)

  // Facetas calculadas sobre la búsqueda base para que el usuario vea las opciones disponibles.
  const brandFacets = brands
    .map((name) => ({ name, count: base.filter((p) => p.brand === name).length }))
    .filter((b) => b.count > 0)
  const categoryFacets = categories
    .map((c) => ({ ...c, count: products.filter((p) => p.category === c.id && matchesQuery(p, q)).length }))
    .filter((c) => c.count > 0)
  const prices = base.map((p) => p.price)

  return {
    items: sorted.slice((current - 1) * pageSize, current * pageSize),
    total: sorted.length,
    page: current,
    totalPages,
    facets: {
      brands: brandFacets,
      categories: categoryFacets,
      priceRange: prices.length ? [Math.min(...prices), Math.max(...prices)] : [0, 0],
    },
  }
}

/** Producto por slug (desde el catálogo cargado). */
export async function getProductBySlug(slug) {
  const product = products.find((p) => p.slug === slug)
  if (!product) return null
  // Productos sin reseñas reales: no se generan reseñas de demostración.
  if (!product.reviews) return { ...product, reviewList: [], distribution: [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 })) }
  return { ...product, reviewList: generateReviews(product), distribution: ratingDistribution(product) }
}

/** Relacionados: misma categoría y luego misma marca. */
export async function getRelatedProducts(product, limit = 4) {
  const sameCategory = products.filter((p) => p.category === product.category && p.id !== product.id)
  const others = products.filter((p) => p.category !== product.category && p.brand === product.brand)
  return [...sameCategory, ...others].slice(0, limit)
}

/** Secciones destacadas de la tienda. */
export async function getHomeSections() {
  return {
    deals: [...products].filter((p) => p.oldPrice && p.stock > 0).sort(sorters.descuento).slice(0, 8),
    bestSellers: [...products].sort(sorters.relevancia).slice(0, 8),
    newArrivals: [...products].sort(sorters.novedades).slice(0, 4),
  }
}

/** Búsqueda rápida para el autocompletado del encabezado (síncrona, solo local). */
export function quickSearch(query, limit = 6) {
  if (query.trim().length < 2) return []
  return products.filter((p) => matchesQuery(p, query)).slice(0, limit)
}

export function getProductsByIds(ids) {
  return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean)
}

export function findProduct(id) {
  return products.find((p) => p.id === id) ?? null
}

/** Totales del carrito. El envío y la forma de pago se acuerdan por WhatsApp. */
export function computeTotals(lines) {
  return {
    subtotal: lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0),
    savings: lines.reduce((sum, line) => sum + (line.unitOldPrice ? (line.unitOldPrice - line.unitPrice) * line.qty : 0), 0),
    count: lines.reduce((n, l) => n + l.qty, 0),
  }
}

/**
 * Registra el pedido antes de enviarlo por WhatsApp. Hoy solo genera el número de
 * pedido localmente; si más adelante se guarda en el backend: POST /api/pedidos.
 */
export function createOrder(payload) {
  const id = `SV-${Date.now().toString().slice(-8)}`
  return { ...payload, id, status: 'enviado', channel: 'whatsapp', createdAt: new Date().toISOString() }
}
