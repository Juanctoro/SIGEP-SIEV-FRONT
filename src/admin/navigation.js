import { FileText, Package } from 'lucide-react'

// Menú del panel. Cada opción declara qué roles la ven; el sidebar filtra con canSee().
// Cuando el backend exponga roles reales, solo hay que cambiar userRoles().
export const adminNav = [
  {
    title: 'Gestión',
    items: [
      { to: '/admin/productos', label: 'Productos', description: 'Inventario y catálogo de la tienda', icon: Package, roles: ['admin'] },
      { to: '/admin/cotizaciones', label: 'Cotizaciones', description: 'Propuestas comerciales', icon: FileText, roles: ['admin'] },
    ],
  },
]

export function userRoles(user) {
  if (!user) return []
  return user.isStaff || user.isSuperuser ? ['admin'] : []
}

export const canSee = (user, item) => !item.roles?.length || item.roles.some((role) => userRoles(user).includes(role))

export function visibleNav(user) {
  return adminNav
    .map((section) => ({ ...section, items: section.items.filter((item) => canSee(user, item)) }))
    .filter((section) => section.items.length)
}
