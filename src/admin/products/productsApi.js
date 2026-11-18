// CRUD de productos (solo is_staff). Endpoints: /api/products/ y /api/products/:id/
import { api } from '../../lib/api'

export const PRODUCT_FIELDS = ['code', 'name', 'category', 'brand', 'reference', 'unit', 'stock', 'min_stock', 'unit_cost', 'sale_price', 'location', 'supplier', 'description', 'is_published']

export function listProducts() {
  return api('/api/products/')
}

/** Crea (sin id) o actualiza (con id). Se envía multipart para poder adjuntar la imagen. */
export function saveProduct(id, values, { image = null, removeImage = false } = {}) {
  const form = new FormData()
  for (const field of PRODUCT_FIELDS) {
    const value = values[field]
    form.append(field, typeof value === 'boolean' ? String(value) : String(value ?? '').trim())
  }
  if (image) form.append('image', image)
  else if (removeImage) form.append('remove_image', 'true')
  return api(id ? `/api/products/${id}/` : '/api/products/', { method: id ? 'PATCH' : 'POST', body: form })
}

export function deleteProduct(id) {
  return api(`/api/products/${id}/`, { method: 'DELETE' })
}

// Mismos cálculos que el backend (products/models.py), para la vista previa del formulario.
export function computeMetrics({ stock, min_stock, unit_cost, sale_price }) {
  const cost = Number(unit_cost) || 0
  const price = Number(sale_price) || 0
  const units = Number(stock) || 0
  return {
    margin: price ? (price - cost) / price : 0,
    inventoryValue: cost * units,
    status: units <= (Number(min_stock) || 0) ? 'Reponer' : 'OK',
  }
}
