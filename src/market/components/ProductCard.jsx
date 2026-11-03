import { Link } from 'react-router'
import { Heart, ListPlus, ShoppingCart, Truck } from 'lucide-react'
import ProductArt from './ProductArt'
import { Badge, Price, Rating } from './ui'
import { button, cx } from './styles'
import { useStore } from '../context/StoreContext'
import { formatPrice, installments } from '../lib/format'
import { shippingRules } from '../data/catalog'
import { paths } from '../routes'

const badgeTone = (badge) => (badge === 'Oferta' || badge === 'Últimas unidades' ? 'orange' : badge === 'Nuevo' ? 'green' : 'indigo')

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart, isInList, toggleInList, openListDialog } = useStore()
  const favorite = isInList('favoritos', product.id)
  const soldOut = product.stock === 0
  const list = layout === 'list'

  return (
    <article className={cx('group relative flex border border-[#e6e6eb] bg-white transition hover:border-[#c9cbd6] hover:shadow-[0_14px_32px_-18px_rgba(34,38,48,.35)]', list ? 'flex-col sm:flex-row' : 'flex-col')}>
      <div className={cx('relative overflow-hidden bg-[#f3f3f0]', list ? 'aspect-[4/3] sm:w-64 sm:shrink-0' : 'aspect-[4/3]')}>
        <Link to={paths.product(product.slug)} tabIndex={-1} aria-hidden="true" className="block h-full">
          <ProductArt type={product.art} color={product.colors[0].hex} className="transition duration-500 group-hover:scale-[1.04]" />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut && <Badge tone="gray">Agotado</Badge>}
          {product.badges.slice(0, 1).map((b) => <Badge key={b} tone={badgeTone(b)}>{b}</Badge>)}
        </div>
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
          <button type="button" onClick={() => toggleInList('favoritos', product)} aria-pressed={favorite} aria-label={favorite ? `Quitar ${product.name} de Favoritos` : `Guardar ${product.name} en Favoritos`}
            className={cx('grid size-9 place-items-center border bg-white transition', favorite ? 'border-principal text-principal' : 'border-[#e2e2e8] text-[#4a4d57] hover:text-principal')}>
            <Heart size={17} fill={favorite ? 'currentColor' : 'none'} />
          </button>
          <button type="button" onClick={() => openListDialog(product)} aria-label={`Añadir ${product.name} a una lista`}
            className="grid size-9 place-items-center border border-[#e2e2e8] bg-white text-[#4a4d57] opacity-100 transition hover:text-secundario md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100">
            <ListPlus size={17} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-principal">{product.brand}</p>
        <h3 className="mb-2 text-[14px] font-semibold leading-snug tracking-[-.01em]">
          <Link to={paths.product(product.slug)} className="line-clamp-2 hover:text-secundario after:absolute after:inset-0 after:content-[''] after:z-0">{product.name}</Link>
        </h3>
        {list && <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-[#626570]">{product.summary}</p>}
        <div className="mb-3"><Rating value={product.rating} count={product.reviews} size={12} /></div>
        <div className="mt-auto">
          <Price price={product.price} oldPrice={product.oldPrice} />
          <p className="mt-1 text-[11px] text-[#626570]">12 cuotas de {formatPrice(installments(product.price))}</p>
          {product.price >= shippingRules.freeFrom && !soldOut && <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#20592b]"><Truck size={13} /> Envío gratis</p>}
          {product.colors.length > 1 && (
            <div className="mt-2 flex items-center gap-1" aria-label={`${product.colors.length} colores disponibles`}>
              {product.colors.map((c) => <span key={c.name} title={c.name} className="size-3 rounded-full border border-[#c9cbd6]" style={{ background: c.hex }} />)}
            </div>
          )}
          <button type="button" disabled={soldOut} onClick={() => addToCart(product)} className={button('secondary', 'relative z-10 mt-4 w-full py-2.5')}>
            <ShoppingCart size={15} /> {soldOut ? 'Agotado' : <><span className="sm:hidden">Agregar</span><span className="hidden sm:inline">Agregar al carrito</span></>}
          </button>
        </div>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-[#e6e6eb] bg-white">
      <div className="aspect-[4/3] animate-pulse bg-[#efeff2]" />
      <div className="space-y-3 p-4">
        <div className="h-2.5 w-16 animate-pulse bg-[#ececf0]" />
        <div className="h-4 w-4/5 animate-pulse bg-[#ececf0]" />
        <div className="h-3 w-24 animate-pulse bg-[#ececf0]" />
        <div className="h-5 w-28 animate-pulse bg-[#ececf0]" />
        <div className="h-10 w-full animate-pulse bg-[#ececf0]" />
      </div>
    </div>
  )
}
