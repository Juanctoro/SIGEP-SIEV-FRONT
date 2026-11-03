import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { BadgeCheck, Check, Heart, ListPlus, MessageCircle, PackageX, Share2, ShieldCheck, ShoppingCart, Store, ThumbsUp, Truck } from 'lucide-react'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'
import { Badge, Breadcrumbs, EmptyState, Price, QuantityInput, Rating, SectionHeading, Skeleton } from '../components/ui'
import { button, cx, inputClass } from '../components/styles'
import { useStore } from '../context/StoreContext'
import { priceFor } from '../lib/cart'
import { getProductBySlug, getRelatedProducts } from '../services/catalogService'
import { useAsync } from '../lib/useAsync'
import { formatDate, formatPrice, plural } from '../lib/format'
import { buildProductQuestion, storeAddress, whatsappUrl } from '../lib/whatsapp'
import { paths } from '../routes'

const views = ['Vista frontal', 'Detalle', 'Medidas', 'Colores']

function Gallery({ product, color }) {
  const [view, setView] = useState(0)
  return (
    <div className="lg:sticky lg:top-36 lg:self-start">
      <div className="relative aspect-[4/3] border border-[#e6e6eb] bg-[#f3f3f0]">
        <ProductArt type={product.art} color={color.hex} colors={product.colors} view={view} label={`${product.name}, ${views[view].toLowerCase()}, color ${color.name}`} />
        <span className="absolute bottom-3 left-4 text-[9px] tracking-[.14em] text-[#555966]">ILUSTRACIÓN DE REFERENCIA / {views[view].toUpperCase()}</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3" role="group" aria-label="Imágenes del producto">
        {views.map((label, i) => (
          <button key={label} type="button" onClick={() => setView(i)} aria-pressed={view === i} aria-label={label}
            className={cx('aspect-[4/3] border bg-[#f3f3f0] transition', view === i ? 'border-secundario ring-1 ring-secundario' : 'border-[#e6e6eb] hover:border-[#b9bccb]')}>
            <ProductArt type={product.art} color={color.hex} colors={product.colors} view={i} />
          </button>
        ))}
      </div>
    </div>
  )
}

function Reviews({ product }) {
  const { myReviews, addReview } = useStore()
  const mine = myReviews[product.id] ?? []
  const all = [...mine, ...product.reviewList]
  const total = product.reviews + mine.length
  const [form, setForm] = useState({ rating: 0, title: '', body: '', author: '' })
  const [errors, setErrors] = useState({})
  const [open, setOpen] = useState(false)
  const [helpful, setHelpful] = useState({})

  function submit(e) {
    e.preventDefault()
    const next = {}
    if (!form.rating) next.rating = 'Selecciona una calificación.'
    if (form.title.trim().length < 3) next.title = 'Escribe un título (mínimo 3 caracteres).'
    if (form.body.trim().length < 15) next.body = 'Cuéntanos un poco más (mínimo 15 caracteres).'
    if (form.author.trim().length < 2) next.author = 'Escribe tu nombre.'
    setErrors(next)
    if (Object.keys(next).length) return
    addReview(product.id, { id: `mine-${Date.now()}`, ...form, author: form.author.trim(), city: 'Colombia', date: new Date().toISOString(), verified: false, helpful: 0, mine: true })
    setForm({ rating: 0, title: '', body: '', author: '' })
    setOpen(false)
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
      <div>
        <p className="m-0 text-[52px] font-semibold leading-none tracking-[-.05em]">{product.rating.toFixed(1)}</p>
        <div className="my-2"><Rating value={product.rating} size={18} /></div>
        <p className="mb-5 text-[13px] text-[#626570]">{plural(total, 'reseña')}</p>
        <ul className="space-y-1.5">
          {product.distribution.map((d) => (
            <li key={d.stars} className="flex items-center gap-3 text-[12px]">
              <span className="w-8">{d.stars} ★</span>
              <span className="h-1.5 flex-1 bg-[#ececf0]"><span className="block h-full bg-principal" style={{ width: `${(d.count / product.reviews) * 100}%` }} /></span>
              <span className="w-8 text-right text-[#73757d]">{d.count}</span>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={button('outline', 'mt-6 w-full')}>Escribir una reseña</button>
      </div>

      <div>
        {open && (
          <form onSubmit={submit} noValidate className="mk-pop mb-8 border border-[#e2e2e8] bg-white p-5">
            <h3 className="mb-4 text-[17px] font-semibold">Tu opinión sobre este producto</h3>
            <fieldset className="mb-4">
              <legend className="mb-1.5 text-[12px] font-semibold">Calificación</legend>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} aria-label={`${n} estrellas`} aria-pressed={form.rating === n} className={cx('text-[26px] leading-none transition', n <= form.rating ? 'text-principal' : 'text-[#d8d9df] hover:text-[#f0a582]')}>★</button>
                ))}
              </div>
              {errors.rating && <p className="mt-1 text-[12px] text-[#b42318]">{errors.rating}</p>}
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="rv-title" className="text-[12px] font-semibold">Título</label><input id="rv-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={cx(inputClass, 'mt-1.5')} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'rv-title-error' : undefined} maxLength={60} />{errors.title && <p id="rv-title-error" className="mt-1 text-[12px] text-[#b42318]">{errors.title}</p>}</div>
              <div><label htmlFor="rv-author" className="text-[12px] font-semibold">Tu nombre</label><input id="rv-author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={cx(inputClass, 'mt-1.5')} aria-invalid={!!errors.author} aria-describedby={errors.author ? 'rv-author-error' : undefined} maxLength={40} />{errors.author && <p id="rv-author-error" className="mt-1 text-[12px] text-[#b42318]">{errors.author}</p>}</div>
            </div>
            <div className="mt-4"><label htmlFor="rv-body" className="text-[12px] font-semibold">Reseña</label><textarea id="rv-body" rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className={cx(inputClass, 'mt-1.5 resize-y')} aria-invalid={!!errors.body} aria-describedby={errors.body ? 'rv-body-error' : undefined} maxLength={600} />{errors.body && <p id="rv-body-error" className="mt-1 text-[12px] text-[#b42318]">{errors.body}</p>}</div>
            <div className="mt-4 flex gap-2"><button type="submit" className={button('primary')}>Publicar reseña</button><button type="button" onClick={() => setOpen(false)} className={button('ghost')}>Cancelar</button></div>
          </form>
        )}
        <ul className="divide-y divide-[#e6e6eb]">
          {all.map((r) => (
            <li key={r.id} className="py-5 first:pt-0">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <Rating value={r.rating} size={13} />
                <strong className="text-[14px] font-semibold">{r.title}</strong>
                {r.mine && <Badge tone="light">Tu reseña</Badge>}
              </div>
              <p className="mb-2 text-[14px] leading-relaxed text-[#4a4d57]">{r.body}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#73757d]">
                <span>{r.author} · {r.city} · {formatDate(r.date)}</span>
                {r.verified && <span className="flex items-center gap-1 text-[#20592b]"><BadgeCheck size={13} /> Compra verificada</span>}
                {!r.mine && <button type="button" onClick={() => setHelpful((h) => ({ ...h, [r.id]: !h[r.id] }))} aria-pressed={!!helpful[r.id]} className={cx('ml-auto flex items-center gap-1.5 hover:text-secundario', helpful[r.id] && 'font-semibold text-secundario')}><ThumbsUp size={13} /> Útil ({r.helpful + (helpful[r.id] ? 1 : 0)})</button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="grid w-full gap-10 px-5 lg:px-10 2xl:px-14 py-10 lg:grid-cols-2">
      <Skeleton className="aspect-[4/3]" />
      <div className="space-y-4"><Skeleton className="h-3 w-24" /><Skeleton className="h-10 w-4/5" /><Skeleton className="h-4 w-40" /><Skeleton className="h-10 w-48" /><Skeleton className="h-28 w-full" /><Skeleton className="h-12 w-full" /></div>
    </div>
  )
}

function ProductView({ product }) {
  const navigate = useNavigate()
  const { addToCart, isInList, toggleInList, openListDialog, trackView, notify } = useStore()
  const [color, setColor] = useState(product.colors[0])
  const [option, setOption] = useState(product.options?.values[0]?.label ?? null)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('descripcion')
  const related = useAsync(() => getRelatedProducts(product), product.id)
  const { price, oldPrice } = priceFor(product, option)
  const favorite = isInList('favoritos', product.id)
  const soldOut = product.stock === 0
  const maxQty = Math.min(10, product.stock)

  useEffect(() => { trackView(product.id) }, [product.id, trackView])

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: product.name, url })
      else { await navigator.clipboard.writeText(url); notify('Enlace copiado al portapapeles.') }
    } catch { /* El usuario canceló el diálogo de compartir. */ }
  }

  const tabs = [
    { id: 'descripcion', label: 'Descripción' },
    { id: 'especificaciones', label: 'Especificaciones' },
    { id: 'resenas', label: `Reseñas (${product.reviews})` },
  ]

  return (
    <>
      <div className="w-full px-5 lg:px-10 2xl:px-14 pb-24 pt-8 lg:pb-8">
        <Breadcrumbs items={[{ label: 'Inicio', to: paths.home }, { label: product.categoryName, to: paths.category(product.category) }, { label: product.name }]} />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <Gallery product={product} color={color} />

          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Link to={paths.catalog({ marcas: product.brand })} className="text-[11px] font-bold uppercase tracking-[.18em] text-principal hover:underline">{product.brand}</Link>
              {product.badges.map((b) => <Badge key={b} tone={b === 'Nuevo' ? 'green' : b === 'Oferta' || b === 'Últimas unidades' ? 'orange' : 'indigo'}>{b}</Badge>)}
            </div>
            <h1 className="mb-3 text-[clamp(26px,3vw,38px)] font-semibold leading-[1.15] tracking-[-.045em]">{product.name}</h1>
            <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#73757d]">
              <button type="button" onClick={() => { setTab('resenas'); document.getElementById('detalle-tabs')?.scrollIntoView({ behavior: 'smooth' }) }} className="hover:underline"><Rating value={product.rating} count={product.reviews} showValue /></button>
              <span>SKU {product.sku}</span>
            </div>
            <p className="mb-6 text-[15px] leading-relaxed text-[#4a4d57]">{product.summary}</p>

            <div className="mb-6 border-y border-[#e6e6eb] py-5">
              <Price price={price} oldPrice={oldPrice} size="lg" />
              {oldPrice && <p className="mt-1 text-[13px] font-semibold text-[#20592b]">Ahorras {formatPrice(oldPrice - price)}</p>}
              <p className="mt-2 text-[13px] text-[#626570]">Haz tu pedido y te confirmamos <strong>disponibilidad, envío y forma de pago</strong> por WhatsApp.</p>
            </div>

            <fieldset className="mb-5">
              <legend className="mb-2.5 text-[12px] font-semibold">Color: <span className="font-normal text-[#626570]">{color.name}</span></legend>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button key={c.name} type="button" onClick={() => setColor(c)} aria-pressed={color.name === c.name} aria-label={c.name} title={c.name}
                    className={cx('grid size-10 place-items-center rounded-full border-2 transition', color.name === c.name ? 'border-secundario' : 'border-transparent hover:border-[#c9cbd6]')}>
                    <span className="size-7 rounded-full border border-[#c9cbd6]" style={{ background: c.hex }} />
                  </button>
                ))}
              </div>
            </fieldset>

            {product.options && (
              <fieldset className="mb-5">
                <legend className="mb-2.5 text-[12px] font-semibold">{product.options.name}</legend>
                <div className="flex flex-wrap gap-2">
                  {product.options.values.map((v) => (
                    <button key={v.label} type="button" onClick={() => setOption(v.label)} aria-pressed={option === v.label}
                      className={cx('min-w-24 border px-4 py-2.5 text-left text-[13px] transition', option === v.label ? 'border-secundario bg-[#f0f0f8] font-semibold text-secundario' : 'border-[#dddfe5] bg-white hover:border-secundario')}>
                      {v.label}
                      {v.priceDelta > 0 && <span className="block text-[11px] font-normal text-[#73757d]">+{formatPrice(v.priceDelta)}</span>}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <p className={cx('mb-4 flex items-center gap-2 text-[13px] font-semibold', soldOut ? 'text-[#b42318]' : product.stock <= 5 ? 'text-principal' : 'text-[#20592b]')}>
              {soldOut ? <><PackageX size={16} /> Agotado temporalmente</> : product.stock <= 5 ? <>¡Solo quedan {product.stock} unidades!</> : <><Check size={16} /> Disponible · {product.stock} unidades</>}
            </p>

            <div className="mb-4 flex flex-wrap gap-3">
              {!soldOut && <QuantityInput value={qty} onChange={setQty} max={maxQty} />}
              <button type="button" disabled={soldOut} onClick={() => addToCart(product, { qty, color: color.name, option })} className={button('secondary', 'h-11 flex-1')}><ShoppingCart size={16} /> Agregar al carrito</button>
            </div>
            <button type="button" disabled={soldOut} onClick={() => { addToCart(product, { qty, color: color.name, option, silent: true }); navigate(paths.checkout) }} className={button('primary', 'mb-4 h-12 w-full')}><MessageCircle size={16} /> Pedir ahora</button>

            <div className="mb-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-semibold">
              <button type="button" onClick={() => toggleInList('favoritos', product)} aria-pressed={favorite} className={cx('flex items-center gap-2 hover:text-principal', favorite && 'text-principal')}><Heart size={16} fill={favorite ? 'currentColor' : 'none'} /> {favorite ? 'En Favoritos' : 'Guardar en Favoritos'}</button>
              <button type="button" onClick={() => openListDialog(product)} className="flex items-center gap-2 hover:text-secundario"><ListPlus size={16} /> Añadir a una lista</button>
              <button type="button" onClick={share} className="flex items-center gap-2 hover:text-secundario"><Share2 size={16} /> Compartir</button>
              <a href={whatsappUrl(buildProductQuestion(product, { color: color.name, option }))} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#1f7a43] hover:underline"><MessageCircle size={16} /> Preguntar por WhatsApp</a>
            </div>

            <ul className="divide-y divide-[#e6e6eb] border border-[#e6e6eb] bg-white text-[13px]">
              <li className="flex gap-3 p-4"><Truck size={18} className="mt-0.5 shrink-0 text-principal" /><span><strong className="block font-semibold">Envío a domicilio</strong><span className="text-[#626570]">Coordinamos contigo la fecha y el costo del envío por WhatsApp.</span></span></li>
              <li className="flex gap-3 p-4"><Store size={18} className="mt-0.5 shrink-0 text-principal" /><span><strong className="block font-semibold">Recoge sin costo en el punto de venta</strong><span className="text-[#626570]">{storeAddress}</span></span></li>
              <li className="flex gap-3 p-4"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-principal" /><span><strong className="block font-semibold">{product.specs.Garantía ?? '1 año de garantía'}</strong><span className="text-[#626570]">Producto nuevo, sellado y con factura electrónica.</span></span></li>
            </ul>
          </div>
        </div>

        <section id="detalle-tabs" className="mt-16 scroll-mt-40">
          <div role="tablist" aria-label="Información del producto" className="mb-8 flex gap-6 overflow-x-auto border-b border-[#e2e2e8]">
            {tabs.map((t) => (
              <button key={t.id} id={`tab-${t.id}`} role="tab" type="button" aria-selected={tab === t.id} aria-controls={`panel-${t.id}`} onClick={() => setTab(t.id)}
                className={cx('-mb-px shrink-0 border-b-2 pb-3 text-[14px] font-semibold transition', tab === t.id ? 'border-principal text-secundario' : 'border-transparent text-[#73757d] hover:text-[#222630]')}>
                {t.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            {tab === 'descripcion' && (
              <div className="grid gap-10 lg:grid-cols-2">
                <p className="m-0 text-[15px] leading-[1.85] text-[#4a4d57]">{product.description}</p>
                <div>
                  <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[.15em]">Lo más destacado</h3>
                  <ul className="space-y-3">{product.highlights.map((h) => <li key={h} className="flex gap-3 text-[14px]"><span className="mt-1.5 size-1.5 shrink-0 bg-principal" />{h}</li>)}</ul>
                </div>
              </div>
            )}
            {tab === 'especificaciones' && (
              <table className="w-full max-w-3xl border-collapse text-[14px]">
                <caption className="sr-only">Especificaciones técnicas</caption>
                <tbody>
                  {[['Marca', product.brand], ['Referencia', product.sku], ...Object.entries(product.specs), ['Colores', product.colors.map((c) => c.name).join(', ')]].map(([k, v]) => (
                    <tr key={k} className="border-b border-[#e6e6eb] even:bg-white">
                      <th scope="row" className="w-2/5 py-3 pr-4 text-left font-semibold text-[#4a4d57]">{k}</th>
                      <td className="py-3">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tab === 'resenas' && <Reviews product={product} />}
          </div>
        </section>

        {related.data?.length > 0 && (
          <section className="mt-20" aria-labelledby="related-title">
            <SectionHeading eyebrow="También te puede interesar" title={<span id="related-title">Productos relacionados</span>} />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{related.data.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}
      </div>

      {!soldOut && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-[#e2e2e8] bg-white px-4 py-3 shadow-[0_-8px_20px_rgba(34,38,48,.08)] lg:hidden">
          <div className="min-w-0 flex-1"><p className="m-0 truncate text-[12px] text-[#626570]">{product.name}</p><p className="m-0 text-[17px] font-semibold">{formatPrice(price)}</p></div>
          <button type="button" onClick={() => addToCart(product, { qty, color: color.name, option })} className={button('secondary', 'px-4')}><ShoppingCart size={16} /> Agregar</button>
        </div>
      )}
    </>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { data: product, loading } = useAsync(() => getProductBySlug(slug), slug)

  if (loading && product?.slug !== slug) return <DetailSkeleton />
  if (!product) {
    return (
      <div className="w-full px-5 lg:px-10 2xl:px-14 py-16">
        <EmptyState icon={PackageX} title="Producto no encontrado" action={<Link to={paths.catalog()} className={button('primary')}>Ir al catálogo</Link>}>
          Es posible que el producto ya no esté disponible o que el enlace sea incorrecto.
        </EmptyState>
      </div>
    )
  }
  return <ProductView key={product.id} product={product} />
}
