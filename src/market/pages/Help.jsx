import { Link } from 'react-router'
import { ChevronDown } from 'lucide-react'
import { Breadcrumbs, Eyebrow } from '../components/ui'
import { button } from '../components/styles'
import { BenefitsStrip } from '../components/Footer'
import { formatPrice } from '../lib/format'
import { shippingRules } from '../data/catalog'
import { paths } from '../routes'

const faqs = [
  ['¿Cuánto cuesta el envío?', `El envío estándar cuesta ${formatPrice(shippingRules.standard)} y es gratis en compras desde ${formatPrice(shippingRules.freeFrom)}. El envío express cuesta ${formatPrice(shippingRules.express)}. Recoger en tienda no tiene costo.`],
  ['¿Cuánto tarda en llegar mi pedido?', 'El envío estándar tarda de 2 a 4 días hábiles en ciudades principales. El envío express llega al siguiente día hábil en Cali, Bogotá y Medellín.'],
  ['¿Qué medios de pago aceptan?', 'Tarjetas de crédito y débito (Visa, Mastercard, American Express), PSE y pago contraentrega para compras hasta $5.000.000.'],
  ['¿Puedo pagar a cuotas?', 'Sí. Con tarjeta de crédito puedes diferir tu compra hasta en 12 cuotas sin interés con bancos participantes, o hasta 36 cuotas con la tasa de tu banco.'],
  ['¿Cómo funciona la garantía?', 'Todos los productos son nuevos y cuentan con garantía oficial del fabricante. Puedes radicar la solicitud desde “Mis pedidos” o en nuestra tienda en Cali.'],
  ['¿Puedo devolver un producto?', 'Tienes hasta 30 días después de recibir tu pedido para solicitar el retracto o la devolución, siempre que el producto esté en su empaque original y sin uso.'],
  ['¿Cómo uso las listas?', 'Toca el corazón para guardar en Favoritos o “Añadir a una lista” para organizar productos en listas personalizadas, por ejemplo “Oficina en casa” o “Regalos”.'],
]

export default function Help() {
  return (
    <>
      <div className="w-full px-5 lg:px-10 2xl:px-14 py-8">
        <Breadcrumbs items={[{ label: 'Inicio', to: paths.home }, { label: 'Ayuda' }]} />
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>Centro de ayuda</Eyebrow>
            <h1 className="mb-5 text-[clamp(32px,3.6vw,48px)] font-semibold leading-tight tracking-[-.05em]">¿En qué podemos <span className="text-principal">ayudarte?</span></h1>
            <p className="mb-8 max-w-sm text-[15px] leading-relaxed text-[#626570]">Resolvemos las dudas más comunes sobre envíos, pagos, garantías y devoluciones.</p>
            <div className="bg-secundario p-6 text-[#d4d6ef]">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[.15em] text-white">Atención al cliente</p>
              <p className="mb-4 text-[13px] leading-relaxed">Lunes a sábado, 8:00 a. m. a 6:00 p. m.<br />+57 300 000 0000 · tienda@siev.example</p>
              <Link to={paths.orders} className={button('primary')}>Consultar mis pedidos</Link>
            </div>
          </div>
          <div className="divide-y divide-[#e2e2e8] border-y border-[#e2e2e8]">
            {faqs.map(([q, a]) => (
              <details key={q} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                  {q}<ChevronDown size={18} className="shrink-0 text-principal transition group-open:rotate-180" />
                </summary>
                <p className="mb-4 mt-0 text-[14px] leading-relaxed text-[#626570]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12"><BenefitsStrip /></div>
    </>
  )
}
