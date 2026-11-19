import { useEffect, useMemo, useRef, useState } from 'react'
import { ImagePlus, Trash2, Upload, X } from 'lucide-react'
import ProductArt from '../../market/components/ProductArt'
import { fallbackImage } from '../../market/data/fallbackImages'
import { formatPrice } from '../../market/lib/format'
import { Badge, Field } from '../ui'
import { button, cx, inputClass } from '../styles'
import { computeMetrics, saveProduct } from './productsApi'

const EMPTY = {
  code: '', name: '', category: '', brand: '', reference: '', unit: 'Unidad',
  stock: 0, min_stock: 0, unit_cost: '', sale_price: '',
  location: '', supplier: 'Por definir', description: '', is_published: true,
}
const DEFAULT_UNITS = ['Unidad', 'Par', 'Rollo', 'Rollo 100 m', 'Metro', 'Tramo', 'Caja', 'Juego']
const MAX_IMAGE_MB = 5

function initialValues(product) {
  if (!product) return EMPTY
  return Object.fromEntries(Object.keys(EMPTY).map((key) => {
    const value = product[key] ?? EMPTY[key]
    // El API entrega decimales como texto ("265000.00"); en el formulario se editan como número.
    return [key, key === 'unit_cost' || key === 'sale_price' ? String(Number(value)) : value]
  }))
}

function validate(values) {
  const errors = {}
  for (const [key, label] of [['code', 'el código'], ['name', 'el nombre'], ['category', 'la categoría'], ['brand', 'la marca'], ['unit', 'la unidad']]) {
    if (!String(values[key]).trim()) errors[key] = `Escribe ${label}.`
  }
  for (const key of ['stock', 'min_stock']) {
    if (!Number.isInteger(Number(values[key])) || Number(values[key]) < 0) errors[key] = 'Usa un número entero mayor o igual a 0.'
  }
  for (const key of ['unit_cost', 'sale_price']) {
    if (values[key] === '' || Number.isNaN(Number(values[key])) || Number(values[key]) < 0) errors[key] = 'Escribe un valor mayor o igual a 0.'
  }
  return errors
}

function Section({ title, description, children }) {
  return (
    <section className="border-b border-[#eceef4] px-6 py-6 last:border-0">
      <h3 className="mb-1 text-[14px] font-semibold">{title}</h3>
      {description && <p className="mb-4 text-[12px] text-[#7a7d8c]">{description}</p>}
      <div className={cx('grid gap-4 sm:grid-cols-2', !description && 'mt-4')}>{children}</div>
    </section>
  )
}

function ImagePicker({ product, values, file, onFile, removed, onRemove }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const current = preview ?? (!removed && product?.image) ?? null
  const fallback = fallbackImage(values.name, values.category)

  function pick(selected) {
    setError('')
    if (!selected) return
    if (!selected.type.startsWith('image/')) return setError('El archivo debe ser una imagen (JPG, PNG o WebP).')
    if (selected.size > MAX_IMAGE_MB * 1024 * 1024) return setError(`La imagen supera ${MAX_IMAGE_MB} MB.`)
    onFile(selected)
  }

  return (
    <div className="sm:col-span-2">
      <div
        onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); pick(event.dataTransfer.files?.[0]) }}
        className={cx('grid gap-4 rounded-xl border-2 border-dashed p-3 transition sm:grid-cols-[200px_1fr]', dragging ? 'border-principal bg-[#fff6f1]' : 'border-[#dcdde8] bg-[#fafbfd]')}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#eef0f6]">
          <ProductArt type={current ?? fallback} label="Vista previa de la imagen" />
          {!current && <span className="absolute inset-x-2 bottom-2 rounded-md bg-[#1f2230]/75 px-2 py-1 text-center text-[10px] font-semibold text-white">Imagen genérica de respaldo</span>}
        </div>
        <div className="flex flex-col justify-center gap-3 py-1">
          <div>
            <p className="m-0 text-[13px] font-semibold">{current ? 'Imagen del producto' : 'Sin imagen propia'}</p>
            <p className="m-0 mt-1 text-[12px] leading-relaxed text-[#7a7d8c]">
              Arrastra una foto aquí o elígela desde tu equipo. JPG, PNG o WebP, hasta {MAX_IMAGE_MB} MB.
              {!current && ' Mientras tanto la tienda muestra una imagen pública según el tipo de producto.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className={button('outline', 'py-2')}>{current ? <Upload size={15} /> : <ImagePlus size={15} />} {current ? 'Cambiar imagen' : 'Subir imagen'}</button>
            {current && <button type="button" onClick={() => { onFile(null); onRemove(Boolean(product?.image)) }} className={button('ghost', 'py-2 text-[#c4321c] hover:bg-[#fdecea]')}><Trash2 size={15} /> Quitar</button>}
          </div>
          {error && <p className="m-0 text-[12px] text-[#c4321c]" role="alert">{error}</p>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-label="Seleccionar imagen del producto" onChange={(event) => { pick(event.target.files?.[0]); event.target.value = '' }} />
    </div>
  )
}

export default function ProductDrawer({ product, suggestions, onClose, onSaved }) {
  const editing = Boolean(product)
  const [values, setValues] = useState(() => initialValues(product))
  const [errors, setErrors] = useState({})
  const [failure, setFailure] = useState('')
  const [busy, setBusy] = useState(false)
  const [image, setImage] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const firstRef = useRef(null)
  const metrics = computeMetrics(values)

  // Al abrir: foco en el primer campo y bloqueo del scroll de la página de fondo.
  useEffect(() => {
    firstRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow }
  }, [])

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape' && !busy) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onClose])

  function change(event) {
    const { name, value, type, checked } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFailure('')
  }

  async function submit(event) {
    event.preventDefault()
    if (busy) return
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      event.currentTarget.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus()
      return
    }
    setBusy(true)
    setFailure('')
    try {
      const saved = await saveProduct(product?.id, values, { image, removeImage })
      onSaved(saved, editing)
    } catch (error) {
      // Errores por campo del backend (p. ej. código repetido) junto al campo correspondiente.
      const fieldErrors = error.data && typeof error.data === 'object' && !error.data.detail
        ? Object.fromEntries(Object.entries(error.data).map(([key, messages]) => [key, [].concat(messages).join(' ')]))
        : {}
      setErrors(fieldErrors)
      setFailure(Object.keys(fieldErrors).length ? 'Revisa los campos marcados.' : error.message)
      setBusy(false)
    }
  }

  const field = (name, extra = {}) => ({
    id: `pf-${name}`, name, value: values[name], onChange: change, className: inputClass,
    'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `pf-${name}-error` : undefined, ...extra,
  })

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <button type="button" className="adm-fade-in absolute inset-0 bg-[#0d0f2b]/40" onClick={() => !busy && onClose()} aria-label="Cerrar formulario" tabIndex={-1} />
      <form noValidate onSubmit={submit} className="adm-slide-in absolute inset-y-0 right-0 flex w-full max-w-[640px] flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-[#eceef4] px-6 py-5">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[.16em] text-principal">{editing ? `Código ${product.code}` : 'Nuevo producto'}</p>
            <h2 id="drawer-title" className="m-0 truncate text-[20px] font-semibold tracking-[-.02em]">{editing ? product.name : 'Agregar al inventario'}</h2>
          </div>
          <button type="button" onClick={onClose} disabled={busy} className="grid size-9 shrink-0 place-items-center rounded-lg text-[#5a5d6c] hover:bg-[#f0f1f7]" aria-label="Cerrar"><X size={18} /></button>
        </header>

        <fieldset disabled={busy} className="m-0 min-w-0 flex-1 overflow-y-auto border-0 p-0">
          <Section title="Información general">
            <Field id="pf-code" label="Código" required error={errors.code}><input ref={firstRef} {...field('code')} maxLength={30} placeholder="1000001" autoComplete="off" /></Field>
            <Field id="pf-reference" label="Referencia" error={errors.reference}><input {...field('reference')} maxLength={150} placeholder="LC1D25M7" autoComplete="off" /></Field>
            <Field id="pf-name" label="Producto" required error={errors.name} className="sm:col-span-2"><input {...field('name')} maxLength={200} placeholder="Contactor 3P 25 A bobina 220 VAC" /></Field>
            <Field id="pf-category" label="Categoría" required error={errors.category}><input {...field('category')} list="pf-categories" maxLength={100} placeholder="Control y protección" autoComplete="off" /></Field>
            <Field id="pf-brand" label="Marca" required error={errors.brand}><input {...field('brand')} list="pf-brands" maxLength={100} placeholder="Schneider Electric" autoComplete="off" /></Field>
            <Field id="pf-description" label="Descripción" hint="Se muestra en la tienda" error={errors.description} className="sm:col-span-2"><textarea {...field('description')} rows={3} className={cx(inputClass, 'resize-y')} placeholder="Características técnicas principales…" /></Field>
          </Section>

          <Section title="Imagen" description="La foto que verán los clientes en la tienda.">
            <ImagePicker product={product} values={values} file={image} onFile={(file) => { setImage(file); if (file) setRemoveImage(false) }} removed={removeImage} onRemove={setRemoveImage} />
          </Section>

          <Section title="Inventario" description="El estado pasa a «Reponer» cuando el stock llega al mínimo.">
            <Field id="pf-stock" label="Stock" required error={errors.stock}><input {...field('stock')} type="number" min={0} step={1} inputMode="numeric" /></Field>
            <Field id="pf-min_stock" label="Stock mínimo" required error={errors.min_stock}><input {...field('min_stock')} type="number" min={0} step={1} inputMode="numeric" /></Field>
            <Field id="pf-unit" label="Unidad" required error={errors.unit}><input {...field('unit')} list="pf-units" maxLength={50} autoComplete="off" /></Field>
            <Field id="pf-location" label="Ubicación" error={errors.location}><input {...field('location')} list="pf-locations" maxLength={150} placeholder="Bodega – Estante A1" autoComplete="off" /></Field>
            <Field id="pf-supplier" label="Proveedor" error={errors.supplier} className="sm:col-span-2"><input {...field('supplier')} list="pf-suppliers" maxLength={150} autoComplete="off" /></Field>
          </Section>

          <Section title="Precios" description="Valores en pesos colombianos. El margen se calcula sobre el precio de venta.">
            <Field id="pf-unit_cost" label="Costo unitario" required error={errors.unit_cost}><input {...field('unit_cost')} type="number" min={0} step="any" inputMode="decimal" placeholder="0" /></Field>
            <Field id="pf-sale_price" label="Precio de venta" required error={errors.sale_price}><input {...field('sale_price')} type="number" min={0} step="any" inputMode="decimal" placeholder="0" /></Field>
            <dl className="m-0 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-[#eceef4] bg-[#eceef4] sm:col-span-2">
              <div className="bg-[#fafbfd] p-3"><dt className="text-[11px] text-[#7a7d8c]">Margen</dt><dd className={cx('m-0 mt-1 text-[16px] font-semibold', metrics.margin < 0 ? 'text-[#c4321c]' : 'text-[#1f2230]')}>{(metrics.margin * 100).toFixed(1)} %</dd></div>
              <div className="bg-[#fafbfd] p-3"><dt className="text-[11px] text-[#7a7d8c]">Valor inventario</dt><dd className="m-0 mt-1 truncate text-[16px] font-semibold">{formatPrice(metrics.inventoryValue)}</dd></div>
              <div className="bg-[#fafbfd] p-3"><dt className="text-[11px] text-[#7a7d8c]">Estado</dt><dd className="m-0 mt-1"><Badge tone={metrics.status === 'OK' ? 'green' : 'orange'} dot>{metrics.status}</Badge></dd></div>
            </dl>
            {metrics.margin < 0 && <p className="m-0 text-[12px] text-[#c4321c] sm:col-span-2">El precio de venta es menor que el costo.</p>}
          </Section>

          <Section title="Publicación">
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#eceef4] p-4 sm:col-span-2">
              <span>
                <span className="block text-[13px] font-semibold">Visible en la tienda</span>
                <span className="block text-[12px] text-[#7a7d8c]">Si lo desactivas, el producto sigue en el inventario pero no aparece en /tienda.</span>
              </span>
              <input type="checkbox" name="is_published" checked={values.is_published} onChange={change} className="peer sr-only" />
              <span className="relative h-6 w-11 shrink-0 rounded-full bg-[#d4d6e2] transition after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:bg-[#1d8a4a] peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-secundario/20" aria-hidden="true" />
            </label>
          </Section>
        </fieldset>

        <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-[#eceef4] bg-[#fafbfd] px-6 py-4">
          {failure && <p className="m-0 mr-auto text-[13px] text-[#c4321c]" role="alert">{failure}</p>}
          <button type="button" onClick={onClose} disabled={busy} className={button('ghost')}>Cancelar</button>
          <button type="submit" disabled={busy} className={button('primary', 'min-w-36')}>{busy ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear producto'}</button>
        </footer>

        <datalist id="pf-categories">{suggestions.categories.map((v) => <option key={v} value={v} />)}</datalist>
        <datalist id="pf-brands">{suggestions.brands.map((v) => <option key={v} value={v} />)}</datalist>
        <datalist id="pf-units">{[...new Set([...DEFAULT_UNITS, ...suggestions.units])].map((v) => <option key={v} value={v} />)}</datalist>
        <datalist id="pf-locations">{suggestions.locations.map((v) => <option key={v} value={v} />)}</datalist>
        <datalist id="pf-suppliers">{suggestions.suppliers.map((v) => <option key={v} value={v} />)}</datalist>
      </form>
    </div>
  )
}
