import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Boxes, Eye, EyeOff, Layers, PackageSearch, Pencil, Plus, RefreshCw, Search, Trash2, Wallet } from 'lucide-react'
import ProductArt from '../../market/components/ProductArt'
import { invalidateCatalog } from '../../market/services/catalogService'
import { fallbackImage } from '../../market/data/fallbackImages'
import { formatPrice } from '../../market/lib/format'
import { Badge, ConfirmDialog, Toast } from '../ui'
import { button, cx, inputClass } from '../styles'
import ProductDrawer from './ProductDrawer'
import { deleteProduct, listProducts } from './productsApi'

const unique = (list) => [...new Set(list.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'))
const normalize = (text = '') => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const percent = (value) => `${(Number(value) * 100).toFixed(1)} %`

function Stat({ icon: Icon, label, value, detail, tone = 'indigo' }) {
  const tones = { indigo: 'bg-[#eceefb] text-secundario', orange: 'bg-[#fdeee6] text-principal', green: 'bg-[#e7f6ec] text-[#1d6b37]', gray: 'bg-[#eff0f4] text-[#555867]' }
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-[#e6e7ef] bg-white p-5">
      <span className={cx('grid size-11 shrink-0 place-items-center rounded-xl', tones[tone])}><Icon size={20} /></span>
      <div className="min-w-0">
        <p className="m-0 text-[12px] font-medium text-[#7a7d8c]">{label}</p>
        <p className="m-0 mt-0.5 truncate text-[22px] font-semibold tracking-[-.02em]">{value}</p>
        {detail && <p className="m-0 mt-0.5 text-[12px] text-[#8a8d9c]">{detail}</p>}
      </div>
    </div>
  )
}

function StockMeter({ product }) {
  const low = product.status !== 'OK'
  // La barra se llena al triple del mínimo: por debajo del mínimo queda en naranja.
  const ratio = Math.min(1, product.stock / Math.max(1, product.min_stock * 3))
  return (
    <div className="min-w-28">
      <p className="m-0 text-[13px]"><strong className={cx('font-semibold', low && 'text-principal')}>{product.stock}</strong> <span className="text-[#8a8d9c]">{product.unit}</span></p>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#eceef4]" aria-hidden="true"><div className={cx('h-full rounded-full', low ? 'bg-principal' : 'bg-[#1d8a4a]')} style={{ width: `${Math.max(4, ratio * 100)}%` }} /></div>
      <p className="m-0 mt-1 text-[11px] text-[#8a8d9c]">Mín. {product.min_stock}</p>
    </div>
  )
}

function Thumb({ product, size = 'size-12' }) {
  return (
    <span className={cx('relative block shrink-0 overflow-hidden rounded-lg bg-[#eef0f6]', size)}>
      <ProductArt type={product.image || fallbackImage(product.name, product.category)} />
      {!product.is_published && <span className="absolute inset-0 grid place-items-center bg-[#1f2230]/55 text-white" title="Oculto en la tienda"><EyeOff size={14} /></span>}
    </span>
  )
}

function RowActions({ product, onEdit, onDelete }) {
  return (
    <div className="flex justify-end gap-1">
      <button type="button" onClick={() => onEdit(product)} className="grid size-9 place-items-center rounded-lg text-[#5a5d6c] hover:bg-[#eceefb] hover:text-secundario" aria-label={`Editar ${product.name}`} title="Editar"><Pencil size={16} /></button>
      <button type="button" onClick={() => onDelete(product)} className="grid size-9 place-items-center rounded-lg text-[#5a5d6c] hover:bg-[#fdecea] hover:text-[#c4321c]" aria-label={`Eliminar ${product.name}`} title="Eliminar"><Trash2 size={16} /></button>
    </div>
  )
}

function EmptyState({ filtered, onCreate, onClear }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-[#dcdde8] bg-white px-6 py-16 text-center">
      <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-[#eceefb] text-secundario"><PackageSearch size={26} /></span>
      <h2 className="mb-1 text-[16px] font-semibold">{filtered ? 'Ningún producto coincide' : 'Aún no hay productos'}</h2>
      <p className="mb-5 max-w-sm text-[13px] text-[#7a7d8c]">{filtered ? 'Prueba con otra búsqueda o quita los filtros.' : 'Crea el primer producto del inventario para que aparezca en la tienda.'}</p>
      {filtered ? <button type="button" onClick={onClear} className={button('outline')}>Quitar filtros</button> : <button type="button" onClick={onCreate} className={button('primary')}><Plus size={16} /> Nuevo producto</button>}
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [stockFilter, setStockFilter] = useState('all')
  const [drawer, setDrawer] = useState(null) // { product: objeto | null }
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    listProducts()
      .then((list) => { if (active) { setProducts(list); setStatus('ready') } })
      .catch((error) => { if (active) { setLoadError(error.message); setStatus('error') } })
    return () => { active = false }
  }, [reloadKey])

  const suggestions = useMemo(() => ({
    categories: unique(products.map((p) => p.category)),
    brands: unique(products.map((p) => p.brand)),
    units: unique(products.map((p) => p.unit)),
    locations: unique(products.map((p) => p.location)),
    suppliers: unique(products.map((p) => p.supplier)),
  }), [products])

  const stats = useMemo(() => ({
    total: products.length,
    published: products.filter((p) => p.is_published).length,
    value: products.reduce((sum, p) => sum + Number(p.inventory_value), 0),
    restock: products.filter((p) => p.status !== 'OK').length,
    units: products.reduce((sum, p) => sum + p.stock, 0),
  }), [products])

  const visible = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean)
    return products.filter((p) => {
      const haystack = normalize(`${p.code} ${p.name} ${p.brand} ${p.reference} ${p.category}`)
      return words.every((w) => haystack.includes(w))
        && (!category || p.category === category)
        && (stockFilter === 'all' || (stockFilter === 'restock' ? p.status !== 'OK' : stockFilter === 'hidden' ? !p.is_published : p.status === 'OK'))
    })
  }, [products, query, category, stockFilter])

  const filtered = Boolean(query || category || stockFilter !== 'all')
  const clearFilters = () => { setQuery(''); setCategory(''); setStockFilter('all') }
  const closeDrawer = useCallback(() => setDrawer(null), [])
  const closeToast = useCallback(() => setToast(null), [])
  const cancelDelete = useCallback(() => setToDelete(null), [])

  function handleSaved(saved, editing) {
    setProducts((list) => (editing ? list.map((p) => (p.id === saved.id ? saved : p)) : [...list, saved].sort((a, b) => a.code.localeCompare(b.code))))
    setDrawer(null)
    invalidateCatalog()
    setToast({ message: editing ? `«${saved.name}» se actualizó.` : `«${saved.name}» se creó en el inventario.` })
  }

  async function confirmDelete() {
    setDeleting(true)
    try {
      await deleteProduct(toDelete.id)
      setProducts((list) => list.filter((p) => p.id !== toDelete.id))
      invalidateCatalog()
      setToast({ message: `«${toDelete.name}» se eliminó.` })
      setToDelete(null)
    } catch (error) {
      setToast({ tone: 'error', message: error.message })
    } finally {
      setDeleting(false)
    }
  }

  const filters = [
    { id: 'all', label: 'Todos', count: stats.total },
    { id: 'ok', label: 'En stock', count: stats.total - stats.restock },
    { id: 'restock', label: 'Por reponer', count: stats.restock },
    { id: 'hidden', label: 'Ocultos', count: stats.total - stats.published },
  ]

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[.16em] text-principal">Gestión</p>
          <h1 className="m-0 text-[28px] font-semibold tracking-[-.03em]">Productos</h1>
          <p className="m-0 mt-1 text-[14px] text-[#6c6f7e]">Inventario de SIEV y catálogo que ven los clientes en la tienda.</p>
        </div>
        <button type="button" onClick={() => setDrawer({ product: null })} className={button('primary', 'px-5 py-3 shadow-sm')}><Plus size={17} /> Nuevo producto</button>
      </div>

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Boxes} label="Productos" value={stats.total} detail={`${stats.published} visibles en la tienda`} />
        <Stat icon={Wallet} label="Valor del inventario" value={formatPrice(stats.value)} detail="Costo unitario × stock" tone="green" />
        <Stat icon={AlertTriangle} label="Por reponer" value={stats.restock} detail="Stock en el mínimo o por debajo" tone={stats.restock ? 'orange' : 'gray'} />
        <Stat icon={Layers} label="Unidades en stock" value={stats.units.toLocaleString('es-CO')} detail={`${suggestions.categories.length} categorías`} tone="gray" />
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#e6e7ef] bg-white p-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9dac]" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por código, nombre, marca o referencia" aria-label="Buscar productos" className={cx(inputClass, 'pl-10')} />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filtrar por categoría" className={cx(inputClass, 'lg:w-56')}>
          <option value="">Todas las categorías</option>
          {suggestions.categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-[#f2f3f8] p-1" role="group" aria-label="Filtrar por estado">
          {filters.map((f) => (
            <button key={f.id} type="button" onClick={() => setStockFilter(f.id)} aria-pressed={stockFilter === f.id}
              className={cx('flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold transition', stockFilter === f.id ? 'bg-white text-secundario shadow-sm' : 'text-[#6c6f7e] hover:text-[#1f2230]')}>
              {f.label} <span className={cx('rounded px-1.5 text-[11px]', stockFilter === f.id ? 'bg-[#eceefb]' : 'bg-white/70')}>{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {status === 'loading' && (
        <div className="space-y-2 rounded-2xl border border-[#e6e7ef] bg-white p-4" role="status" aria-label="Cargando productos">
          {[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-[#f1f2f7]" />)}
        </div>
      )}

      {status === 'error' && (
        <div className="grid place-items-center rounded-2xl border border-[#f3d2cc] bg-[#fff8f6] px-6 py-12 text-center">
          <AlertTriangle size={26} className="mb-3 text-[#c4321c]" />
          <p className="mb-4 text-[14px] text-[#5a5d6c]">{loadError}</p>
          <button type="button" onClick={() => { setStatus('loading'); setReloadKey((n) => n + 1) }} className={button('outline')}><RefreshCw size={15} /> Reintentar</button>
        </div>
      )}

      {status === 'ready' && (visible.length === 0 ? (
        <EmptyState filtered={filtered} onCreate={() => setDrawer({ product: null })} onClear={clearFilters} />
      ) : (
        <>
          {/* Escritorio: tabla */}
          <div className="hidden overflow-hidden rounded-2xl border border-[#e6e7ef] bg-white lg:block">
            <table className="w-full border-collapse text-left text-[13px]">
              <caption className="sr-only">Productos del inventario</caption>
              <thead className="bg-[#fafbfd] text-[11px] font-semibold uppercase tracking-[.08em] text-[#8a8d9c]">
                <tr>
                  <th scope="col" className="px-5 py-3">Producto</th>
                  <th scope="col" className="px-3 py-3">Categoría</th>
                  <th scope="col" className="px-3 py-3">Stock</th>
                  <th scope="col" className="px-3 py-3 text-right">Costo</th>
                  <th scope="col" className="px-3 py-3 text-right">Precio venta</th>
                  <th scope="col" className="px-3 py-3 text-right">Margen</th>
                  <th scope="col" className="px-3 py-3">Estado</th>
                  <th scope="col" className="px-5 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f1f6]">
                {visible.map((p) => (
                  <tr key={p.id} className="group transition hover:bg-[#fafbff]">
                    <td className="px-5 py-3">
                      <button type="button" onClick={() => setDrawer({ product: p })} className="flex items-center gap-3 text-left">
                        <Thumb product={p} />
                        <span className="min-w-0">
                          <span className="block max-w-[320px] truncate font-semibold text-[#1f2230] group-hover:text-secundario">{p.name}</span>
                          <span className="block text-[12px] text-[#8a8d9c]">{p.code} · {p.brand}{p.reference && p.reference !== 'Verificar con proveedor' ? ` · ${p.reference}` : ''}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-3 py-3 text-[#4a4d5c]">{p.category}</td>
                    <td className="px-3 py-3"><StockMeter product={p} /></td>
                    <td className="px-3 py-3 text-right tabular-nums text-[#6c6f7e]">{formatPrice(Number(p.unit_cost))}</td>
                    <td className="px-3 py-3 text-right font-semibold tabular-nums">{formatPrice(Number(p.sale_price))}</td>
                    <td className={cx('px-3 py-3 text-right tabular-nums', Number(p.margin) < 0 && 'text-[#c4321c]')}>{percent(p.margin)}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <Badge tone={p.status === 'OK' ? 'green' : 'orange'} dot>{p.status}</Badge>
                        {!p.is_published && <span className="inline-flex items-center gap-1 text-[11px] text-[#8a8d9c]"><EyeOff size={12} /> Oculto</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3"><RowActions product={p} onEdit={(product) => setDrawer({ product })} onDelete={setToDelete} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="m-0 border-t border-[#f0f1f6] px-5 py-3 text-[12px] text-[#8a8d9c]">{visible.length} de {products.length} productos</p>
          </div>

          {/* Móvil y tablet: tarjetas */}
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:hidden">
            {visible.map((p) => (
              <li key={p.id} className="rounded-2xl border border-[#e6e7ef] bg-white p-4">
                <div className="mb-3 flex items-start gap-3">
                  <Thumb product={p} size="size-16" />
                  <div className="min-w-0 flex-1">
                    <p className="m-0 line-clamp-2 text-[14px] font-semibold leading-snug">{p.name}</p>
                    <p className="m-0 mt-0.5 text-[12px] text-[#8a8d9c]">{p.code} · {p.brand}</p>
                  </div>
                  <Badge tone={p.status === 'OK' ? 'green' : 'orange'} dot>{p.status}</Badge>
                </div>
                <dl className="m-0 mb-3 grid grid-cols-3 gap-2 text-[12px]">
                  <div><dt className="text-[#8a8d9c]">Stock</dt><dd className="m-0 font-semibold">{p.stock} <span className="font-normal text-[#8a8d9c]">/ mín. {p.min_stock}</span></dd></div>
                  <div><dt className="text-[#8a8d9c]">Precio</dt><dd className="m-0 font-semibold">{formatPrice(Number(p.sale_price))}</dd></div>
                  <div><dt className="text-[#8a8d9c]">Margen</dt><dd className="m-0 font-semibold">{percent(p.margin)}</dd></div>
                </dl>
                <div className="flex items-center justify-between border-t border-[#f0f1f6] pt-3">
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-[#6c6f7e]">{p.is_published ? <><Eye size={13} /> Visible</> : <><EyeOff size={13} /> Oculto</>}</span>
                  <RowActions product={p} onEdit={(product) => setDrawer({ product })} onDelete={setToDelete} />
                </div>
              </li>
            ))}
          </ul>
        </>
      ))}

      {drawer && <ProductDrawer key={drawer.product?.id ?? 'new'} product={drawer.product} suggestions={suggestions} onClose={closeDrawer} onSaved={handleSaved} />}

      {toDelete && (
        <ConfirmDialog title="¿Eliminar este producto?" busy={deleting} onConfirm={confirmDelete} onCancel={cancelDelete}>
          Se eliminará <strong>{toDelete.name}</strong> ({toDelete.code}) del inventario y dejará de aparecer en la tienda. Esta acción no se puede deshacer.
        </ConfirmDialog>
      )}

      <Toast toast={toast} onClose={closeToast} />
    </>
  )
}
