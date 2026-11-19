// Cotizaciones (solo is_staff). El PDF lo genera el backend al crear o editar.
import { api } from '../../lib/api'

export const IVA_RATE = 0.19

export const DELIVERY_OPTIONS = ['Inmediata', '3 días hábiles', '5 días hábiles', '8 días hábiles', '15 días hábiles', '30 días hábiles']
export const PAYMENT_OPTIONS = ['Contado', 'Contra entrega', '50 % anticipo, 50 % contra entrega', 'Crédito a 30 días', 'Crédito a 60 días']

export const listQuotes = () => api('/api/quotes/')
export const getQuote = (id) => api(`/api/quotes/${id}/`)
export const deleteQuote = (id) => api(`/api/quotes/${id}/`, { method: 'DELETE' })
export const searchClients = (search) => api(`/api/quotes/clients/?search=${encodeURIComponent(search)}`)

export function saveQuote(id, payload) {
  return api(id ? `/api/quotes/${id}/` : '/api/quotes/', { method: id ? 'PUT' : 'POST', body: payload })
}

/**
 * Abre o descarga el PDF. El endpoint exige token, así que se pide como Blob.
 * La pestaña se abre antes de la petición para que el navegador no la bloquee.
 */
export async function openQuotePdf(quote, { download = false } = {}) {
  const tab = download ? null : window.open('', '_blank')
  try {
    const blob = await api(`/api/quotes/${quote.id}/pdf/`, { responseType: 'blob' })
    const url = URL.createObjectURL(blob)
    if (tab) {
      tab.location.href = url
    } else {
      const link = Object.assign(document.createElement('a'), { href: url, download: `${quote.number}.pdf` })
      document.body.append(link)
      link.click()
      link.remove()
    }
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (error) {
    tab?.close()
    throw error
  }
}

/** Totales con la misma regla del backend: (productos + mano de obra) + IVA 19 %. */
export function computeTotals(items, laborCost) {
  const round = (value) => Math.round(value * 100) / 100
  const products = round(items.reduce((sum, item) => sum + Number(item.unit_price) * (Number(item.quantity) || 0), 0))
  const labor = Number(laborCost) || 0
  const subtotal = round(products + labor)
  const iva = round(subtotal * IVA_RATE)
  return { products, labor, subtotal, iva, total: round(subtotal + iva) }
}
