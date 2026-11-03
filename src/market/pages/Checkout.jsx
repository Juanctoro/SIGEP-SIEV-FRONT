import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Banknote, Check, CreditCard, Landmark, Lock, ShoppingCart, Store, Truck, Zap } from 'lucide-react'
import ProductArt from '../components/ProductArt'
import { CouponForm, OrderSummary } from './Cart'
import { EmptyState } from '../components/ui'
import { button, cx, inputClass } from '../components/styles'
import { useStore } from '../context/StoreContext'
import { computeTotals, createOrder } from '../services/catalogService'
import { cities, shippingRules } from '../data/catalog'
import { deliveryEstimate, formatPrice, installments } from '../lib/format'
import { paths } from '../routes'

const steps = ['Envío', 'Pago', 'Confirmación']

const shippingMethods = [
  { id: 'estandar', icon: Truck, title: 'Envío estándar', text: 'De 2 a 4 días hábiles' },
  { id: 'express', icon: Zap, title: 'Envío express', text: 'Al siguiente día hábil' },
  { id: 'tienda', icon: Store, title: 'Recoger en tienda', text: 'Cali, Valle del Cauca' },
]

const paymentMethods = [
  { id: 'tarjeta', icon: CreditCard, title: 'Tarjeta de crédito o débito', text: 'Visa, Mastercard, American Express' },
  { id: 'pse', icon: Landmark, title: 'PSE', text: 'Débito desde tu cuenta bancaria' },
  { id: 'contraentrega', icon: Banknote, title: 'Pago contraentrega', text: 'Paga en efectivo al recibir' },
]

const banks = ['Bancolombia', 'Banco de Bogotá', 'Davivienda', 'BBVA', 'Banco de Occidente', 'Banco Popular', 'Nequi', 'Daviplata']

const initialShipping = { name: '', email: '', phone: '', document: '', city: 'Cali', address: '', details: '', notes: '' }
const initialPayment = { card: '', holder: '', expiry: '', cvv: '', dues: '1', bank: '', personType: 'natural' }

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

function validateShipping(v, method) {
  const e = {}
  if (v.name.trim().length < 3) e.name = 'Escribe tu nombre completo.'
  if (!emailOk(v.email)) e.email = 'Escribe un correo electrónico válido.'
  if (!/^3\d{9}$/.test(v.phone.replace(/\s/g, ''))) e.phone = 'Escribe un celular colombiano de 10 dígitos (ej.: 300 123 4567).'
  if (!/^\d{6,10}$/.test(v.document.trim())) e.document = 'Escribe tu número de documento (6 a 10 dígitos).'
  if (method !== 'tienda') {
    if (!v.city) e.city = 'Selecciona una ciudad.'
    if (v.address.trim().length < 6) e.address = 'Escribe la dirección de entrega.'
  }
  return e
}

function validatePayment(v, method) {
  const e = {}
  if (method === 'tarjeta') {
    const digits = v.card.replace(/\s/g, '')
    if (!/^\d{15,16}$/.test(digits)) e.card = 'El número de tarjeta debe tener 15 o 16 dígitos.'
    if (v.holder.trim().length < 3) e.holder = 'Escribe el nombre como aparece en la tarjeta.'
    const match = v.expiry.match(/^(\d{2})\/(\d{2})$/)
    const now = new Date()
    if (!match || +match[1] < 1 || +match[1] > 12 || new Date(2000 + +match[2], +match[1]) <= now) e.expiry = 'Fecha inválida o vencida (MM/AA).'
    if (!/^\d{3,4}$/.test(v.cvv)) e.cvv = 'CVV de 3 o 4 dígitos.'
  }
  if (method === 'pse' && !v.bank) e.bank = 'Selecciona tu banco.'
  return e
}

function Field({ label, error, optional, className = '', children, id }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[12px] font-semibold">{label} {optional && <span className="font-normal text-[#73757d]">(opcional)</span>}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-[12px] text-[#b42318]">{error}</p>}
    </div>
  )
}

function OptionCard({ selected, onSelect, icon: Icon, title, text, aside, name, value }) {
  return (
    <label className={cx('flex cursor-pointer items-center gap-4 border bg-white p-4 transition', selected ? 'border-secundario ring-1 ring-secundario' : 'border-[#dddfe5] hover:border-[#b9bccb]')}>
      <input type="radio" name={name} value={value} checked={selected} onChange={onSelect} className="size-4 accent-[#2d3484]" />
      <Icon size={20} className={selected ? 'text-secundario' : 'text-[#73757d]'} />
      <span className="flex-1"><strong className="block text-[14px] font-semibold">{title}</strong><span className="text-[12px] text-[#73757d]">{text}</span></span>
      {aside && <span className="text-right text-[13px] font-semibold">{aside}</span>}
    </label>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cartLines, coupon, addOrder } = useStore()
  const [step, setStep] = useState(0)
  const [shipping, setShipping] = useState(initialShipping)
  const [shippingMethod, setShippingMethod] = useState('estandar')
  const [payment, setPayment] = useState(initialPayment)
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')
  const [errors, setErrors] = useState({})
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const totals = computeTotals(cartLines, { coupon, shippingMethod })

  if (cartLines.length === 0 && !submitting) {
    return (
      <div className="w-full px-5 lg:px-10 2xl:px-14 py-16">
        <EmptyState icon={ShoppingCart} title="No hay productos para pagar" action={<Link to={paths.catalog()} className={button('primary')}>Ir al catálogo</Link>}>Agrega productos a tu carrito para continuar con la compra.</EmptyState>
      </div>
    )
  }

  const setS = (k) => (e) => { setShipping({ ...shipping, [k]: e.target.value }); setErrors({ ...errors, [k]: undefined }) }
  const setP = (k, transform = (x) => x) => (e) => { setPayment({ ...payment, [k]: transform(e.target.value) }); setErrors({ ...errors, [k]: undefined }) }
  const fieldProps = (k, values, setter) => ({ id: `f-${k}`, value: values[k], onChange: setter(k), 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `f-${k}-error` : undefined, className: inputClass })

  function focusFirst(errs) {
    const first = Object.keys(errs)[0]
    if (first) document.getElementById(`f-${first}`)?.focus()
  }

  function next() {
    const errs = step === 0 ? validateShipping(shipping, shippingMethod) : validatePayment(payment, paymentMethod)
    setErrors(errs)
    if (Object.keys(errs).length) return focusFirst(errs)
    setStep(step + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function placeOrder() {
    if (!accepted) { setErrors({ accepted: 'Debes aceptar los términos para continuar.' }); return }
    setSubmitting(true)
    const order = await createOrder({
      items: cartLines.map((l) => ({ productId: l.productId, name: l.product.name, brand: l.product.brand, slug: l.product.slug, art: l.product.art, colorHex: l.colorHex, color: l.color, option: l.option, qty: l.qty, unitPrice: l.unitPrice })),
      totals,
      coupon: coupon?.code ?? null,
      shipping: { ...shipping, method: shippingMethod, estimate: deliveryEstimate(shippingMethod) },
      payment: { method: paymentMethod, last4: paymentMethod === 'tarjeta' ? payment.card.replace(/\s/g, '').slice(-4) : null, bank: payment.bank || null, dues: paymentMethod === 'tarjeta' ? Number(payment.dues) : null },
    })
    addOrder(order)
    navigate(`${paths.order(order.id)}?nuevo=1`, { replace: true })
  }

  const shippingCost = (id) => (id === 'tienda' ? 'Gratis' : id === 'express' ? formatPrice(shippingRules.express) : totals.subtotal >= shippingRules.freeFrom || coupon?.type === 'shipping' ? 'Gratis' : formatPrice(shippingRules.standard))

  return (
    <div className="w-full px-5 lg:px-10 2xl:px-14 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-[clamp(28px,3.2vw,40px)] font-semibold tracking-[-.045em]">Finalizar compra</h1>
        <p className="m-0 flex items-center gap-2 text-[12px] text-[#626570]"><Lock size={14} className="text-[#2f7a3d]" /> Pago protegido · Modo demostración</p>
      </div>

      <ol className="mb-10 grid grid-cols-3 border-b border-[#e2e2e8]" aria-label="Pasos de la compra">
        {steps.map((label, i) => (
          <li key={label} aria-current={step === i ? 'step' : undefined} className={cx('-mb-px flex items-center gap-2.5 border-b-2 pb-3 text-[13px] font-semibold', step === i ? 'border-principal text-secundario' : i < step ? 'border-secundario text-secundario' : 'border-transparent text-[#9a9ca5]')}>
            <span className={cx('grid size-6 place-items-center rounded-full text-[11px]', i < step ? 'bg-secundario text-white' : step === i ? 'bg-principal text-white' : 'bg-[#ececf0]')}>{i < step ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
            {i < step ? <button type="button" onClick={() => setStep(i)} className="hover:underline">{label}</button> : <span>{label}</span>}
          </li>
        ))}
      </ol>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_400px]">
        <div>
          {step === 0 && (
            <form noValidate onSubmit={(e) => { e.preventDefault(); next() }} className="space-y-8">
              <section className="border border-[#e6e6eb] bg-white p-6">
                <h2 className="mb-5 text-[18px] font-semibold tracking-[-.02em]">Datos de contacto</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="f-name" label="Nombre completo" error={errors.name} className="sm:col-span-2"><input autoComplete="name" {...fieldProps('name', shipping, setS)} /></Field>
                  <Field id="f-email" label="Correo electrónico" error={errors.email}><input type="email" autoComplete="email" {...fieldProps('email', shipping, setS)} /></Field>
                  <Field id="f-phone" label="Celular" error={errors.phone}><input type="tel" autoComplete="tel" inputMode="numeric" placeholder="300 123 4567" {...fieldProps('phone', shipping, setS)} /></Field>
                  <Field id="f-document" label="Cédula o NIT" error={errors.document}><input inputMode="numeric" {...fieldProps('document', shipping, setS)} /></Field>
                </div>
              </section>

              <section className="border border-[#e6e6eb] bg-white p-6">
                <h2 className="mb-5 text-[18px] font-semibold tracking-[-.02em]">Método de entrega</h2>
                <div className="grid gap-3">
                  {shippingMethods.map((m) => <OptionCard key={m.id} name="shipping-method" value={m.id} selected={shippingMethod === m.id} onSelect={() => setShippingMethod(m.id)} icon={m.icon} title={m.title} text={`${m.text} · ${deliveryEstimate(m.id)}`} aside={shippingCost(m.id)} />)}
                </div>
                {shippingMethod !== 'tienda' ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field id="f-city" label="Ciudad" error={errors.city}>
                      <select autoComplete="address-level2" {...fieldProps('city', shipping, setS)}>{cities.map((c) => <option key={c}>{c}</option>)}</select>
                    </Field>
                    <Field id="f-address" label="Dirección" error={errors.address}><input autoComplete="street-address" placeholder="Calle 5 # 38-25" {...fieldProps('address', shipping, setS)} /></Field>
                    <Field id="f-details" label="Apartamento, torre, barrio" optional><input {...fieldProps('details', shipping, setS)} /></Field>
                    <Field id="f-notes" label="Indicaciones para la entrega" optional><input {...fieldProps('notes', shipping, setS)} /></Field>
                  </div>
                ) : (
                  <p className="mt-5 bg-[#f6f6f4] p-4 text-[13px] leading-relaxed text-[#4a4d57]">Recoge en <strong>Tienda SIEV Cali</strong> · Lunes a sábado, 8:00 a. m. a 6:00 p. m. Presenta tu documento y el número del pedido.</p>
                )}
              </section>
              <div className="flex flex-wrap justify-between gap-3">
                <Link to={paths.cart} className={button('ghost')}>← Volver al carrito</Link>
                <button type="submit" className={button('primary', 'px-8')}>Continuar al pago</button>
              </div>
            </form>
          )}

          {step === 1 && (
            <form noValidate onSubmit={(e) => { e.preventDefault(); next() }} className="space-y-8">
              <section className="border border-[#e6e6eb] bg-white p-6">
                <h2 className="mb-5 text-[18px] font-semibold tracking-[-.02em]">Método de pago</h2>
                <div className="grid gap-3">
                  {paymentMethods.map((m) => <OptionCard key={m.id} name="payment-method" value={m.id} selected={paymentMethod === m.id} onSelect={() => { setPaymentMethod(m.id); setErrors({}) }} icon={m.icon} title={m.title} text={m.text} />)}
                </div>

                {paymentMethod === 'tarjeta' && (
                  <div className="mt-6 grid gap-4 sm:grid-cols-4">
                    <Field id="f-card" label="Número de tarjeta" error={errors.card} className="sm:col-span-4"><input inputMode="numeric" autoComplete="cc-number" placeholder="4111 1111 1111 1111" maxLength={19} {...fieldProps('card', payment, (k) => setP(k, (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')))} /></Field>
                    <Field id="f-holder" label="Nombre en la tarjeta" error={errors.holder} className="sm:col-span-2"><input autoComplete="cc-name" {...fieldProps('holder', payment, (k) => setP(k, (v) => v.toUpperCase()))} /></Field>
                    <Field id="f-expiry" label="Vencimiento" error={errors.expiry}><input inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" maxLength={5} {...fieldProps('expiry', payment, (k) => setP(k, (v) => v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2')))} /></Field>
                    <Field id="f-cvv" label="CVV" error={errors.cvv}><input inputMode="numeric" autoComplete="cc-csc" maxLength={4} {...fieldProps('cvv', payment, (k) => setP(k, (v) => v.replace(/\D/g, '')))} /></Field>
                    <Field id="f-dues" label="Número de cuotas" className="sm:col-span-4">
                      <select {...fieldProps('dues', payment, setP)}>
                        {[1, 3, 6, 12, 24, 36].map((n) => <option key={n} value={n}>{n === 1 ? `1 cuota de ${formatPrice(totals.total)}` : `${n} cuotas de ${formatPrice(installments(totals.total, n))}${n <= 12 ? ' sin interés' : ''}`}</option>)}
                      </select>
                    </Field>
                  </div>
                )}
                {paymentMethod === 'pse' && (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field id="f-bank" label="Banco" error={errors.bank}>
                      <select {...fieldProps('bank', payment, setP)}><option value="">Selecciona tu banco</option>{banks.map((b) => <option key={b}>{b}</option>)}</select>
                    </Field>
                    <Field id="f-personType" label="Tipo de persona">
                      <select {...fieldProps('personType', payment, setP)}><option value="natural">Persona natural</option><option value="juridica">Persona jurídica</option></select>
                    </Field>
                    <p className="text-[12px] text-[#73757d] sm:col-span-2">Al confirmar te redirigiremos a PSE para autorizar el pago (simulado en esta demostración).</p>
                  </div>
                )}
                {paymentMethod === 'contraentrega' && <p className="mt-5 bg-[#f6f6f4] p-4 text-[13px] leading-relaxed text-[#4a4d57]">Paga en efectivo o con datáfono cuando recibas tu pedido. Disponible para compras hasta {formatPrice(5000000)}.</p>}
              </section>
              <p className="text-[12px] text-[#73757d]">Esta es una demostración: no se procesan pagos reales ni se almacenan datos de tarjetas.</p>
              <div className="flex flex-wrap justify-between gap-3">
                <button type="button" onClick={() => setStep(0)} className={button('ghost')}>← Volver</button>
                <button type="submit" disabled={paymentMethod === 'contraentrega' && totals.total > 5000000} className={button('primary', 'px-8')}>Revisar pedido</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <section className="grid gap-px border border-[#e6e6eb] bg-[#e6e6eb] sm:grid-cols-2">
                <div className="bg-white p-5">
                  <div className="mb-3 flex justify-between"><h2 className="m-0 text-[11px] font-bold uppercase tracking-[.15em]">Entrega</h2><button type="button" onClick={() => setStep(0)} className="text-[12px] font-semibold text-secundario hover:underline">Editar</button></div>
                  <p className="m-0 text-[14px] leading-relaxed">{shipping.name}<br />{shippingMethod === 'tienda' ? 'Recoger en Tienda SIEV Cali' : <>{shipping.address}{shipping.details && `, ${shipping.details}`}<br />{shipping.city}</>}<br /><span className="text-[#626570]">{shipping.phone} · {shipping.email}</span></p>
                  <p className="mt-3 text-[12px] font-semibold text-[#20592b]">{shippingMethods.find((m) => m.id === shippingMethod).title} · {deliveryEstimate(shippingMethod)}</p>
                </div>
                <div className="bg-white p-5">
                  <div className="mb-3 flex justify-between"><h2 className="m-0 text-[11px] font-bold uppercase tracking-[.15em]">Pago</h2><button type="button" onClick={() => setStep(1)} className="text-[12px] font-semibold text-secundario hover:underline">Editar</button></div>
                  <p className="m-0 text-[14px] leading-relaxed">
                    {paymentMethod === 'tarjeta' && <>Tarjeta terminada en {payment.card.replace(/\s/g, '').slice(-4)}<br /><span className="text-[#626570]">{payment.dues === '1' ? '1 cuota' : `${payment.dues} cuotas`}</span></>}
                    {paymentMethod === 'pse' && <>PSE · {payment.bank}</>}
                    {paymentMethod === 'contraentrega' && 'Pago contraentrega'}
                  </p>
                </div>
              </section>
              <section className="border border-[#e6e6eb] bg-white">
                <h2 className="m-0 border-b border-[#eeeef2] px-5 py-4 text-[11px] font-bold uppercase tracking-[.15em]">Productos</h2>
                <ul className="divide-y divide-[#eeeef2]">
                  {cartLines.map((l) => (
                    <li key={l.key} className="flex items-center gap-4 px-5 py-3">
                      <span className="h-12 w-16 shrink-0 bg-[#f3f3f0]"><ProductArt type={l.product.art} color={l.colorHex} /></span>
                      <span className="min-w-0 flex-1 text-[13px]"><strong className="block truncate font-semibold">{l.product.name}</strong><span className="text-[#73757d]">{[l.color, l.option, `Cant. ${l.qty}`].filter(Boolean).join(' · ')}</span></span>
                      <span className="text-[14px] font-semibold">{formatPrice(l.unitPrice * l.qty)}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <div>
                <label className="flex items-start gap-3 text-[13px] leading-relaxed">
                  <input type="checkbox" checked={accepted} onChange={(e) => { setAccepted(e.target.checked); setErrors({}) }} className="mt-1 size-4 accent-[#2d3484]" aria-invalid={!!errors.accepted} />
                  <span>Acepto los términos y condiciones, la política de tratamiento de datos personales y la política de devoluciones de SIEV S.A.S.</span>
                </label>
                {errors.accepted && <p className="mt-1 text-[12px] text-[#b42318]">{errors.accepted}</p>}
              </div>
              <div className="flex flex-wrap justify-between gap-3">
                <button type="button" onClick={() => setStep(1)} className={button('ghost')}>← Volver</button>
                <button type="button" onClick={placeOrder} disabled={submitting} className={button('primary', 'h-12 px-8')}>
                  {submitting ? <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Procesando pago…</> : <><Lock size={15} /> Pagar {formatPrice(totals.total)}</>}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4 border border-[#e6e6eb] bg-white p-5 lg:sticky lg:top-36" aria-label="Resumen del pedido">
          <h2 className="m-0 text-[18px] font-semibold tracking-[-.02em]">Tu pedido</h2>
          <ul className="max-h-64 space-y-3 overflow-y-auto pr-2 pt-2">
            {cartLines.map((l) => (
              <li key={l.key} className="flex items-center gap-3">
                <span className="relative h-12 w-16 shrink-0 bg-[#f3f3f0]"><ProductArt type={l.product.art} color={l.colorHex} /><span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-secundario text-[10px] font-bold text-white">{l.qty}</span></span>
                <span className="line-clamp-2 flex-1 text-[12px] font-medium leading-snug">{l.product.name}</span>
                <span className="text-[13px] font-semibold">{formatPrice(l.unitPrice * l.qty)}</span>
              </li>
            ))}
          </ul>
          <CouponForm subtotal={totals.subtotal} />
          <OrderSummary totals={totals} coupon={coupon} />
        </aside>
      </div>
    </div>
  )
}
