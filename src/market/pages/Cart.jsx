import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Heart, MessageCircle, ShoppingCart, Trash2 } from 'lucide-react'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'
import { Breadcrumbs, Dialog, EmptyState, QuantityInput, SectionHeading } from '../components/ui'
import { button } from '../components/styles'
import { useStore } from '../context/StoreContext'
import { computeTotals, getProductsByIds } from '../services/catalogService'
import { formatPrice, plural } from '../lib/format'
import { paths } from '../routes'

export function OrderSummary({ totals }) {
  return (
    <dl className="space-y-2.5 text-[13px]">
      <div className="flex justify-between"><dt className="text-[#626570]">Productos ({totals.count})</dt><dd className="m-0">{formatPrice(totals.subtotal)}</dd></div>
      <div className="flex justify-between"><dt className="text-[#626570]">Envío</dt><dd className="m-0 text-right text-[#626570]">Se acuerda por WhatsApp</dd></div>
      <div className="flex items-baseline justify-between border-t border-[#e2e2e8] pt-3"><dt className="text-[15px] font-semibold">Total estimado</dt><dd className="m-0 text-[24px] font-semibold tracking-[-.03em]">{formatPrice(totals.subtotal)}</dd></div>
      <p className="m-0 text-[11px] text-[#73757d]">IVA incluido. Precios sujetos a confirmación de disponibilidad.</p>
      {totals.savings > 0 && <p className="m-0 bg-[#edf7ee] px-3 py-2 text-center text-[12px] font-semibold text-[#20592b]">Estás ahorrando {formatPrice(totals.savings)} en esta compra</p>}
    </dl>
  )
}

export default function Cart() {
  const { cartLines, updateQty, removeFromCart, moveCartLineToList, clearCart, lists } = useStore()
  const navigate = useNavigate()
  const [confirmClear, setConfirmClear] = useState(false)
  const totals = computeTotals(cartLines)
  const saved = getProductsByIds(lists.find((l) => l.id === 'favoritos')?.items.map((i) => i.productId) ?? []).filter((p) => !cartLines.some((l) => l.productId === p.id)).slice(0, 4)

  return (
    <div className="w-full px-5 lg:px-10 2xl:px-14 py-8">
      <Breadcrumbs items={[{ label: 'Inicio', to: paths.home }, { label: 'Carrito' }]} />
      <h1 className="mb-8 text-[clamp(28px,3.2vw,42px)] font-semibold tracking-[-.045em]">Carrito de compras</h1>

      {cartLines.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="Tu carrito está vacío" action={<Link to={paths.catalog()} className={button('primary')}>Explorar productos</Link>}>
          Cuando agregues productos los verás aquí. ¡Revisa las ofertas del día!
        </EmptyState>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <section aria-label="Productos en el carrito" className="border border-[#e6e6eb] bg-white">
            <div className="hidden grid-cols-[1fr_130px_130px] gap-4 border-b border-[#e6e6eb] px-5 py-3 text-[11px] font-bold uppercase tracking-[.12em] text-[#73757d] md:grid">
              <span>Producto</span><span>Cantidad</span><span className="text-right">Total</span>
            </div>
            <ul className="divide-y divide-[#eeeef2]">
              {cartLines.map((line) => (
                <li key={line.key} className="grid grid-cols-[96px_1fr] gap-4 p-5 md:grid-cols-[110px_1fr_130px_130px] md:items-center">
                  <Link to={paths.product(line.product.slug)} className="aspect-[4/3] bg-[#f3f3f0]"><ProductArt type={line.product.art} color={line.colorHex ?? line.product.colors[0].hex} /></Link>
                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[.15em] text-principal">{line.product.brand}</p>
                    <Link to={paths.product(line.product.slug)} className="text-[14px] font-semibold leading-snug hover:text-secundario">{line.product.name}</Link>
                    <p className="mt-1 text-[12px] text-[#73757d]">{[line.color && `Color: ${line.color}`, line.option].filter(Boolean).join(' · ')}</p>
                    <p className="mt-1 text-[12px]">{formatPrice(line.unitPrice)} c/u {line.unitOldPrice && <span className="ml-1 text-[#8a8c94] line-through">{formatPrice(line.unitOldPrice)}</span>}</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-semibold">
                      <button type="button" onClick={() => moveCartLineToList(line.key)} className="flex items-center gap-1.5 text-secundario hover:underline"><Heart size={13} /> Mover a Favoritos</button>
                      <button type="button" onClick={() => removeFromCart(line.key)} className="flex items-center gap-1.5 text-[#626570] hover:text-[#b42318]"><Trash2 size={13} /> Eliminar</button>
                    </div>
                  </div>
                  <div className="col-start-2 flex items-center justify-between md:col-start-auto md:block">
                    <QuantityInput value={line.qty} max={Math.min(10, line.product.stock)} onChange={(q) => updateQty(line.key, q)} label={`Cantidad de ${line.product.name}`} />
                    <span className="text-[16px] font-semibold md:hidden">{formatPrice(line.unitPrice * line.qty)}</span>
                  </div>
                  <span className="hidden text-right text-[16px] font-semibold md:block">{formatPrice(line.unitPrice * line.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap justify-between gap-3 border-t border-[#e6e6eb] px-5 py-4 text-[13px] font-semibold">
              <Link to={paths.catalog()} className="text-secundario hover:underline">← Seguir comprando</Link>
              <button type="button" onClick={() => setConfirmClear(true)} className="text-[#626570] hover:text-[#b42318]">Vaciar carrito</button>
            </div>
          </section>

          <aside className="space-y-4 border border-[#e6e6eb] bg-white p-5 lg:sticky lg:top-36" aria-label="Resumen del pedido">
            <h2 className="m-0 text-[18px] font-semibold tracking-[-.02em]">Resumen del pedido</h2>
            <OrderSummary totals={totals} />
            <button type="button" onClick={() => navigate(paths.checkout)} className={button('primary', 'h-12 w-full')}><MessageCircle size={16} /> Hacer pedido por WhatsApp</button>
            <p className="text-center text-[11px] text-[#73757d]">No pagas en la página: un asesor confirma tu pedido por WhatsApp.</p>
          </aside>
        </div>
      )}

      <Dialog open={confirmClear} onClose={() => setConfirmClear(false)} title="¿Vaciar el carrito?" labelledBy="clear-title">
        <p className="mb-6 text-[14px] text-[#626570]">Se quitarán {plural(totals.count, 'producto')} del carrito. Esta acción no se puede deshacer.</p>
        <div className="flex justify-end gap-2">
          <button type="button" autoFocus onClick={() => setConfirmClear(false)} className={button('ghost')}>Cancelar</button>
          <button type="button" onClick={() => { clearCart(); setConfirmClear(false) }} className={button('primary')}>Vaciar carrito</button>
        </div>
      </Dialog>

      {saved.length > 0 && (
        <section className="mt-16" aria-labelledby="saved-title">
          <SectionHeading eyebrow="Guardados" title={<span id="saved-title">De tu lista de Favoritos</span>} action={<Link to={paths.list('favoritos')} className="text-[13px] font-semibold text-secundario hover:underline">Ver lista completa</Link>} />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{saved.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </div>
  )
}
