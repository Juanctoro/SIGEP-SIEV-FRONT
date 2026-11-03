// Rutas del marketplace. Viven bajo /tienda para convivir con la landing y el login.
export const BASE = '/tienda'

export const paths = {
  home: BASE,
  catalog: (params) => {
    const query = params ? new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== '')).toString() : ''
    return `${BASE}/catalogo${query ? `?${query}` : ''}`
  },
  category: (id) => `${BASE}/catalogo?categoria=${id}`,
  product: (slug) => `${BASE}/producto/${slug}`,
  cart: `${BASE}/carrito`,
  lists: `${BASE}/listas`,
  list: (id) => `${BASE}/listas/${id}`,
  checkout: `${BASE}/checkout`,
  orders: `${BASE}/pedidos`,
  order: (id) => `${BASE}/pedidos/${id}`,
  help: `${BASE}/ayuda`,
}
