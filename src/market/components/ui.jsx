import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Minus, Plus, Star } from 'lucide-react'
import { formatPrice } from '../lib/format'

import { cx } from './styles'

export function Eyebrow({ children, className = '' }) {
  return <p className={cx('mb-3 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[.18em] text-secundario', className)}>
    <span className="size-[7px] rounded-full bg-principal" aria-hidden="true" />{children}
  </p>
}

export function SectionHeading({ eyebrow, title, action, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="m-0 text-[clamp(26px,2.6vw,36px)] font-semibold leading-tight tracking-[-.04em]">{title}</h2>
        {children}
      </div>
      {action}
    </div>
  )
}

export function Rating({ value, count, size = 14, showValue = false }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`Calificación ${value.toFixed(1)} de 5${count != null ? `, ${count} reseñas` : ''}`}>
      <span className="relative inline-flex" aria-hidden="true">
        <span className="flex text-[#d8d9df]">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={size} fill="currentColor" strokeWidth={0} />)}</span>
        <span className="absolute inset-0 flex overflow-hidden text-principal" style={{ width: `${(value / 5) * 100}%` }}>
          {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={size} fill="currentColor" strokeWidth={0} className="shrink-0" />)}
        </span>
      </span>
      {showValue && <span className="text-[12px] font-semibold">{value.toFixed(1)}</span>}
      {count != null && <span className="text-[12px] text-[#73757d]">({count.toLocaleString('es-CO')})</span>}
    </span>
  )
}

export function Price({ price, oldPrice, size = 'md' }) {
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0
  const sizes = { sm: 'text-[16px]', md: 'text-[19px]', lg: 'text-[32px]' }
  return (
    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span className={cx(sizes[size], 'font-semibold tracking-[-.03em] text-[#222630]')}>{formatPrice(price)}</span>
      {oldPrice && <>
        <span className="text-[12px] text-[#8a8c94] line-through">{formatPrice(oldPrice)}</span>
        <span className="bg-[#fdeee7] px-1.5 py-0.5 text-[11px] font-bold text-principal">-{discount}%</span>
      </>}
    </div>
  )
}

export function QuantityInput({ value, onChange, max = 10, min = 1, size = 'md', label = 'Cantidad' }) {
  const h = size === 'sm' ? 'h-8' : 'h-11'
  return (
    <div className={cx('inline-flex items-center border border-[#dddfe5] bg-white', h)} role="group" aria-label={label}>
      <button type="button" className="grid h-full w-9 place-items-center text-[#626570] hover:text-secundario disabled:opacity-30" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Disminuir cantidad"><Minus size={14} /></button>
      <input
        className="h-full w-10 border-x border-[#eeeef2] text-center text-[13px] font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        type="number" inputMode="numeric" min={min} max={max} value={value} aria-label={label}
        onChange={(e) => { const n = parseInt(e.target.value, 10); if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n))) }}
      />
      <button type="button" className="grid h-full w-9 place-items-center text-[#626570] hover:text-secundario disabled:opacity-30" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Aumentar cantidad"><Plus size={14} /></button>
    </div>
  )
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-6 text-[12px] text-[#73757d]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
            {item.to ? <Link to={item.to} className="hover:text-secundario hover:underline">{item.label}</Link> : <span aria-current="page" className="text-[#222630]">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="flex flex-col items-center border border-dashed border-[#d9d9de] bg-white px-6 py-16 text-center">
      {Icon && <span className="mb-5 grid size-14 place-items-center bg-[#f6f0ed] text-principal"><Icon size={26} /></span>}
      <h2 className="mb-2 text-[22px] font-semibold tracking-[-.03em]">{title}</h2>
      <div className="mb-6 max-w-md text-[14px] leading-relaxed text-[#626570]">{children}</div>
      {action}
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={cx('animate-pulse bg-[#ececf0]', className)} />
}

export function Badge({ children, tone = 'indigo' }) {
  const tones = {
    indigo: 'bg-secundario text-white',
    orange: 'bg-principal text-white',
    light: 'bg-white text-secundario border border-[#e2e2e8]',
    green: 'bg-[#edf7ee] text-[#20592b]',
    gray: 'bg-[#ececf0] text-[#4a4d57]',
  }
  return <span className={cx('inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-[.1em]', tones[tone])}>{children}</span>
}

function msUntilMidnight() {
  const now = new Date()
  const end = new Date(now)
  end.setHours(24, 0, 0, 0)
  return end - now
}

export function Countdown({ className = '' }) {
  const [ms, setMs] = useState(msUntilMidnight)
  useEffect(() => {
    const t = setInterval(() => setMs(msUntilMidnight()), 1000)
    return () => clearInterval(t)
  }, [])
  const parts = [Math.floor(ms / 3600000), Math.floor(ms / 60000) % 60, Math.floor(ms / 1000) % 60]
  return (
    <span className={cx('inline-flex items-center gap-1 font-mono', className)} aria-label={`La oferta termina en ${parts[0]} horas y ${parts[1]} minutos`}>
      {parts.map((n, i) => <span key={i} className="flex items-center gap-1"><span className="min-w-[2ch] bg-[#222630] px-1.5 py-1 text-center text-[13px] font-semibold text-white">{String(n).padStart(2, '0')}</span>{i < 2 && <span aria-hidden="true">:</span>}</span>)}
    </span>
  )
}

export function Dialog({ open, onClose, title, children, labelledBy = 'dialog-title', size = 'max-w-md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[#15182bb3] p-4 backdrop-blur-[3px] mk-fade" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div role="dialog" aria-modal="true" aria-labelledby={labelledBy} className={cx('mk-pop max-h-[90vh] w-full overflow-auto bg-white p-7 shadow-2xl', size)}>
        {title && <h2 id={labelledBy} className="mb-4 text-[24px] font-semibold tracking-[-.04em]">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
