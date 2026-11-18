// Cliente HTTP del backend SIGEP-SIEV (Django + JWT).
// Toda petición al API debe pasar por `api()`: añade el token, renueva el access
// token cuando expira y normaliza los errores.

export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000').replace(/\/+$/, '')

const ACCESS_KEY = 'siev.access'
const REFRESH_KEY = 'siev.refresh'

function read(key) {
  try { return localStorage.getItem(key) } catch { return null }
}

export const tokens = {
  get access() { return read(ACCESS_KEY) },
  get refresh() { return read(REFRESH_KEY) },
  save({ access, refresh }) {
    try {
      if (access) localStorage.setItem(ACCESS_KEY, access)
      if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
    } catch { /* almacenamiento no disponible: la sesión dura lo que la pestaña */ }
  },
  clear() {
    try { localStorage.removeItem(ACCESS_KEY); localStorage.removeItem(REFRESH_KEY) } catch { /* sin almacenamiento */ }
  },
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data
  }
}

// Se llama cuando la sesión deja de ser válida (refresh caducado o revocado).
let onUnauthorized = () => {}
export function setUnauthorizedHandler(handler) { onUnauthorized = handler }

function errorMessage(status, data) {
  if (status === 0) return 'No fue posible conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.'
  if (data?.detail) return String(data.detail)
  if (data && typeof data === 'object') {
    const first = Object.values(data).flat().find((value) => typeof value === 'string')
    if (first) return first
  }
  if (status >= 500) return 'El servidor tuvo un problema. Inténtalo más tarde.'
  return 'No fue posible completar la solicitud.'
}

async function send(path, { body, headers, auth = true, responseType: _responseType, ...options }) {
  const finalHeaders = { Accept: 'application/json', ...headers }
  // FormData (archivos) lo envía el navegador con su propio Content-Type multipart.
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData
  if (body !== undefined && !isForm) finalHeaders['Content-Type'] = 'application/json'
  if (auth && tokens.access) finalHeaders.Authorization = `Bearer ${tokens.access}`
  try {
    return await fetch(`${API_URL}${path}`, { ...options, headers: finalHeaders, body: body === undefined || isForm ? body : JSON.stringify(body) })
  } catch {
    throw new ApiError(errorMessage(0), 0, null)
  }
}

// Varias peticiones que fallen a la vez con 401 comparten una sola renovación.
let refreshing = null
function refreshAccess() {
  refreshing ??= (async () => {
    const refresh = tokens.refresh
    if (!refresh) return false
    const response = await send('/api/auth/token/refresh', { method: 'POST', body: { refresh }, auth: false }).catch(() => null)
    if (!response?.ok) return false
    tokens.save(await response.json())
    return true
  })().finally(() => { refreshing = null })
  return refreshing
}

async function parse(response) {
  if (response.status === 204) return null
  const text = await response.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return text }
}

/**
 * Llama al backend. `path` empieza con `/api/...`.
 * Opciones: method, body (objeto → JSON, o FormData → multipart), headers, auth (false para rutas públicas),
 * responseType: 'blob' para descargar archivos.
 */
export async function api(path, options = {}) {
  let response = await send(path, options)
  if (response.status === 401 && options.auth !== false && tokens.access) {
    if (await refreshAccess()) response = await send(path, options)
    if (response.status === 401) { tokens.clear(); onUnauthorized() }
  }
  // Archivos (p. ej. PDF de cotizaciones): se devuelven como Blob.
  if (options.responseType === 'blob' && response.ok) return response.blob()
  const data = await parse(response)
  if (!response.ok) throw new ApiError(errorMessage(response.status, data), response.status, data)
  return data
}
