import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { AlertTriangle, ArrowLeft, Building2, FileCheck2, Minus, PackagePlus, Plus, Search, Trash2, User, UserSearch, Wrench, X } from 'lucide-react'
import ProductArt from '../../market/components/ProductArt'
import { fallbackImage } from '../../market/data/fallbackImages'
import { formatPrice } from '../../market/lib/format'
import { listProducts } from '../products/productsApi'
import { Field } from '../ui'
import { button, cx, inputClass } from '../styles'
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS, computeTotals, getQuote, saveQuote, searchClients } from './quotesApi'

const OTHER = '__otro__'
const EMPTY_CLIENT = { client_type: 'natural', client_document: '', client_name: '', client_email: '', client_phone: '', client_address: '', client_contact: '' }
const EMPTY = { ...EMPTY_CLIENT, subject: '', labor_description: '', labor_cost: '', delivery_time: '', payment_terms: '', validity_days: 30, notes: '' }
const normalize = (text = '') => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function Card({ step, icon: Icon, title, description, action, children }) {
  return (
    <section className="rounded-2xl border border-[#e6e7ef] bg-white">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f0f1f6] px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eceefb] text-secundario"><Icon size={18} /></span>
          <div>
            <p className="m-0 text-[10px] font-bold uppercase tracking-[.16em] text-principal">Paso {step}</p>
            <h2 className="m-0 text-[15px] font-semibold">{title}</h2>
            {description && <p className="m-0 mt-0.5 text-[12px] text-[#7a7d8c]">{description}</p>}
          </div>
        </div>
        {action}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

function Segmented({ value, options, onChange, label }) {
  return (
    <div className="inline-flex rounded-lg bg-[#f2f3f8] p-1" role="radiogroup" aria-label={label}>
      {options.map(({ value: v, label: l, icon: Icon }) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)}
          className={cx('inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold transition', value === v ? 'bg-white text-secundario shadow-sm' : 'text-[#6c6f7e] hover:text-[#1f2230]')}>
          {Icon && <Icon size={14} />}{l}
        </button>
      ))}
    </div>
  )
}

/** Directorio provisional: clientes que ya tienen cotizaciones. */
function ClientFinder({ onPick }) {
  const [query, setQuery] = useState('')
  const [state, setState] = useState({ status: 'idle', results: [], error: '' })

  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      searchClients(query.trim())
        .then((results) => { if (active) setState({ status: 'ready', results, error: '' }) })
        .catch((error) => { if (active) setState({ status: 'error', results: [], error: error.message }) })
    }, 250)
    return () => { active = false; clearTimeout(timer) }
  }, [query])

  return (
    <div>
      <div className="relative mb-3">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9dac]" />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre, documento o correo" aria-label="Buscar cliente" className={cx(inputClass, 'pl-9')} autoFocus />
      </div>
      {state.status === 'error' && <p className="text-[13px] text-[#c4321c]">{state.error}</p>}
      {state.status === 'ready' && !state.results.length && (
        <p className="m-0 rounded-xl bg-[#fafbfd] p-4 text-center text-[13px] text-[#7a7d8c]">{query ? 'No hay clientes que coincidan.' : 'Aún no hay clientes cotizados. Ingresa los datos manualmente.'}</p>
      )}
      <ul className="m-0 max-h-72 list-none space-y-1.5 overflow-y-auto p-0">
        {state.results.map((client) => (
          <li key={`${client.client_type}-${client.client_document}`}>
            <button type="button" onClick={() => onPick(client)} className="flex w-full items-center gap-3 rounded-xl border border-[#eceef4] p-3 text-left transition hover:border-secundario hover:bg-[#fafbff]">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eceefb] text-secundario">{client.client_type === 'juridica' ? <Building2 size={16} /> : <User size={16} />}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold">{client.client_name}</span>
                <span className="block truncate text-[12px] text-[#8a8d9c]">{client.client_type === 'juridica' ? 'NIT' : 'ID'} {client.client_document}{client.client_email ? ` · ${client.client_email}` : ''}</span>
              </span>
              <span className="text-[12px] font-semibold text-secundario">Usar</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProductPicker({ products, items, onAdd }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const results = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean)
    return products.filter((p) => words.every((w) => normalize(`${p.code} ${p.name} ${p.brand} ${p.reference} ${p.category}`).includes(w))).slice(0, 8)
  }, [products, query])

  useEffect(() => {
    const onClick = (event) => { if (!boxRef.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function add(product) {
    onAdd(product)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={boxRef} className="relative">
      <Search size={16} className="pointer-events-none absolute left-3 top-[21px] -translate-y-1/2 text-[#9a9dac]" />
      <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (results[0]) add(results[0]) } if (e.key === 'Escape') setOpen(false) }}
        placeholder="Buscar producto del inventario por nombre, código o marca…" aria-label="Agregar producto" className={cx(inputClass, 'pl-9')} role="combobox" aria-expanded={open} aria-controls="product-results" />
      {open && (
        <ul id="product-results" role="listbox" className="adm-pop absolute inset-x-0 top-full z-20 m-0 mt-2 max-h-80 list-none overflow-y-auto rounded-xl border border-[#e6e7ef] bg-white p-1.5 shadow-xl">
          {!results.length && <li className="p-4 text-center text-[13px] text-[#7a7d8c]">Ningún producto coincide.</li>}
          {results.map((p) => {
            const inQuote = items.find((item) => item.product === p.id)
            return (
              <li key={p.id} role="option" aria-selected={false}>
                <button type="button" onClick={() => add(p)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-[#f5f6fb]">
                  <span className="size-11 shrink-0 overflow-hidden rounded-lg bg-[#eef0f6]"><ProductArt type={p.image || fallbackImage(p.name, p.category)} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">{p.name}</span>
                    <span className="block truncate text-[12px] text-[#8a8d9c]">{p.code} · {p.brand} · Stock {p.stock}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[13px] font-semibold">{formatPrice(Number(p.sale_price))}</span>
                    <span className="block text-[11px] text-[#8a8d9c]">{inQuote ? `En la cotización (${inQuote.quantity})` : p.unit}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function ChoiceField({ id, label, options, value, onChange, error, placeholder }) {
  const preset = options.includes(value)
  const [custom, setCustom] = useState(Boolean(value) && !preset)
  return (
    <Field id={id} label={label} required error={error}>
      <select id={id} value={custom ? OTHER : value} onChange={(e) => { const next = e.target.value; if (next === OTHER) { setCustom(true); onChange('') } else { setCustom(false); onChange(next) } }}
        className={inputClass} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}>
        <option value="" disabled>Selecciona…</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
        <option value={OTHER}>Otro…</option>
      </select>
      {custom && <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={120} className={cx(inputClass, 'mt-2')} aria-label={`${label} (personalizado)`} autoFocus />}
    </Field>
  )
}

function validate(values, items) {
  const errors = {}
  if (!values.client_document.trim()) errors.client_document = values.client_type === 'juridica' ? 'Escribe el NIT.' : 'Escribe la identificación.'
  if (!values.client_name.trim()) errors.client_name = values.client_type === 'juridica' ? 'Escribe la razón social.' : 'Escribe el nombre del cliente.'
  if (values.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.client_email.trim())) errors.client_email = 'Escribe un correo válido.'
  if (!values.client_email.trim() && !values.client_phone.trim()) errors.client_email = 'Indica al menos un correo o un celular.'
  if (!values.subject.trim()) errors.subject = 'Escribe el asunto de la cotización.'
  if (values.labor_cost === '' || Number(values.labor_cost) < 0 || Number.isNaN(Number(values.labor_cost))) errors.labor_cost = 'Ingresa el valor de la mano de obra (0 si no aplica).'
  if (!items.length && !(Number(values.labor_cost) > 0)) errors.items = 'Agrega al menos un producto o un valor de mano de obra.'
  if (items.some((item) => !item.product)) errors.items = 'Hay productos que ya no existen en el inventario; quítalos para continuar.'
  if (!values.delivery_time.trim()) errors.delivery_time = 'Elige el tiempo de entrega.'
  if (!values.payment_terms.trim()) errors.payment_terms = 'Elige el tiempo de pago.'
  if (!(Number(values.validity_days) >= 1)) errors.validity_days = 'Mínimo 1 día.'
  return errors
}

function ConfirmCreate({ values, totals, items, editing, busy, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-quote-title">
      <button type="button" className="adm-fade-in absolute inset-0 bg-[#0d0f2b]/45" onClick={() => !busy && onCancel()} aria-label="Cancelar" tabIndex={-1} />
      <div className="adm-pop relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <span className="mb-4 grid size-11 place-items-center rounded-full bg-[#eceefb] text-secundario"><FileCheck2 size={20} /></span>
        <h2 id="confirm-quote-title" className="mb-2 text-[17px] font-semibold">{editing ? '¿Guardar los cambios?' : '¿Crear la cotización?'}</h2>
        <p className="mb-4 text-[14px] text-[#5a5d6c]">{editing ? 'Se actualizarán los datos y se generará de nuevo el PDF.' : 'Se asignará el consecutivo y se generará el PDF para enviar al cliente.'}</p>
        <dl className="m-0 mb-6 space-y-2 rounded-xl bg-[#fafbfd] p-4 text-[13px]">
          <div className="flex justify-between gap-4"><dt className="text-[#7a7d8c]">Cliente</dt><dd className="m-0 truncate text-right font-semibold">{values.client_name}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-[#7a7d8c]">Productos</dt><dd className="m-0 font-semibold">{items.length}</dd></div>
          <div className="flex justify-between gap-4 border-t border-[#eceef4] pt-2"><dt className="text-[#7a7d8c]">Total con IVA</dt><dd className="m-0 text-[16px] font-semibold text-secundario">{formatPrice(totals.total)}</dd></div>
        </dl>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={busy} className={button('ghost')}>Revisar</button>
          <button type="button" onClick={onConfirm} disabled={busy} className={button('primary', 'min-w-40')} autoFocus>{busy ? 'Generando PDF…' : editing ? 'Guardar y regenerar PDF' : 'Crear cotización'}</button>
        </div>
      </div>
    </div>
  )
}

// Se monta de nuevo al pasar de una cotización a otra para no arrastrar el estado.
export default function QuoteEditorRoute() {
  const { id } = useParams()
  return <QuoteEditor key={id ?? 'new'} id={id} />
}

function QuoteEditor({ id }) {
  const editing = Boolean(id)
  const navigate = useNavigate()
  const [values, setValues] = useState(EMPTY)
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [number, setNumber] = useState('')
  const [load, setLoad] = useState({ status: 'loading', error: '' })
  const [clientMode, setClientMode] = useState('manual')
  const [pickedClient, setPickedClient] = useState(false)
  const [errors, setErrors] = useState({})
  const [failure, setFailure] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const totals = computeTotals(items, values.labor_cost)
  const legal = values.client_type === 'juridica'

  useEffect(() => {
    let active = true
    Promise.all([listProducts(), editing ? getQuote(id) : null])
      .then(([productList, quote]) => {
        if (!active) return
        setProducts(productList)
        if (quote) {
          setNumber(quote.number)
          setValues(Object.fromEntries(Object.keys(EMPTY).map((key) => [key, key === 'labor_cost' ? String(Number(quote.labor_cost)) : quote[key] ?? EMPTY[key]])))
          const byId = new Map(productList.map((p) => [p.id, p]))
          setItems(quote.items.map((item) => ({ ...item, stock: byId.get(item.product)?.stock, image: byId.get(item.product)?.image, category: byId.get(item.product)?.category })))
        }
        setLoad({ status: 'ready', error: '' })
      })
      .catch((error) => { if (active) setLoad({ status: 'error', error: error.message }) })
    return () => { active = false }
  }, [editing, id])

  function set(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined, ...(name === 'client_phone' ? { client_email: undefined } : {}) }))
    setFailure('')
  }
  const change = (event) => set(event.target.name, event.target.value)

  function pickClient(client) {
    setValues((current) => ({ ...current, ...EMPTY_CLIENT, ...Object.fromEntries(Object.keys(EMPTY_CLIENT).map((key) => [key, client[key] ?? ''])) }))
    setErrors({})
    setPickedClient(true)
    setClientMode('manual')
  }

  function addProduct(product) {
    setErrors((current) => ({ ...current, items: undefined }))
    setItems((list) => {
      const existing = list.find((item) => item.product === product.id)
      if (existing) return list.map((item) => (item === existing ? { ...item, quantity: item.quantity + 1 } : item))
      return [...list, {
        product: product.id, code: product.code, name: product.name, brand: product.brand, unit: product.unit,
        unit_price: product.sale_price, quantity: 1, stock: product.stock, image: product.image, category: product.category,
      }]
    })
  }

  const setQuantity = (index, quantity) => setItems((list) => list.map((item, i) => (i === index ? { ...item, quantity: Math.max(1, Math.min(100000, quantity || 1)) } : item)))
  const removeItem = (index) => setItems((list) => list.filter((_, i) => i !== index))

  function requestSave(event) {
    event.preventDefault()
    const nextErrors = validate(values, items)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setFailure('Revisa los campos marcados antes de continuar.')
      const first = Object.keys(nextErrors)[0]
      if (first.startsWith('client_')) setClientMode('manual')
      requestAnimationFrame(() => document.querySelector(`[name="${first}"], #qe-${first}`)?.focus())
      return
    }
    setConfirming(true)
  }

  async function save() {
    setBusy(true)
    setFailure('')
    const payload = {
      ...Object.fromEntries(Object.entries(values).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])),
      client_contact: legal ? values.client_contact.trim() : '',
      labor_cost: Number(values.labor_cost) || 0,
      validity_days: Number(values.validity_days),
      items: items.map((item) => ({ product: item.product, quantity: item.quantity })),
    }
    try {
      const saved = await saveQuote(id, payload)
      navigate('/admin/cotizaciones', { state: { saved, editing } })
    } catch (error) {
      setConfirming(false)
      setBusy(false)
      const fieldErrors = error.data && typeof error.data === 'object' && !error.data.detail
        ? Object.fromEntries(Object.entries(error.data).map(([key, messages]) => [key, [].concat(messages).map((m) => (typeof m === 'string' ? m : JSON.stringify(m))).join(' ')]))
        : {}
      setErrors(fieldErrors)
      setFailure(Object.keys(fieldErrors).length ? 'Revisa los campos marcados.' : error.message)
    }
  }

  const field = (name, extra = {}) => ({
    id: `qe-${name}`, name, value: values[name], onChange: change, className: inputClass,
    'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `qe-${name}-error` : undefined, ...extra,
  })

  if (load.status === 'loading') {
    return <div className="space-y-4" role="status" aria-label="Cargando">{[0, 1, 2].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-white" />)}</div>
  }
  if (load.status === 'error') {
    return (
      <div className="grid place-items-center rounded-2xl border border-[#f3d2cc] bg-[#fff8f6] px-6 py-12 text-center">
        <AlertTriangle size={26} className="mb-3 text-[#c4321c]" />
        <p className="mb-4 text-[14px] text-[#5a5d6c]">{load.error}</p>
        <Link to="/admin/cotizaciones" className={button('outline')}>Volver a cotizaciones</Link>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={requestSave}>
      <Link to="/admin/cotizaciones" className="mb-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[#5a5d6c] hover:text-secundario"><ArrowLeft size={15} /> Cotizaciones</Link>
      <div className="mb-7">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[.16em] text-principal">{editing ? number : 'Nueva cotización'}</p>
        <h1 className="m-0 text-[28px] font-semibold tracking-[-.03em]">{editing ? 'Editar cotización' : 'Cotizar un servicio'}</h1>
        <p className="m-0 mt-1 text-[14px] text-[#6c6f7e]">Datos del cliente, productos del inventario y mano de obra. El IVA (19 %) se suma al final.</p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Card step={1} icon={User} title="Cliente" description={pickedClient ? 'Datos tomados de una cotización anterior; puedes ajustarlos.' : 'Persona natural o jurídica que recibe la cotización.'}
            action={<Segmented label="Origen del cliente" value={clientMode} onChange={setClientMode} options={[{ value: 'manual', label: 'Ingresar datos', icon: User }, { value: 'search', label: 'Buscar cliente', icon: UserSearch }]} />}>
            {clientMode === 'search' ? <ClientFinder onPick={pickClient} /> : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Segmented label="Tipo de cliente" value={values.client_type} onChange={(v) => set('client_type', v)} options={[{ value: 'natural', label: 'Persona natural', icon: User }, { value: 'juridica', label: 'Persona jurídica', icon: Building2 }]} />
                </div>
                <Field id="qe-client_document" label={legal ? 'NIT' : 'Identificación'} required error={errors.client_document}><input {...field('client_document')} maxLength={30} placeholder={legal ? '900 123 456-7' : 'Cédula de ciudadanía'} autoComplete="off" /></Field>
                <Field id="qe-client_name" label={legal ? 'Razón social' : 'Nombre completo'} required error={errors.client_name}><input {...field('client_name')} maxLength={200} placeholder={legal ? 'Empresa S.A.S.' : 'Nombre y apellidos'} /></Field>
                <Field id="qe-client_email" label="Correo" error={errors.client_email}><input {...field('client_email')} type="email" maxLength={254} placeholder="cliente@correo.com" /></Field>
                <Field id="qe-client_phone" label="Celular" error={errors.client_phone}><input {...field('client_phone')} type="tel" maxLength={30} placeholder="+57 300 000 0000" /></Field>
                {legal && <Field id="qe-client_contact" label="Persona de contacto" hint="Opcional" error={errors.client_contact}><input {...field('client_contact')} maxLength={150} placeholder="Nombre y cargo" /></Field>}
                <Field id="qe-client_address" label="Dirección" hint="Opcional" error={errors.client_address} className={legal ? '' : 'sm:col-span-2'}><input {...field('client_address')} maxLength={200} placeholder="Ciudad, dirección" /></Field>
              </div>
            )}
          </Card>

          <Card step={2} icon={FileCheck2} title="Asunto" description="Describe el servicio o suministro que se cotiza.">
            <Field id="qe-subject" label="Asunto" required error={errors.subject}><input {...field('subject')} maxLength={255} placeholder="Suministro e instalación de tablero de control…" /></Field>
          </Card>

          <Card step={3} icon={PackagePlus} title="Productos" description="Precios del inventario; solo ajustas la cantidad.">
            <ProductPicker products={products} items={items} onAdd={addProduct} />
            {errors.items && <p id="qe-items" tabIndex={-1} className="mb-0 mt-2 text-[12px] text-[#c4321c]">{errors.items}</p>}
            {items.length === 0 ? (
              <p className="m-0 mt-4 rounded-xl border border-dashed border-[#dcdde8] p-6 text-center text-[13px] text-[#7a7d8c]">Busca y agrega los productos que incluye la cotización.</p>
            ) : (
              <ul className="m-0 mt-4 list-none divide-y divide-[#f0f1f6] rounded-xl border border-[#eceef4] p-0">
                {items.map((item, index) => {
                  const overStock = item.stock != null && item.quantity > item.stock
                  return (
                    <li key={item.product ?? `deleted-${index}`} className="grid gap-3 p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] sm:items-center">
                      <span className="hidden size-12 overflow-hidden rounded-lg bg-[#eef0f6] sm:block"><ProductArt type={item.image || fallbackImage(item.name, item.category)} /></span>
                      <div className="min-w-0">
                        <p className="m-0 truncate text-[13px] font-semibold">{item.name}</p>
                        <p className="m-0 text-[12px] text-[#8a8d9c]">{item.code} · {formatPrice(Number(item.unit_price))} / {item.unit}</p>
                        {!item.product && <p className="m-0 text-[12px] text-[#c4321c]">Este producto se eliminó del inventario.</p>}
                        {overStock && <p className="m-0 mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-principal"><AlertTriangle size={12} /> Supera el stock disponible ({item.stock})</p>}
                      </div>
                      <div className="flex items-center rounded-lg border border-[#dcdde8]" role="group" aria-label={`Cantidad de ${item.name}`}>
                        <button type="button" onClick={() => setQuantity(index, item.quantity - 1)} className="grid size-9 place-items-center text-[#5a5d6c] hover:text-secundario disabled:opacity-40" disabled={item.quantity <= 1} aria-label="Restar uno"><Minus size={14} /></button>
                        <input type="number" min={1} value={item.quantity} onChange={(e) => setQuantity(index, Number.parseInt(e.target.value, 10))} className="w-14 border-x border-[#dcdde8] bg-white py-2 text-center text-[13px] font-semibold outline-none" aria-label="Cantidad" />
                        <button type="button" onClick={() => setQuantity(index, item.quantity + 1)} className="grid size-9 place-items-center text-[#5a5d6c] hover:text-secundario" aria-label="Sumar uno"><Plus size={14} /></button>
                      </div>
                      <p className="m-0 min-w-28 text-right text-[14px] font-semibold tabular-nums">{formatPrice(Number(item.unit_price) * item.quantity)}</p>
                      <button type="button" onClick={() => removeItem(index)} className="grid size-9 place-items-center justify-self-end rounded-lg text-[#8a8d9c] hover:bg-[#fdecea] hover:text-[#c4321c]" aria-label={`Quitar ${item.name}`}><Trash2 size={16} /></button>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>

          <Card step={4} icon={Wrench} title="Mano de obra" description="Valor variable que defines en cada cotización.">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
              <Field id="qe-labor_description" label="Descripción" hint="Opcional" error={errors.labor_description}><input {...field('labor_description')} maxLength={255} placeholder="Montaje, cableado, pruebas y puesta en marcha" /></Field>
              <Field id="qe-labor_cost" label="Valor" required error={errors.labor_cost}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#8a8d9c]">$</span>
                  <input {...field('labor_cost')} type="number" min={0} step="any" inputMode="decimal" placeholder="0" className={cx(inputClass, 'pl-7')} />
                </div>
              </Field>
            </div>
          </Card>

          <Card step={5} icon={FileCheck2} title="Condiciones" description="Aparecen en el PDF junto al total.">
            <div className="grid gap-4 sm:grid-cols-2">
              <ChoiceField id="qe-delivery_time" label="Tiempo de entrega" options={DELIVERY_OPTIONS} value={values.delivery_time} onChange={(v) => set('delivery_time', v)} error={errors.delivery_time} placeholder="Ej.: 20 días hábiles tras el anticipo" />
              <ChoiceField id="qe-payment_terms" label="Tiempo de pago" options={PAYMENT_OPTIONS} value={values.payment_terms} onChange={(v) => set('payment_terms', v)} error={errors.payment_terms} placeholder="Ej.: 40 % anticipo, saldo a 30 días" />
              <Field id="qe-validity_days" label="Validez de la oferta" hint="Días" required error={errors.validity_days}><input {...field('validity_days')} type="number" min={1} max={365} inputMode="numeric" /></Field>
              <Field id="qe-notes" label="Observaciones" hint="Opcional" error={errors.notes} className="sm:col-span-2"><textarea {...field('notes')} rows={3} className={cx(inputClass, 'resize-y')} placeholder="Qué incluye y qué no incluye la oferta…" /></Field>
            </div>
          </Card>
        </div>

        <aside className="xl:sticky xl:top-6">
          <div className="overflow-hidden rounded-2xl border border-[#e6e7ef] bg-white">
            <div className="bg-[#1c2060] px-5 py-4 text-white">
              <p className="m-0 text-[11px] font-bold uppercase tracking-[.16em] text-[#ffb08f]">Resumen</p>
              <p className="m-0 mt-1 truncate text-[15px] font-semibold">{values.client_name || 'Cliente sin definir'}</p>
              <p className="m-0 truncate text-[12px] text-[#b7baf0]">{values.subject || 'Sin asunto'}</p>
            </div>
            <dl className="m-0 space-y-2.5 px-5 py-4 text-[13px]">
              <div className="flex justify-between gap-3"><dt className="text-[#7a7d8c]">Productos ({items.reduce((n, item) => n + item.quantity, 0)} und.)</dt><dd className="m-0 tabular-nums">{formatPrice(totals.products)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[#7a7d8c]">Mano de obra</dt><dd className="m-0 tabular-nums">{formatPrice(totals.labor)}</dd></div>
              <div className="flex justify-between gap-3 border-t border-[#f0f1f6] pt-2.5 font-semibold"><dt>Subtotal</dt><dd className="m-0 tabular-nums">{formatPrice(totals.subtotal)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[#7a7d8c]">IVA 19 %</dt><dd className="m-0 tabular-nums">{formatPrice(totals.iva)}</dd></div>
            </dl>
            <div className="mx-5 mb-5 flex items-end justify-between rounded-xl bg-[#fff6f1] px-4 py-3">
              <span className="text-[12px] font-bold uppercase tracking-[.12em] text-principal">Total</span>
              <span className="text-[24px] font-semibold tracking-[-.02em] tabular-nums">{formatPrice(totals.total)}</span>
            </div>
            <div className="border-t border-[#f0f1f6] p-5">
              {failure && <p className="mb-3 flex items-start gap-2 text-[12px] text-[#c4321c]" role="alert"><X size={14} className="mt-0.5 shrink-0" /> {failure}</p>}
              <button type="submit" className={button('primary', 'w-full py-3')}><FileCheck2 size={17} /> {editing ? 'Guardar cambios' : 'Crear cotización'}</button>
              <p className="m-0 mt-3 text-center text-[11px] text-[#8a8d9c]">Se genera el PDF con el logo y los datos de SIEV.</p>
            </div>
          </div>
        </aside>
      </div>

      {confirming && <ConfirmCreate values={values} totals={totals} items={items} editing={editing} busy={busy} onConfirm={save} onCancel={() => setConfirming(false)} />}
    </form>
  )
}
