import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ChevronLeft, ChevronRight, LayoutGrid, List, SearchX, SlidersHorizontal, Star, X } from 'lucide-react'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import { Breadcrumbs, EmptyState } from '../components/ui'
import { button, cx, inputClass } from '../components/styles'
import { categories } from '../data/catalog'
import { searchProducts, sortOptions } from '../services/catalogService'
import { useAsync } from '../lib/useAsync'
import { formatPrice, plural } from '../lib/format'
import { paths } from '../routes'

const priceRanges = [
  { label: 'Hasta $500.000', min: null, max: 500000 },
  { label: '$500.000 a $1.500.000', min: 500000, max: 1500000 },
  { label: '$1.500.000 a $3.000.000', min: 1500000, max: 3000000 },
  { label: '$3.000.000 a $5.000.000', min: 3000000, max: 5000000 },
  { label: 'Más de $5.000.000', min: 5000000, max: null },
]

function readFilters(params) {
  const num = (k) => (params.get(k) ? Number(params.get(k)) : null)
  return {
    q: params.get('q') ?? '',
    category: params.get('categoria') ?? '',
    brands: params.get('marcas')?.split(',').filter(Boolean) ?? [],
    min: num('min'),
    max: num('max'),
    rating: Number(params.get('calificacion') ?? 0),
    inStock: params.get('disponible') === '1',
    onSale: params.get('oferta') === '1',
    sort: params.get('orden') ?? 'relevancia',
    page: Number(params.get('pagina') ?? 1),
  }
}

function FilterGroup({ title, children }) {
  return (
    <fieldset className="border-b border-[#e6e6eb] py-5 first:pt-0">
      <legend className="float-left mb-3 w-full text-[11px] font-bold uppercase tracking-[.15em] text-[#222630]">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  )
}

function Check({ checked, onChange, children, count }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-[#4a4d57] hover:text-secundario">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-[#2d3484]" />
      <span className="flex-1">{children}</span>
      {count != null && <span className="text-[11px] text-[#9a9ca5]">{count}</span>}
    </label>
  )
}

function Filters({ filters, facets, update }) {
  const [min, setMin] = useState(filters.min ?? '')
  const [max, setMax] = useState(filters.max ?? '')

  const toggleBrand = (brand) => {
    const next = filters.brands.includes(brand) ? filters.brands.filter((b) => b !== brand) : [...filters.brands, brand]
    update({ marcas: next.join(',') })
  }

  return (
    <div>
      <FilterGroup title="Categoría">
        <ul className="space-y-0.5 text-[13px]">
          <li><button type="button" onClick={() => update({ categoria: '' })} className={cx('w-full py-1.5 text-left hover:text-secundario', !filters.category && 'font-semibold text-secundario')}>Todas las categorías</button></li>
          {facets.categories.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => update({ categoria: c.id, marcas: '' })} aria-pressed={filters.category === c.id}
                className={cx('flex w-full justify-between py-1.5 text-left hover:text-secundario', filters.category === c.id ? 'font-semibold text-secundario' : 'text-[#4a4d57]')}>
                <span>{c.name}</span><span className="text-[11px] font-normal text-[#9a9ca5]">{c.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Marca">
        {facets.brands.map((b) => <Check key={b.name} checked={filters.brands.includes(b.name)} onChange={() => toggleBrand(b.name)} count={b.count}>{b.name}</Check>)}
      </FilterGroup>

      <FilterGroup title="Precio">
        <div className="mb-3 space-y-0.5">
          {priceRanges.map((r) => {
            const active = filters.min === r.min && filters.max === r.max
            return <button key={r.label} type="button" aria-pressed={active} onClick={() => update(active ? { min: '', max: '' } : { min: r.min ?? '', max: r.max ?? '' })} className={cx('block w-full py-1.5 text-left text-[13px] hover:text-secundario', active ? 'font-semibold text-secundario' : 'text-[#4a4d57]')}>{r.label}</button>
          })}
        </div>
        <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); update({ min: min === '' ? '' : Math.max(0, Number(min)), max: max === '' ? '' : Number(max) }) }}>
          <label className="flex-1 text-[11px] text-[#73757d]">Mínimo<input type="number" min="0" step="50000" inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} className={cx(inputClass, 'mt-1 px-2 py-2')} placeholder="$0" /></label>
          <label className="flex-1 text-[11px] text-[#73757d]">Máximo<input type="number" min="0" step="50000" inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} className={cx(inputClass, 'mt-1 px-2 py-2')} placeholder="Sin límite" /></label>
          <button type="submit" className="grid h-[38px] w-10 shrink-0 place-items-center bg-secundario text-white" aria-label="Aplicar rango de precio"><ChevronRight size={16} /></button>
        </form>
      </FilterGroup>

      <FilterGroup title="Calificación">
        {[4.5, 4, 3].map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-[#4a4d57] hover:text-secundario">
            <input type="radio" name="rating" checked={filters.rating === r} onChange={() => update({ calificacion: r })} className="size-4 accent-[#2d3484]" />
            <span className="flex items-center gap-1"><Star size={13} className="text-principal" fill="currentColor" strokeWidth={0} /> {r} o más</span>
          </label>
        ))}
        {filters.rating > 0 && <button type="button" onClick={() => update({ calificacion: '' })} className="mt-1 text-[12px] font-semibold text-secundario hover:underline">Quitar filtro</button>}
      </FilterGroup>

      <FilterGroup title="Disponibilidad">
        <Check checked={filters.inStock} onChange={() => update({ disponible: filters.inStock ? '' : '1' })}>Solo productos disponibles</Check>
        <Check checked={filters.onSale} onChange={() => update({ oferta: filters.onSale ? '' : '1' })}>Solo productos en oferta</Check>
      </FilterGroup>
    </div>
  )
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <nav aria-label="Paginación" className="mt-10 flex items-center justify-center gap-1.5">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className="grid size-10 place-items-center border border-[#dddfe5] bg-white disabled:opacity-40" aria-label="Página anterior"><ChevronLeft size={16} /></button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined} className={cx('size-10 border text-[13px] font-semibold', n === page ? 'border-secundario bg-secundario text-white' : 'border-[#dddfe5] bg-white hover:border-secundario')}>{n}</button>
      ))}
      <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="grid size-10 place-items-center border border-[#dddfe5] bg-white disabled:opacity-40" aria-label="Página siguiente"><ChevronRight size={16} /></button>
    </nav>
  )
}

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [drawer, setDrawer] = useState(false)
  const filters = readFilters(params)
  const view = params.get('vista') === 'lista' ? 'list' : 'grid'
  const { data, loading } = useAsync(() => searchProducts(filters), params.toString())
  const category = categories.find((c) => c.id === filters.category)

  function update(changes, { resetPage = true } = {}) {
    const next = new URLSearchParams(params)
    Object.entries(changes).forEach(([k, v]) => (v === '' || v == null ? next.delete(k) : next.set(k, String(v))))
    if (resetPage && !('pagina' in changes)) next.delete('pagina')
    setParams(next)
  }

  useEffect(() => {
    if (!drawer) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [drawer])

  const chips = [
    filters.q && { label: `“${filters.q}”`, clear: { q: '' } },
    category && { label: category.name, clear: { categoria: '' } },
    ...filters.brands.map((b) => ({ label: b, clear: { marcas: filters.brands.filter((x) => x !== b).join(',') } })),
    (filters.min != null || filters.max != null) && { label: `${filters.min != null ? formatPrice(filters.min) : '$0'} – ${filters.max != null ? formatPrice(filters.max) : 'sin límite'}`, clear: { min: '', max: '' } },
    filters.rating > 0 && { label: `${filters.rating}★ o más`, clear: { calificacion: '' } },
    filters.inStock && { label: 'Disponibles', clear: { disponible: '' } },
    filters.onSale && { label: 'En oferta', clear: { oferta: '' } },
  ].filter(Boolean)

  const title = filters.q ? `Resultados para “${filters.q}”` : category ? category.name : filters.onSale ? 'Ofertas' : 'Todos los productos'

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8">
      <Breadcrumbs items={[{ label: 'Inicio', to: paths.home }, category ? { label: 'Catálogo', to: paths.catalog() } : null, { label: category?.name ?? (filters.q ? 'Búsqueda' : 'Catálogo') }].filter(Boolean)} />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#e2e2e8] pb-6">
        <div>
          <h1 className="mb-2 text-[clamp(28px,3.2vw,42px)] font-semibold leading-tight tracking-[-.045em]">{title}</h1>
          <p className="m-0 text-[13px] text-[#626570]" aria-live="polite">{loading && !data ? 'Buscando productos…' : plural(data?.total ?? 0, 'producto encontrado', 'productos encontrados')}{category && ` · ${category.description}`}</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <button type="button" onClick={() => setDrawer(true)} className={button('subtle', 'flex-1 py-2.5 lg:hidden')}><SlidersHorizontal size={15} /> Filtros{chips.length > 0 && ` (${chips.length})`}</button>
          <label className="flex flex-1 items-center gap-2 text-[12px] text-[#626570] sm:flex-none">
            <span className="hidden sm:inline">Ordenar por</span>
            <select value={filters.sort} onChange={(e) => update({ orden: e.target.value })} className={cx(inputClass, 'w-full bg-white py-2.5 font-semibold sm:w-48')} aria-label="Ordenar productos">
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <div className="hidden border border-[#dddfe5] bg-white sm:flex" role="group" aria-label="Tipo de vista">
            <button type="button" aria-pressed={view === 'grid'} aria-label="Vista en cuadrícula" onClick={() => update({ vista: '' }, { resetPage: false })} className={cx('grid size-10 place-items-center', view === 'grid' ? 'bg-secundario text-white' : 'text-[#626570]')}><LayoutGrid size={16} /></button>
            <button type="button" aria-pressed={view === 'list'} aria-label="Vista en lista" onClick={() => update({ vista: 'lista' }, { resetPage: false })} className={cx('grid size-10 place-items-center', view === 'list' ? 'bg-secundario text-white' : 'text-[#626570]')}><List size={16} /></button>
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button key={chip.label} type="button" onClick={() => update(chip.clear)} className="inline-flex items-center gap-1.5 border border-secundario bg-[#f0f0f8] px-3 py-1.5 text-[12px] font-semibold text-secundario hover:bg-secundario hover:text-white" aria-label={`Quitar filtro ${chip.label}`}>
              {chip.label} <X size={13} />
            </button>
          ))}
          <Link to={paths.catalog()} className="ml-1 text-[12px] font-semibold text-[#626570] underline-offset-2 hover:underline">Limpiar todo</Link>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtros">{data && <Filters key={`${filters.min}-${filters.max}`} filters={filters} facets={data.facets} update={update} />}</aside>

        <section aria-label="Resultados" className={cx('transition-opacity', loading && data && 'opacity-60')}>
          {!data ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <ProductCardSkeleton key={i} />)}</div>
          ) : data.items.length === 0 ? (
            <EmptyState icon={SearchX} title="No encontramos productos" action={<Link to={paths.catalog()} className={button('primary')}>Ver todo el catálogo</Link>}>
              Prueba con otras palabras o quita algunos filtros para ver más resultados.
            </EmptyState>
          ) : (
            <>
              <div className={view === 'list' ? 'grid gap-4' : 'grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3'}>
                {data.items.map((p) => <ProductCard key={p.id} product={p} layout={view} />)}
              </div>
              <Pagination page={data.page} totalPages={data.totalPages} onChange={(n) => { update({ pagina: n === 1 ? '' : n }, { resetPage: false }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
            </>
          )}
        </section>
      </div>

      {drawer && data && (
        <div className="mk-fade fixed inset-0 z-[65] bg-[#15182bb3] lg:hidden" onMouseDown={(e) => { if (e.target === e.currentTarget) setDrawer(false) }}>
          <aside role="dialog" aria-modal="true" aria-label="Filtros" className="mk-drawer-left flex h-full w-[88%] max-w-sm flex-col bg-white">
            <div className="flex items-center justify-between border-b border-[#eeeef2] px-5 py-4">
              <h2 className="m-0 text-[18px] font-semibold">Filtros</h2>
              <button type="button" autoFocus onClick={() => setDrawer(false)} aria-label="Cerrar filtros" className="grid size-9 place-items-center"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5"><Filters key={`${filters.min}-${filters.max}`} filters={filters} facets={data.facets} update={update} /></div>
            <div className="grid grid-cols-2 gap-2 border-t border-[#eeeef2] p-4">
              <Link to={paths.catalog()} onClick={() => setDrawer(false)} className={button('subtle')}>Limpiar</Link>
              <button type="button" onClick={() => setDrawer(false)} className={button('secondary')}>Ver {data.total}</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
