import { Link } from 'react-router'
import { ChevronDown } from 'lucide-react'
import { Breadcrumbs, Eyebrow } from '../components/ui'
import { button } from '../components/styles'
import { BenefitsStrip } from '../components/Footer'
import { storePhone, storeWhatsapp } from '../lib/whatsapp'
import { paths } from '../routes'

const faqs = [
  ['¿Cómo hago un pedido?', 'Agrega los productos al carrito, toca “Hacer pedido” y completa tus datos. Se abrirá WhatsApp con el mensaje del pedido listo: solo tienes que enviarlo y un asesor te responde para confirmarlo.'],
  ['¿Cuánto cuesta el envío?', 'El costo depende de la ciudad y del tamaño del pedido. Te lo confirmamos por WhatsApp antes de despachar. Recoger en nuestro punto de venta no tiene costo.'],
  ['¿Qué medios de pago aceptan?', 'Transferencia bancaria, Nequi, efectivo al recibir y tarjeta en el punto de venta. Al hacer el pedido eliges tu forma de pago preferida y la acordamos por WhatsApp.'],
  ['¿Por qué no pago en la página?', 'Preferimos atenderte de forma personal: confirmamos disponibilidad, te asesoramos y acordamos la entrega antes de recibir cualquier pago.'],
  ['¿Cómo funciona la garantía?', 'Todos los productos son nuevos y cuentan con garantía oficial del fabricante. Escríbenos por WhatsApp con el número de tu pedido para iniciar la solicitud.'],
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
              <p className="mb-4 text-[13px] leading-relaxed">Lunes a sábado, 8:00 a. m. a 6:00 p. m.<br />WhatsApp {storePhone}</p>
              <div className="flex flex-wrap gap-2">
                <a href={`https://wa.me/${storeWhatsapp}`} target="_blank" rel="noopener noreferrer" className={button('primary')}>Escribir por WhatsApp</a>
                <Link to={paths.orders} className={button('ghost', 'text-white hover:bg-white/10')}>Mis pedidos</Link>
              </div>
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
