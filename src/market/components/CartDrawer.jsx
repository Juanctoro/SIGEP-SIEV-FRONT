import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { MessageCircle, ShoppingCart, Trash2, X } from 'lucide-react'
import ProductArt from './ProductArt'
import { QuantityInput } from './ui'
import { button } from './styles'
import { useStore } from '../context/StoreContext'
import { computeTotals } from '../services/catalogService'
import { formatPrice, plural } from '../lib/format'
import { paths } from '../routes'

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartLines, updateQty, removeFromCart } = useStore()
  const navigate = useNavigate()
  const totals = computeTotals(cartLines)
  const close = () => setCartOpen(false)

  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setCartOpen(false) }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [cartOpen, setCartOpen])

  if (!cartOpen) return null

  return (
    <div className="mk-fade fixed inset-0 z-[65] flex justify-end bg-[#15182bb3]" onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}>
      <aside role="dialog" aria-modal="true" aria-labelledby="cart-title" className="mk-drawer flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eeeef2] px-5 py-4">
          <h2 id="cart-title" className="m-0 text-[18px] font-semibold tracking-[-.02em]">Tu carrito <span className="text-[13px] font-normal text-[#73757d]">({plural(totals.count, 'producto')})</span></h2>
          <button type="button" autoFocus onClick={close} aria-label="Cerrar carrito" className="grid size-9 place-items-center hover:bg-[#f3f3f6]"><X size={20} /></button>
        </div>

        {cartLines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="mb-4 grid size-14 place-items-center bg-[#f6f0ed] text-principal"><ShoppingCart size={26} /></span>
            <p className="mb-1 text-[16px] font-semibold">Tu carrito está vacío</p>
            <p className="mb-6 text-[13px] text-[#626570]">Explora el catálogo y encuentra tu próxima compra.</p>
            <Link to={paths.catalog()} onClick={close} className={button('primary')}>Ver productos</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-[#eeeef2] overflow-y-auto px-5">
              {cartLines.map((line) => (
                <li key={line.key} className="flex gap-3 py-4">
                  <Link to={paths.product(line.product.slug)} onClick={close} className="h-[72px] w-24 shrink-0 bg-[#f3f3f0]"><ProductArt type={line.product.art} color={line.colorHex ?? line.product.colors[0].hex} /></Link>
                  <div className="min-w-0 flex-1">
                    <Link to={paths.product(line.product.slug)} onClick={close} className="line-clamp-2 text-[13px] font-semibold leading-snug hover:text-secundario">{line.product.name}</Link>
                    <p className="mt-0.5 text-[11px] text-[#73757d]">{[line.color, line.option].filter(Boolean).join(' · ')}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QuantityInput size="sm" value={line.qty} max={Math.min(10, line.product.stock)} onChange={(q) => updateQty(line.key, q)} label={`Cantidad de ${line.product.name}`} />
                      <span className="text-[14px] font-semibold">{formatPrice(line.unitPrice * line.qty)}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFromCart(line.key)} aria-label={`Eliminar ${line.product.name}`} className="self-start p-1 text-[#8a8c94] hover:text-[#b42318]"><Trash2 size={16} /></button>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-[#eeeef2] bg-[#fafaf8] px-5 py-4">
              <p className="flex items-baseline justify-between"><span className="text-[13px] text-[#626570]">Subtotal</span><span className="text-[20px] font-semibold tracking-[-.03em]">{formatPrice(totals.subtotal)}</span></p>
              <p className="text-[11px] text-[#73757d]">Impuestos incluidos. El envío y la forma de pago se acuerdan por WhatsApp.</p>
              <div className="grid grid-cols-2 gap-2">
                <Link to={paths.cart} onClick={close} className={button('subtle')}>Ver carrito</Link>
                <button type="button" onClick={() => { close(); navigate(paths.checkout) }} className={button('primary')}><MessageCircle size={15} /> Hacer pedido</button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
