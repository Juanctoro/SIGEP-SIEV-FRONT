import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AlertTriangle, Building2, CalendarDays, Download, FileText, Pencil, Plus, ReceiptText, RefreshCw, Search, Trash2, TrendingUp, User } from 'lucide-react'
import { formatPrice } from '../../market/lib/format'
import { ConfirmDialog, Toast } from '../ui'
import { button, cx, inputClass } from '../styles'
import { deleteQuote, listQuotes, openQuotePdf } from './quotesApi'

const normalize = (text = '') => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const shortDate = (iso) => new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))

function Stat({ icon: Icon, label, value, detail, tone }) {
  const tones = { indigo: 'bg-[#eceefb] text-secundario', orange: 'bg-[#fdeee6] text-principal', green: 'bg-[#e7f6ec] text-[#1d6b37]', gray: 'bg-[#eff0f4] text-[#555867]' }
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-[#e6e7ef] bg-white p-5">
      <span className={cx('grid size-11 shrink-0 place-items-center rounded-xl', tones[tone])}><Icon size={20} /></span>
      <div className="min-w-0">
        <p className="m-0 text-[12px] font-medium text-[#7a7d8c]">{label}</p>
        <p className="m-0 mt-0.5 truncate text-[22px] font-semibold tracking-[-.02em]">{value}</p>
        {detail && <p className="m-0 mt-0.5 text-[12px] text-[#8a8d9c]">{detail}</p>}
      </div>
    </div>
  )
}

function ClientCell({ quote }) {
  const Icon = quote.client_type === 'juridica' ? Building2 : User
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eceefb] text-secundario"><Icon size={16} /></span>
      <span className="min-w-0">
        <span className="block max-w-[240px] truncate font-semibold text-[#1f2230]">{quote.client_name}</span>
        <span className="block text-[12px] text-[#8a8d9c]">{quote.document_label} {quote.client_document}</span>
      </span>
    </span>
  )
}

function Actions({ quote, onPdf, onEdit, onDelete }) {
  const icon = 'grid size-9 place-items-center rounded-lg text-[#5a5d6c] transition'
  return (
    <div className="flex justify-end gap-1">
      <button type="button" onClick={() => onPdf(quote)} className={cx(icon, 'hover:bg-[#fdeee6] hover:text-principal')} aria-label={`Ver PDF de ${quote.number}`} title="Ver PDF"><FileText size={16} /></button>
      <button type="button" onClick={() => onPdf(quote, true)} className={cx(icon, 'hover:bg-[#eceefb] hover:text-secundario')} aria-label={`Descargar PDF de ${quote.number}`} title="Descargar PDF"><Download size={16} /></button>
      <button type="button" onClick={() => onEdit(quote)} className={cx(icon, 'hover:bg-[#eceefb] hover:text-secundario')} aria-label={`Editar ${quote.number}`} title="Editar"><Pencil size={16} /></button>
      <button type="button" onClick={() => onDelete(quote)} className={cx(icon, 'hover:bg-[#fdecea] hover:text-[#c4321c]')} aria-label={`Eliminar ${quote.number}`} title="Eliminar"><Trash2 size={16} /></button>
    </div>
  )
}

export default function QuotesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [quotes, setQuotes] = useState([])
  const [status, setStatus] = useState('loading')
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  // Al volver del editor llega { saved, editing }: aviso con acceso directo al PDF.
  const [toast, setToast] = useState(() => {
    const arrival = location.state
    if (!arrival?.saved) return null
    return {
      message: arrival.editing ? `${arrival.saved.number} se actualizó y su PDF se regeneró.` : `${arrival.saved.number} se creó con su PDF.`,
      pdfQuote: arrival.saved,
    }
  })
  const [now] = useState(() => new Date())

  // Se limpia el estado del historial para que el aviso no reaparezca al recargar.
  useEffect(() => {
    if (location.state?.saved) navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate])

  const showPdf = useCallback((quote, download = false) => {
    openQuotePdf(quote, { download }).catch((error) => setToast({ tone: 'error', message: error.message }))
  }, [])

  useEffect(() => {
    let active = true
    listQuotes()
      .then((list) => { if (active) { setQuotes(list); setStatus('ready') } })
      .catch((error) => { if (active) { setLoadError(error.message); setStatus('error') } })
    return () => { active = false }
  }, [reloadKey])

  const stats = useMemo(() => {
    const thisMonth = quotes.filter((q) => { const d = new Date(q.created_at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() })
    const total = quotes.reduce((sum, q) => sum + Number(q.total), 0)
    return {
      count: quotes.length,
      total,
      month: thisMonth.length,
      monthTotal: thisMonth.reduce((sum, q) => sum + Number(q.total), 0),
      average: quotes.length ? total / quotes.length : 0,
    }
  }, [quotes, now])

  const visible = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean)
    return quotes.filter((q) => words.every((w) => normalize(`${q.number} ${q.client_name} ${q.client_document} ${q.subject} ${q.client_email}`).includes(w)))
  }, [quotes, query])

  const closeToast = useCallback(() => setToast(null), [])
  const cancelDelete = useCallback(() => setToDelete(null), [])
  const edit = (quote) => navigate(`/admin/cotizaciones/${quote.id}`)

  async function confirmDelete() {
    setDeleting(true)
    try {
      await deleteQuote(toDelete.id)
      setQuotes((list) => list.filter((q) => q.id !== toDelete.id))
      setToast({ message: `${toDelete.number} se eliminó junto con su PDF.` })
      setToDelete(null)
    } catch (error) {
      setToast({ tone: 'error', message: error.message })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[.16em] text-principal">Gestión</p>
          <h1 className="m-0 text-[28px] font-semibold tracking-[-.03em]">Cotizaciones</h1>
          <p className="m-0 mt-1 text-[14px] text-[#6c6f7e]">Propuestas comerciales con productos del inventario, mano de obra e IVA.</p>
        </div>
        <Link to="/admin/cotizaciones/nueva" className={button('primary', 'px-5 py-3 shadow-sm')}><Plus size={17} /> Nueva cotización</Link>
      </div>

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={ReceiptText} label="Cotizaciones" value={stats.count} detail="Emitidas en total" tone="indigo" />
        <Stat icon={TrendingUp} label="Valor cotizado" value={formatPrice(stats.total)} detail="Suma de totales con IVA" tone="green" />
        <Stat icon={CalendarDays} label="Este mes" value={stats.month} detail={formatPrice(stats.monthTotal)} tone="orange" />
        <Stat icon={FileText} label="Ticket promedio" value={formatPrice(stats.average)} detail="Por cotización" tone="gray" />
      </div>

      <div className="mb-4 rounded-2xl border border-[#e6e7ef] bg-white p-3">
        <div className="relative">
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9dac]" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por número, cliente, documento o asunto" aria-label="Buscar cotizaciones" className={cx(inputClass, 'pl-10')} />
        </div>
      </div>

      {status === 'loading' && (
        <div className="space-y-2 rounded-2xl border border-[#e6e7ef] bg-white p-4" role="status" aria-label="Cargando cotizaciones">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-[#f1f2f7]" />)}
        </div>
      )}

      {status === 'error' && (
        <div className="grid place-items-center rounded-2xl border border-[#f3d2cc] bg-[#fff8f6] px-6 py-12 text-center">
          <AlertTriangle size={26} className="mb-3 text-[#c4321c]" />
          <p className="mb-4 text-[14px] text-[#5a5d6c]">{loadError}</p>
          <button type="button" onClick={() => { setStatus('loading'); setReloadKey((n) => n + 1) }} className={button('outline')}><RefreshCw size={15} /> Reintentar</button>
        </div>
      )}

      {status === 'ready' && (visible.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-[#dcdde8] bg-white px-6 py-16 text-center">
          <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-[#eceefb] text-secundario"><ReceiptText size={26} /></span>
          <h2 className="mb-1 text-[16px] font-semibold">{query ? 'Ninguna cotización coincide' : 'Aún no hay cotizaciones'}</h2>
          <p className="mb-5 max-w-sm text-[13px] text-[#7a7d8c]">{query ? 'Prueba con otro número, cliente o asunto.' : 'Crea la primera: eliges el cliente, los productos y la mano de obra, y se genera el PDF.'}</p>
          {query ? <button type="button" onClick={() => setQuery('')} className={button('outline')}>Limpiar búsqueda</button> : <Link to="/admin/cotizaciones/nueva" className={button('primary')}><Plus size={16} /> Nueva cotización</Link>}
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-[#e6e7ef] bg-white lg:block">
            <table className="w-full border-collapse text-left text-[13px]">
              <caption className="sr-only">Cotizaciones emitidas</caption>
              <thead className="bg-[#fafbfd] text-[11px] font-semibold uppercase tracking-[.08em] text-[#8a8d9c]">
                <tr>
                  <th scope="col" className="px-5 py-3">Cotización</th>
                  <th scope="col" className="px-3 py-3">Cliente</th>
                  <th scope="col" className="px-3 py-3">Asunto</th>
                  <th scope="col" className="px-3 py-3 text-right">Total</th>
                  <th scope="col" className="px-3 py-3">Elaboró</th>
                  <th scope="col" className="px-5 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f1f6]">
                {visible.map((q) => (
                  <tr key={q.id} className="transition hover:bg-[#fafbff]">
                    <td className="px-5 py-3">
                      <button type="button" onClick={() => edit(q)} className="text-left">
                        <span className="block font-semibold text-secundario hover:underline">{q.number}</span>
                        <span className="block text-[12px] text-[#8a8d9c]">{shortDate(q.created_at)}</span>
                      </button>
                    </td>
                    <td className="px-3 py-3"><ClientCell quote={q} /></td>
                    <td className="px-3 py-3"><span className="line-clamp-2 max-w-[300px] text-[#4a4d5c]">{q.subject}</span></td>
                    <td className="px-3 py-3 text-right">
                      <span className="block font-semibold tabular-nums">{formatPrice(Number(q.total))}</span>
                      <span className="block text-[11px] text-[#8a8d9c]">{q.items.length} prod. · IVA incl.</span>
                    </td>
                    <td className="px-3 py-3 text-[#5a5d6c]">{q.created_by_name ?? '—'}</td>
                    <td className="px-5 py-3"><Actions quote={q} onPdf={showPdf} onEdit={edit} onDelete={setToDelete} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="m-0 border-t border-[#f0f1f6] px-5 py-3 text-[12px] text-[#8a8d9c]">{visible.length} de {quotes.length} cotizaciones</p>
          </div>

          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:hidden">
            {visible.map((q) => (
              <li key={q.id} className="rounded-2xl border border-[#e6e7ef] bg-white p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="m-0 font-semibold text-secundario">{q.number}</p>
                    <p className="m-0 text-[12px] text-[#8a8d9c]">{shortDate(q.created_at)}</p>
                  </div>
                  <p className="m-0 text-right text-[16px] font-semibold tabular-nums">{formatPrice(Number(q.total))}</p>
                </div>
                <ClientCell quote={q} />
                <p className="m-0 mt-3 line-clamp-2 text-[13px] text-[#5a5d6c]">{q.subject}</p>
                <div className="mt-3 border-t border-[#f0f1f6] pt-2"><Actions quote={q} onPdf={showPdf} onEdit={edit} onDelete={setToDelete} /></div>
              </li>
            ))}
          </ul>
        </>
      ))}

      {toDelete && (
        <ConfirmDialog title="¿Eliminar esta cotización?" busy={deleting} onConfirm={confirmDelete} onCancel={cancelDelete}>
          Se eliminará <strong>{toDelete.number}</strong> de {toDelete.client_name} y su PDF. Esta acción no se puede deshacer.
        </ConfirmDialog>
      )}

      <Toast toast={toast?.pdfQuote ? { ...toast, action: { label: 'Ver PDF', run: () => showPdf(toast.pdfQuote) } } : toast} onClose={closeToast} />
    </>
  )
}
