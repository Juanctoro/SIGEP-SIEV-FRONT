import { Link, useParams, useSearchParams } from 'react-router'
import { CheckCircle2, MessageCircle, Package, RotateCcw } from 'lucide-react'
import ProductArt from '../components/ProductArt'
import { Badge, Breadcrumbs, EmptyState } from '../components/ui'
import { button } from '../components/styles'
import { useStore } from '../context/StoreContext'
import { findProduct } from '../services/catalogService'
import { buildOrderMessage, deliveryLabels, paymentLabels, storePhone, whatsappUrl } from '../lib/whatsapp'
import { formatDate, formatPrice, plural } from '../lib/format'
import { paths } from '../routes'

const container = 'w-full px-5 py-8 lg:px-10 2xl:px-14'
const itemCount = (order) => order.items.reduce((n, i) => n + i.qty, 0)

function OrderDetail({ order }) {
  const [params] = useSearchParams()
  const { addToCart, notify } = useStore()
  const isNew = params.get('nuevo') === '1'
  const { customer } = order
  const link = whatsappUrl(order.message ?? buildOrderMessage(order))

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
          <h1 className="mb-2 text-[clamp(26px,3vw,36px)] font-semibold tracking-[-.04em]">¡Listo, {customer.name.split(' ')[0]}! Tu pedido está en WhatsApp</h1>
          <p className="mb-5 max-w-xl text-[14px] leading-relaxed text-[#20592b]">Abrimos WhatsApp con el pedido <strong>{order.id}</strong> listo para enviar al {storePhone}. Recuerda tocar <strong>Enviar</strong> en la conversación para que un asesor lo reciba.</p>
          <a href={link} target="_blank" rel="noopener noreferrer" className={button('primary', 'bg-[#1f8f4e] hover:bg-[#18733e]')}><MessageCircle size={16} /> Abrir WhatsApp de nuevo</a>
        </div>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <section className="border border-[#e6e6eb] bg-white">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eeeef2] px-5 py-5">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[.15em] text-[#73757d]">Pedido</p>
              <h2 className="m-0 text-[22px] font-semibold tracking-[-.03em]">{order.id}</h2>
              <p className="mt-1 text-[13px] text-[#626570]">Enviado el {formatDate(order.createdAt, { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
            </div>
            <Badge tone="green">Enviado por WhatsApp</Badge>
          </div>
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
          <p className="m-0 flex justify-between border-t border-[#e2e2e8] px-5 py-4 text-[16px] font-semibold"><span>Total estimado</span><span>{formatPrice(order.totals.subtotal)}</span></p>
        </section>

        <aside className="space-y-4">
          <section className="border border-[#e6e6eb] bg-white p-5 text-[13px] leading-relaxed">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[.15em]">Datos del pedido</h2>
            <p className="m-0">{customer.name}{customer.phone && <><br /><span className="text-[#626570]">{customer.phone}</span></>}</p>
            <p className="mb-0 mt-3"><strong className="font-semibold">{deliveryLabels[customer.delivery]}</strong>{customer.delivery === 'domicilio' && <><br />{customer.address}{customer.details && `, ${customer.details}`}, {customer.city}</>}</p>
            <p className="mb-0 mt-3">Pago preferido: {paymentLabels[customer.payment]}</p>
            {customer.notes && <p className="mb-0 mt-3 text-[#626570]">“{customer.notes}”</p>}
          </section>
          <div className="grid gap-2">
            <a href={link} target="_blank" rel="noopener noreferrer" className={button('subtle')}><MessageCircle size={15} /> Ver mensaje en WhatsApp</a>
            <button type="button" onClick={buyAgain} className={button('secondary')}><RotateCcw size={15} /> Volver a pedir</button>
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
    <div className={container}>
      <Breadcrumbs items={[{ label: 'Inicio', to: paths.home }, { label: 'Mis pedidos', to: orderId ? paths.orders : undefined }, orderId ? { label: orderId } : null].filter(Boolean)} />
      {orderId ? (
        order ? <OrderDetail order={order} /> : <EmptyState icon={Package} title="Pedido no encontrado" action={<Link to={paths.orders} className={button('primary')}>Ver mis pedidos</Link>}>No encontramos un pedido con ese número en este navegador.</EmptyState>
      ) : (
        <>
          <h1 className="mb-2 text-[clamp(28px,3.2vw,42px)] font-semibold tracking-[-.045em]">Mis pedidos</h1>
          <p className="mb-8 text-[14px] text-[#626570]">Los pedidos que enviaste por WhatsApp desde este navegador.</p>
          {orders.length === 0 ? (
            <EmptyState icon={Package} title="Aún no tienes pedidos" action={<Link to={paths.catalog()} className={button('primary')}>Empezar a comprar</Link>}>Cuando envíes un pedido por WhatsApp lo verás aquí.</EmptyState>
          ) : (
            <ul className="grid gap-4">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link to={paths.order(o.id)} className="grid gap-4 border border-[#e6e6eb] bg-white p-5 transition hover:border-secundario sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-3"><strong className="text-[16px]">{o.id}</strong><Badge tone="green">Enviado por WhatsApp</Badge></div>
                      <p className="m-0 text-[13px] text-[#626570]">{formatDate(o.createdAt)} · {plural(itemCount(o), 'producto')} · {formatPrice(o.totals.subtotal)}</p>
                    </div>
                    <div className="flex -space-x-3">
                      {o.items.slice(0, 4).map((i) => <span key={`${i.productId}-${i.color}-${i.option}`} className="h-12 w-16 border-2 border-white bg-[#f3f3f0]"><ProductArt type={i.art} color={i.colorHex} /></span>)}
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
