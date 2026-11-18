// Catálogo de la tienda. Los productos vienen del backend (GET /api/store/products/)
// y se cargan una sola vez al entrar a /tienda (ver CatalogGate en MarketApp.jsx).
// Los arreglos exportados se rellenan en sitio con setCatalog() para que todos los
// módulos que los importan vean siempre los mismos datos.
import { fallbackImage } from './fallbackImages'

export const products = []
export const categories = []
export const brands = []

export const cities = ['Cali', 'Bogotá', 'Medellín', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales', 'Palmira', 'Tuluá', 'Buga', 'Popayán', 'Pasto', 'Armenia', 'Ibagué', 'Neiva', 'Santa Marta', 'Villavicencio']

// Los materiales eléctricos no tienen variantes de color: se usa un único acabado.
const STANDARD = { name: 'Estándar', hex: '#4a4d57' }

const categoryDescriptions = {
  'Cables y conductores': 'Cable de cobre, conductores THHN/THWN y alambre para instalaciones.',
  'Control y protección': 'Contactores, guardamotores, breakers y mandos para tableros.',
  Automatización: 'PLC, variadores de frecuencia y control de procesos.',
  Iluminación: 'Luminarias LED herméticas, de emergencia e industriales.',
  Canalización: 'Tubería EMT, bandejas portacable y accesorios.',
  Tableros: 'Gabinetes metálicos y envolventes para control y distribución.',
  'Puesta a tierra': 'Varillas, conectores y materiales para mallas a tierra.',
  Consumibles: 'Cintas, amarres y consumibles de instalación.',
  'Dotación / EPP': 'Elementos de protección personal para trabajo eléctrico.',
}

export function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/["”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Convierte un producto del API público a la forma que usan las páginas de la tienda. */
export function toStoreProduct(p) {
  const stock = Number(p.stock) || 0
  return {
    id: String(p.code),
    slug: `${slugify(p.name)}-${slugify(p.code)}`,
    sku: String(p.code),
    name: p.name,
    brand: p.brand,
    category: slugify(p.category),
    categoryName: p.category,
    price: Number(p.sale_price) || 0,
    oldPrice: null,
    rating: 0,
    reviews: 0,
    stock,
    unit: p.unit,
    colors: [STANDARD],
    options: null,
    badges: stock > 0 && stock <= 3 ? ['Últimas unidades'] : [],
    date: p.created_at,
    summary: p.description || `${p.name} ${p.brand}.`,
    description: p.description || `${p.name} de ${p.brand}.`,
    highlights: [
      p.reference && `Referencia del fabricante: ${p.reference}`,
      `Unidad de venta: ${p.unit}`,
      `Marca ${p.brand}`,
    ].filter(Boolean),
    specs: {
      'Referencia del fabricante': p.reference || '—',
      'Unidad de venta': p.unit,
      Categoría: p.category,
    },
    // `art` es lo que pinta ProductArt: la imagen subida o una pública según el tipo de producto.
    art: p.image || fallbackImage(p.name, p.category),
  }
}

function replace(target, items) {
  target.splice(0, target.length, ...items)
}

export function setCatalog(apiProducts) {
  const list = apiProducts.map(toStoreProduct)
  replace(products, list)
  const names = [...new Set(apiProducts.map((p) => p.category))].sort((a, b) => a.localeCompare(b, 'es'))
  replace(categories, names.map((name) => ({
    id: slugify(name),
    name,
    description: categoryDescriptions[name] ?? `Productos de ${name.toLowerCase()}.`,
    art: fallbackImage(name),
  })))
  replace(brands, [...new Set(list.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, 'es')))
}
