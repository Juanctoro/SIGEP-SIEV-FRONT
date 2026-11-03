import { Link, useParams, useSearchParams } from 'react-router'
import { CheckCircle2, Package, Printer, RotateCcw } from 'lucide-react'
import ProductArt from '../components/ProductArt'
import { Badge, Breadcrumbs, EmptyState } from '../components/ui'
import { button, cx } from '../components/styles'
import { useStore } from '../context/StoreContext'
import { findProduct } from '../services/catalogService'
import { formatDate, formatPrice, plural } from '../lib/format'
import { paths } from '../routes'

const timeline = ['Pedido confirmado', 'En preparación', 'Enviado', 'Entregado']
const paymentLabel = { tarjeta: 'Tarjeta', pse: 'PSE', contraentrega: 'Contraentrega' }

// Estado simulado según el tiempo transcurrido desde la compra (solo para la maqueta).
function progress(order) {
  const minutes = (Date.now() - new Date(order.createdAt)) / 60000
  if (order.payment.method === 'contraentrega' && minutes < 1) return 0
  return minutes < 1 ? 0 : minutes < 60 * 24 ? 1 : minutes < 60 * 72 ? 2 : 3
}

function OrderDetail({ order }) {
  const [params] = useSearchParams()
  const { addToCart, notify } = useStore()
  const isNew = params.get('nuevo') === '1'
  const step = progress(order)

  function buyAgain() {
    let added = 0
    order.items.forEach((item) => {
      const product = findProduct(item.productId)
      if (product?.stock) { addToCart(product, { qty: item.qty, color: item.color, option: item.option, silent: true }); added++ }
    })
    notify(added ? 'Agregamos los productos a tu carrito.' : 'Los productos ya no están disponibles.', { tone: added ? 'success' : 'warning' })
  }

  return (
    <>
      {isNew && (
        <div className="mk-pop mb-8 flex flex-col items-center border border-[#cfe7d3] bg-[#edf7ee] px-6 py-10 text-center">
          <CheckCircle2 size={44} className="mb-4 text-[#2f7a3d]" />
          <h1 className="mb-2 text-[clamp(26px,3vw,36px)] font-semibold tracking-[-.04em]">¡Gracias por tu compra, {order.shipping.name.split(' ')[0]}!</h1>
          <p className="m-0 max-w-lg text-[14px] leading-relaxed text-[#20592b]">Recibimos tu pedido <strong>{order.id}</strong>. Te enviamos la confirmación a {order.shipping.email}.</p>
        </div>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="border border-[#e6e6eb] bg-white p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[.15em] text-[#73757d]">Pedido</p>
                <h2 className="m-0 text-[22px] font-semibold tracking-[-.03em]">{order.id}</h2>
                <p className="mt-1 text-[13px] text-[#626570]">Realizado el {formatDate(order.createdAt, { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
              </div>
              <Badge tone={step === 3 ? 'green' : 'indigo'}>{timeline[step]}</Badge>
            </div>
            <ol className="grid grid-cols-4" aria-label="Estado del pedido">
              {timeline.map((label, i) => (
                <li key={label} className="relative flex flex-col items-center text-center" aria-current={i === step ? 'step' : undefined}>
                  {i > 0 && <span className={cx('absolute right-1/2 top-3 h-0.5 w-full', i <= step ? 'bg-secundario' : 'bg-[#e2e2e8]')} aria-hidden="true" />}
                  <span className={cx('relative z-10 grid size-6 place-items-center rounded-full border-2 text-[10px] font-bold', i < step ? 'border-secundario bg-secundario text-white' : i === step ? 'border-principal bg-principal text-white' : 'border-[#d9d9de] bg-white text-[#9a9ca5]')}>{i < step ? '✓' : i + 1}</span>
                  <span className={cx('mt-2 text-[11px] leading-tight sm:text-[12px]', i <= step ? 'font-semibold' : 'text-[#9a9ca5]')}>{label}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 bg-[#f6f6f4] p-3 text-[13px]">{order.shipping.method === 'tienda' ? 'Disponible para recoger en Tienda SIEV Cali: ' : 'Entrega estimada: '}<strong>{order.shipping.estimate}</strong></p>
          </section>

          <section className="border border-[#e6e6eb] bg-white">
            <h2 className="m-0 border-b border-[#eeeef2] px-5 py-4 text-[11px] font-bold uppercase tracking-[.15em]">{plural(order.items.reduce((n, i) => n + i.qty, 0), 'producto')}</h2>
            <ul className="divide-y divide-[#eeeef2]">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.color}-${item.option}`} className="flex items-center gap-4 px-5 py-4">
                  <Link to={paths.product(item.slug)} className="h-16 w-20 shrink-0 bg-[#f3f3f0]"><ProductArt type={item.art} color={item.colorHex} /></Link>
                  <span className="min-w-0 flex-1 text-[13px]">
                    <Link to={paths.product(item.slug)} className="block font-semibold hover:text-secundario">{item.name}</Link>
                    <span className="text-[#73757d]">{[item.color, item.option, `Cant. ${item.qty}`].filter(Boolean).join(' · ')}</span>
                  </span>
                  <span className="text-[14px] font-semibold">{formatPrice(item.unitPrice * item.qty)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="border border-[#e6e6eb] bg-white p-5 text-[13px]">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[.15em]">Resumen</h2>
            <dl className="space-y-2">
              <div className="flex justify-between"><dt className="text-[#626570]">Subtotal</dt><dd className="m-0">{formatPrice(order.totals.subtotal)}</dd></div>
              {order.totals.discount > 0 && <div className="flex justify-between text-[#20592b]"><dt>Cupón {order.coupon}</dt><dd className="m-0">-{formatPrice(order.totals.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-[#626570]">Envío</dt><dd className="m-0">{order.totals.shipping ? formatPrice(order.totals.shipping) : 'Gratis'}</dd></div>
              <div className="flex justify-between border-t border-[#e2e2e8] pt-2 text-[16px] font-semibold"><dt>Total</dt><dd className="m-0">{formatPrice(order.totals.total)}</dd></div>
            </dl>
          </section>
          <section className="border border-[#e6e6eb] bg-white p-5 text-[13px] leading-relaxed">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[.15em]">Entrega y pago</h2>
            <p className="m-0">{order.shipping.name}<br />{order.shipping.method === 'tienda' ? 'Recoge en Tienda SIEV Cali' : `${order.shipping.address}, ${order.shipping.city}`}<br /><span className="text-[#626570]">{order.shipping.phone}</span></p>
            <p className="mb-0 mt-3">{paymentLabel[order.payment.method]}{order.payment.last4 && ` •••• ${order.payment.last4}`}{order.payment.bank && ` · ${order.payment.bank}`}{order.payment.dues > 1 && ` · ${order.payment.dues} cuotas`}</p>
          </section>
          <div className="grid gap-2">
            <button type="button" onClick={buyAgain} className={button('secondary')}><RotateCcw size={15} /> Volver a comprar</button>
            <button type="button" onClick={() => window.print()} className={button('subtle')}><Printer size={15} /> Imprimir comprobante</button>
            <Link to={paths.catalog()} className={button('ghost')}>Seguir comprando</Link>
          </div>
        </aside>
      </div>
    </>
  )
}

export default function Orders() {
  const { orderId } = useParams()
  const { orders } = useStore()
  const order = orderId ? orders.find((o) => o.id === orderId) : null

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8">
      <Breadcrumbs items={[{ label: 'Inicio', to: paths.home }, { label: 'Mis pedidos', to: orderId ? paths.orders : undefined }, orderId ? { label: orderId } : null].filter(Boolean)} />
      {orderId ? (
        order ? <OrderDetail order={order} /> : <EmptyState icon={Package} title="Pedido no encontrado" action={<Link to={paths.orders} className={button('primary')}>Ver mis pedidos</Link>}>No encontramos un pedido con ese número en este navegador.</EmptyState>
      ) : (
        <>
          <h1 className="mb-8 text-[clamp(28px,3.2vw,42px)] font-semibold tracking-[-.045em]">Mis pedidos</h1>
          {orders.length === 0 ? (
            <EmptyState icon={Package} title="Aún no tienes pedidos" action={<Link to={paths.catalog()} className={button('primary')}>Empezar a comprar</Link>}>Cuando completes una compra podrás seguir su estado desde aquí.</EmptyState>
          ) : (
            <ul className="grid gap-4">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link to={paths.order(o.id)} className="grid gap-4 border border-[#e6e6eb] bg-white p-5 transition hover:border-secundario sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-3"><strong className="text-[16px]">{o.id}</strong><Badge tone="indigo">{timeline[progress(o)]}</Badge></div>
                      <p className="m-0 text-[13px] text-[#626570]">{formatDate(o.createdAt)} · {plural(o.items.reduce((n, i) => n + i.qty, 0), 'producto')} · {formatPrice(o.totals.total)}</p>
                    </div>
                    <div className="flex -space-x-3">
                      {o.items.slice(0, 4).map((i) => <span key={`${i.productId}-${i.color}`} className="h-12 w-16 border-2 border-white bg-[#f3f3f0]"><ProductArt type={i.art} color={i.colorHex} /></span>)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
