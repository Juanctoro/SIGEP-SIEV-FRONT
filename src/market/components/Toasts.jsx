import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { cx } from './styles'

const icons = { success: CheckCircle2, warning: AlertTriangle, neutral: Info }
const colors = { success: 'text-[#2f7a3d]', warning: 'text-principal', neutral: 'text-secundario' }

export default function Toasts() {
  const { toasts, dismissToast } = useStore()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:items-end" role="status" aria-live="polite">
      {toasts.map((t) => {
        const Icon = icons[t.tone] ?? Info
        return (
          <div key={t.id} className="mk-toast pointer-events-auto flex w-full max-w-sm items-center gap-3 border-l-4 border-principal bg-[#222630] px-4 py-3 text-[13px] text-white shadow-2xl">
            <Icon size={18} className={cx('shrink-0', colors[t.tone], 'brightness-150')} />
            <span className="flex-1 leading-snug">{t.message}</span>
            {t.action && <button type="button" className="font-semibold text-[#ffb08f] hover:underline" onClick={() => { t.action.run(); dismissToast(t.id) }}>{t.action.label}</button>}
            <button type="button" aria-label="Cerrar notificación" className="text-white/60 hover:text-white" onClick={() => dismissToast(t.id)}><X size={15} /></button>
          </div>
        )
      })}
    </div>
  )
}
