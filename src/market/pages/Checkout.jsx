import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { MessageCircle, ShoppingCart, Store, Truck } from 'lucide-react'
import ProductArt from '../components/ProductArt'
import { OrderSummary } from './Cart'
import { Breadcrumbs, EmptyState } from '../components/ui'
import { button, cx, inputClass } from '../components/styles'
import { useStore } from '../context/StoreContext'
import { computeTotals, createOrder } from '../services/catalogService'
import { cities } from '../data/catalog'
import { buildOrderMessage, paymentLabels, storeAddress, storePhone, whatsappUrl } from '../lib/whatsapp'
import { formatPrice } from '../lib/format'
import { paths } from '../routes'

const deliveryOptions = [
  { id: 'domicilio', icon: Truck, title: 'Envío a domicilio', text: 'El costo y la fecha se confirman por WhatsApp' },
  { id: 'tienda', icon: Store, title: 'Recoger en el punto de venta', text: storeAddress },
]

const initial = { name: '', phone: '', delivery: 'domicilio', city: 'Cali', address: '', details: '', payment: 'transferencia', notes: '' }

function validate(v) {
  const e = {}
  if (v.name.trim().length < 3) e.name = 'Escribe tu nombre completo.'
  if (v.phone.trim() && !/^3\d{9}$/.test(v.phone.replace(/[\s-]/g, ''))) e.phone = 'Escribe un celular colombiano de 10 dígitos (ej.: 300 123 4567).'
  if (v.delivery === 'domicilio') {
    if (!v.city) e.city = 'Selecciona una ciudad.'
    if (v.address.trim().length < 6) e.address = 'Escribe la dirección de entrega.'
  }
  return e
}

function Field({ id, label, error, optional, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[12px] font-semibold">{label} {optional && <span className="font-normal text-[#73757d]">(opcional)</span>}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-[12px] text-[#b42318]">{error}</p>}
    </div>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cartLines, addOrder } = useStore()
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const totals = computeTotals(cartLines)

  if (cartLines.length === 0) {
    return (
      <div className="w-full px-5 py-16 lg:px-10 2xl:px-14">
        <EmptyState icon={ShoppingCart} title="No hay productos en tu pedido" action={<Link to={paths.catalog()} className={button('primary')}>Ir al catálogo</Link>}>Agrega productos a tu carrito para armar el pedido.</EmptyState>
      </div>
    )
  }

  const set = (k) => (e) => { setValues({ ...values, [k]: e.target.value }); setErrors({ ...errors, [k]: undefined }) }
  const field = (k) => ({ id: `f-${k}`, value: values[k], onChange: set(k), 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `f-${k}-error` : undefined, className: inputClass })

  function submit(e) {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) { document.getElementById(`f-${first}`)?.focus(); return }

    const customer = { ...values, name: values.name.trim(), address: values.address.trim(), details: values.details.trim(), notes: values.notes.trim(), phone: values.phone.trim() }
    const order = createOrder({
      customer,
      totals,
      items: cartLines.map((l) => ({ productId: l.productId, name: l.product.name, brand: l.product.brand, sku: l.product.sku, slug: l.product.slug, art: l.product.art, colorHex: l.colorHex, color: l.color, option: l.option, qty: l.qty, unitPrice: l.unitPrice })),
    })
    const message = buildOrderMessage(order)
    // Se abre WhatsApp en el mismo clic para que el navegador no lo bloquee.
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
    addOrder({ ...order, message })
    navigate(`${paths.order(order.id)}?nuevo=1`, { replace: true })
  }

  return (
    <div className="w-full px-5 py-8 lg:px-10 2xl:px-14">
      <Breadcrumbs items={[{ label: 'Inicio', to: paths.home }, { label: 'Carrito', to: paths.cart }, { label: 'Hacer pedido' }]} />
      <div className="mb-8">
        <h1 className="mb-2 text-[clamp(28px,3.2vw,40px)] font-semibold tracking-[-.045em]">Hacer pedido</h1>
        <p className="m-0 max-w-2xl text-[14px] leading-relaxed text-[#626570]">Completa tus datos y te llevamos a WhatsApp con el pedido listo para enviar al {storePhone}. Un asesor te confirma disponibilidad, envío y forma de pago. No se cobra nada en la página.</p>
      </div>

      <form noValidate onSubmit={submit} className="grid items-start gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="border border-[#e6e6eb] bg-white p-6">
            <h2 className="mb-5 text-[18px] font-semibold tracking-[-.02em]">Tus datos</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="f-name" label="Nombre completo" error={errors.name}><input autoComplete="name" {...field('name')} /></Field>
              <Field id="f-phone" label="Celular" optional error={errors.phone}><input type="tel" inputMode="numeric" autoComplete="tel" placeholder="300 123 4567" {...field('phone')} /></Field>
            </div>
          </section>

          <section className="border border-[#e6e6eb] bg-white p-6">
            <h2 className="mb-5 text-[18px] font-semibold tracking-[-.02em]">Entrega</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {deliveryOptions.map(({ id, icon: Icon, title, text }) => (
                <label key={id} className={cx('flex cursor-pointer items-start gap-3 border bg-white p-4 transition', values.delivery === id ? 'border-secundario ring-1 ring-secundario' : 'border-[#dddfe5] hover:border-[#b9bccb]')}>
                  <input type="radio" name="delivery" value={id} checked={values.delivery === id} onChange={set('delivery')} className="mt-1 size-4 accent-[#2d3484]" />
                  <Icon size={20} className={cx('mt-0.5 shrink-0', values.delivery === id ? 'text-secundario' : 'text-[#73757d]')} />
                  <span><strong className="block text-[14px] font-semibold">{title}</strong><span className="text-[12px] text-[#73757d]">{text}</span></span>
                </label>
              ))}
            </div>
            {values.delivery === 'domicilio' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field id="f-city" label="Ciudad" error={errors.city}><select autoComplete="address-level2" {...field('city')}>{cities.map((c) => <option key={c}>{c}</option>)}</select></Field>
                <Field id="f-address" label="Dirección" error={errors.address}><input autoComplete="street-address" placeholder="Calle 5 # 38-25" {...field('address')} /></Field>
                <Field id="f-details" label="Apartamento, torre o barrio" optional className="sm:col-span-2"><input {...field('details')} /></Field>
              </div>
            )}
          </section>

          <section className="border border-[#e6e6eb] bg-white p-6">
            <h2 className="mb-1 text-[18px] font-semibold tracking-[-.02em]">¿Cómo prefieres pagar?</h2>
            <p className="mb-5 text-[13px] text-[#73757d]">Solo es tu preferencia: el pago se coordina con el asesor.</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Forma de pago preferida">
              {Object.entries(paymentLabels).map(([id, label]) => (
                <label key={id} className={cx('cursor-pointer border px-4 py-2.5 text-[13px] transition', values.payment === id ? 'border-secundario bg-[#f0f0f8] font-semibold text-secundario' : 'border-[#dddfe5] bg-white hover:border-secundario')}>
                  <input type="radio" name="payment" value={id} checked={values.payment === id} onChange={set('payment')} className="sr-only" />{label}
                </label>
              ))}
            </div>
            <Field id="f-notes" label="Notas para el asesor" optional className="mt-5"><textarea rows={3} maxLength={300} placeholder="Ej.: necesito factura a nombre de empresa, horario de entrega…" {...field('notes')} /></Field>
          </section>
        </div>

        <aside className="space-y-4 border border-[#e6e6eb] bg-white p-5 lg:sticky lg:top-36" aria-label="Resumen del pedido">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-.02em]">Tu pedido</h2>
          <ul className="max-h-72 space-y-3 overflow-y-auto pr-2 pt-2">
            {cartLines.map((l) => (
              <li key={l.key} className="flex items-center gap-3">
                <span className="relative h-12 w-16 shrink-0 bg-[#f3f3f0]"><ProductArt type={l.product.art} color={l.colorHex} /><span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-secundario text-[10px] font-bold text-white">{l.qty}</span></span>
                <span className="min-w-0 flex-1 text-[12px] leading-snug"><span className="line-clamp-2 font-medium">{l.product.name}</span><span className="text-[#73757d]">{[l.color, l.option].filter(Boolean).join(' · ')}</span></span>
                <span className="text-[13px] font-semibold">{formatPrice(l.unitPrice * l.qty)}</span>
              </li>
            ))}
          </ul>
          <OrderSummary totals={totals} />
          <button type="submit" className={button('primary', 'h-12 w-full bg-[#1f8f4e] hover:bg-[#18733e]')}><MessageCircle size={17} /> Enviar pedido por WhatsApp</button>
          <p className="m-0 text-center text-[11px] leading-relaxed text-[#73757d]">Se abrirá WhatsApp con tu pedido listo. Tú confirmas el envío allí.</p>
        </aside>
      </form>
    </div>
  )
}
