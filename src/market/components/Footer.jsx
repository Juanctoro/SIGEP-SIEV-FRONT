import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, CreditCard, Headset, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import logo from '../../assets/LogoSIEV.png'
import { categories } from '../data/catalog'
import { useStore } from '../context/StoreContext'
import { paths } from '../routes'
import { inputClass } from './styles'

const year = new Date().getFullYear()

const benefits = [
  { icon: Truck, title: 'Envío a todo el país', text: 'Gratis desde $299.900' },
  { icon: CreditCard, title: 'Paga como quieras', text: 'Tarjeta, PSE o contraentrega' },
  { icon: ShieldCheck, title: 'Garantía oficial', text: 'Productos nuevos y sellados' },
  { icon: RotateCcw, title: 'Devoluciones fáciles', text: 'Hasta 30 días después' },
]

export function BenefitsStrip() {
  return (
    <section aria-label="Beneficios" className="border-y border-[#e6e6eb] bg-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className={`flex items-center gap-4 px-5 py-6 ${i % 2 ? '' : 'border-r'} border-[#ececf0] lg:border-r lg:last:border-r-0 ${i < 2 ? 'border-b lg:border-b-0' : ''}`}>
            <span className="grid size-11 shrink-0 place-items-center bg-[#f6f0ed] text-principal"><Icon size={20} /></span>
            <span><strong className="block text-[13px] font-semibold">{title}</strong><span className="text-[12px] text-[#73757d]">{text}</span></span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Footer() {
  const { notify } = useStore()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function subscribe(e) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Escribe un correo electrónico válido.'); return }
    setError('')
    setEmail('')
    notify('¡Listo! Te enviaremos las mejores ofertas.')
  }

  return (
    <footer className="mt-20 bg-secundario text-[#d4d6ef]">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
        <div>
          <span className="inline-block bg-white p-2"><img src={logo} alt="SIEV" className="h-12" /></span>
          <p className="mt-5 max-w-xs text-[13px] leading-relaxed">Tecnología para tu hogar y tu empresa, con el respaldo de Soluciones Integrales Eléctricas del Valle S.A.S.</p>
          <p className="mt-4 flex items-center gap-2 text-[13px]"><Headset size={16} className="text-principal" /> +57 300 000 0000 · Lun a sáb</p>
        </div>
        <div>
          <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[.18em] text-white">Categorías</h2>
          <ul className="space-y-2.5 text-[13px]">{categories.slice(0, 7).map((c) => <li key={c.id}><Link to={paths.category(c.id)} className="hover:text-white">{c.name}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[.18em] text-white">Tu compra</h2>
          <ul className="space-y-2.5 text-[13px]">
            <li><Link to={paths.orders} className="hover:text-white">Mis pedidos</Link></li>
            <li><Link to={paths.lists} className="hover:text-white">Mis listas</Link></li>
            <li><Link to={paths.cart} className="hover:text-white">Carrito</Link></li>
            <li><Link to={paths.help} className="hover:text-white">Envíos y devoluciones</Link></li>
            <li><Link to={paths.help} className="hover:text-white">Preguntas frecuentes</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[.18em] text-white">Recibe ofertas</h2>
          <p className="mb-4 text-[13px] leading-relaxed">Suscríbete y recibe descuentos exclusivos y lanzamientos antes que nadie.</p>
          <form onSubmit={subscribe} noValidate>
            <label htmlFor="newsletter" className="sr-only">Correo electrónico</label>
            <div className="flex">
              <input id="newsletter" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} placeholder="tu@correo.com" aria-invalid={!!error} aria-describedby={error ? 'newsletter-error' : undefined} className={`${inputClass} border-0`} />
              <button type="submit" className="grid w-12 shrink-0 place-items-center bg-principal text-white hover:bg-[#c94c17]" aria-label="Suscribirme"><ArrowRight size={18} /></button>
            </div>
            {error && <p id="newsletter-error" className="mt-2 text-[12px] text-[#ffb4a1]">{error}</p>}
          </form>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-2 px-5 py-5 text-[11px] text-[#aeb1d6] sm:flex-row">
          <p className="m-0">© {year} SIEV S.A.S. · Tienda de tecnología</p>
          <p className="m-0">Sitio de demostración · Productos, precios e inventario ilustrativos</p>
        </div>
      </div>
    </footer>
  )
}
