import { useEffect, useRef } from 'react'
import { AlertTriangle, CheckCircle2, X } from 'lucide-react'

import { button, cx } from './styles'

const badgeTones = {
  green: 'bg-[#e7f6ec] text-[#1d6b37]',
  orange: 'bg-[#fdeee6] text-[#b2410f]',
  indigo: 'bg-[#eceefb] text-secundario',
  gray: 'bg-[#eff0f4] text-[#555867]',
}

export function Badge({ tone = 'gray', children, dot = false }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold', badgeTones[tone])}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}

export function Field({ id, label, hint, error, required, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-[12px] font-semibold text-[#3a3d4c]">
        <span>{label}{required && <span className="text-principal" aria-hidden="true"> *</span>}</span>
        {hint && <span className="font-normal text-[#8a8d9c]">{hint}</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mb-0 mt-1.5 text-[12px] text-[#c4321c]">{error}</p>}
    </div>
  )
}

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onClose, toast.action ? 8000 : 3500)
    return () => clearTimeout(timer)
  }, [toast, onClose])
  if (!toast) return null
  const error = toast.tone === 'error'
  return (
    <div role="status" className="adm-pop fixed bottom-5 right-5 z-[70] flex max-w-sm items-start gap-3 rounded-xl bg-[#1f2230] px-4 py-3 text-[13px] text-white shadow-xl">
      {error ? <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#ff9b7a]" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#7ee2a0]" />}
      <span className="flex-1">{toast.message}</span>
      {toast.action && <button type="button" onClick={() => { toast.action.run(); onClose() }} className="shrink-0 font-semibold text-[#ffb08f] hover:text-white">{toast.action.label}</button>}
      <button type="button" onClick={onClose} className="text-white/60 hover:text-white" aria-label="Cerrar aviso"><X size={16} /></button>
    </div>
  )
}

export function ConfirmDialog({ title, children, confirmLabel = 'Eliminar', busy = false, onConfirm, onCancel }) {
  const cancelRef = useRef(null)
  useEffect(() => {
    cancelRef.current?.focus()
    const onKey = (event) => { if (event.key === 'Escape' && !busy) onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onCancel])
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
      <button type="button" className="adm-fade-in absolute inset-0 bg-[#0d0f2b]/45" onClick={() => !busy && onCancel()} aria-label="Cancelar" tabIndex={-1} />
      <div className="adm-pop relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <span className="mb-4 grid size-11 place-items-center rounded-full bg-[#fdecea] text-[#c4321c]"><AlertTriangle size={20} /></span>
        <h2 id="confirm-title" className="mb-2 text-[17px] font-semibold">{title}</h2>
        <div className="mb-6 text-[14px] leading-relaxed text-[#5a5d6c]">{children}</div>
        <div className="flex justify-end gap-2">
          <button ref={cancelRef} type="button" onClick={onCancel} disabled={busy} className={button('ghost')}>Cancelar</button>
          <button type="button" onClick={onConfirm} disabled={busy} className={button('danger')}>{busy ? 'Eliminando…' : confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
