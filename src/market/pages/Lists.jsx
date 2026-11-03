import { useState } from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router'
import { FolderHeart, Heart, Pencil, Plus, Share2, ShoppingCart, Trash2, X } from 'lucide-react'
import ProductArt from '../components/ProductArt'
import { Breadcrumbs, Dialog, EmptyState, Price, Rating } from '../components/ui'
import { button, cx, inputClass } from '../components/styles'
import { useStore } from '../context/StoreContext'
import { getProductsByIds } from '../services/catalogService'
import { formatDate, formatPrice, plural } from '../lib/format'
import { paths } from '../routes'

function NameDialog({ open, onClose, initial = '', title, confirm, onSubmit, existing }) {
  const [name, setName] = useState(initial)
  const [error, setError] = useState('')
  function submit(e) {
    e.preventDefault()
    const clean = name.trim()
    if (clean.length < 2) return setError('El nombre debe tener al menos 2 caracteres.')
    if (existing.some((n) => n.toLowerCase() === clean.toLowerCase() && n.toLowerCase() !== initial.toLowerCase())) return setError('Ya tienes una lista con ese nombre.')
    onSubmit(clean)
    onClose()
  }
  return (
    <Dialog open={open} onClose={onClose} title={title} labelledBy="name-dialog-title">
      <form onSubmit={submit} noValidate>
        <label htmlFor="list-name" className="mb-1.5 block text-[12px] font-semibold">Nombre de la lista</label>
        <input id="list-name" autoFocus value={name} maxLength={40} onChange={(e) => { setName(e.target.value); setError('') }} className={inputClass} aria-invalid={!!error} placeholder="Ej.: Setup de oficina" />
        {error && <p className="mt-1.5 text-[12px] text-[#b42318]">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className={button('ghost')}>Cancelar</button>
          <button type="submit" className={button('secondary')}>{confirm}</button>
        </div>
      </form>
    </Dialog>
  )
}

export default function Lists() {
  const { listId = 'favoritos' } = useParams()
  const navigate = useNavigate()
  const { lists, createList, renameList, deleteList, toggleInList, addToCart, notify } = useStore()
  const [dialog, setDialog] = useState(null) // 'create' | 'rename' | 'delete'
  const list = lists.find((l) => l.id === listId)
  const items = list ? getProductsByIds(list.items.map((i) => i.productId)) : []
  const available = items.filter((p) => p.stock > 0)
  const value = items.reduce((sum, p) => sum + p.price, 0)
  const names = lists.map((l) => l.name)

  function addAll() {
    available.forEach((p) => addToCart(p, { silent: true }))
    notify(`${plural(available.length, 'producto agregado', 'productos agregados')} al carrito.`)
  }

  async function share() {
    const url = window.location.href
    try { await navigator.clipboard.writeText(url); notify('Enlace de la lista copiado.') } catch { notify('No se pudo copiar el enlace.', { tone: 'warning' }) }
  }

  return (
    <div className="w-full px-5 lg:px-10 2xl:px-14 py-8">
      <Breadcrumbs items={[{ label: 'Inicio', to: paths.home }, { label: 'Mis listas', to: paths.lists }, list && list.id !== 'favoritos' ? { label: list.name } : null].filter(Boolean)} />
      <h1 className="mb-8 text-[clamp(28px,3.2vw,42px)] font-semibold tracking-[-.045em]">Mis listas</h1>

      <div className="grid items-start gap-8 lg:grid-cols-[280px_1fr]">
        <aside aria-label="Listas guardadas" className="border border-[#e6e6eb] bg-white">
          <nav className="flex gap-1 overflow-x-auto p-2 lg:flex-col">
            {lists.map((l) => (
              <NavLink key={l.id} to={paths.list(l.id)} className={({ isActive }) => cx('flex shrink-0 items-center gap-3 px-3 py-3 text-[14px] transition', isActive || (l.id === 'favoritos' && listId === 'favoritos') ? 'bg-[#f0f0f8] font-semibold text-secundario' : 'hover:bg-[#f7f7fa]')}>
                {l.id === 'favoritos' ? <Heart size={16} className="text-principal" fill="currentColor" /> : <FolderHeart size={16} className="text-[#73757d]" />}
                <span className="flex-1 truncate">{l.name}</span>
                <span className="text-[12px] font-normal text-[#73757d]">{l.items.length}</span>
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-[#eeeef2] p-3">
            <button type="button" onClick={() => setDialog('create')} className={button('outline', 'w-full py-2.5')}><Plus size={15} /> Nueva lista</button>
          </div>
        </aside>

        {!list ? (
          <EmptyState icon={FolderHeart} title="Esta lista no existe" action={<Link to={paths.lists} className={button('primary')}>Ver mis listas</Link>}>Es posible que la hayas eliminado.</EmptyState>
        ) : (
          <section aria-labelledby="list-title">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-[#e2e2e8] pb-5">
              <div>
                <h2 id="list-title" className="mb-1 text-[24px] font-semibold tracking-[-.03em]">{list.name}</h2>
                <p className="m-0 text-[13px] text-[#626570]">{plural(items.length, 'producto')}{items.length > 0 && ` · Valor total ${formatPrice(value)}`}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {!list.locked && <>
                  <button type="button" onClick={() => setDialog('rename')} className={button('subtle', 'px-3 py-2')}><Pencil size={14} /> Renombrar</button>
                  <button type="button" onClick={() => setDialog('delete')} className={button('subtle', 'px-3 py-2 hover:!border-[#b42318] hover:!text-[#b42318]')}><Trash2 size={14} /> Eliminar</button>
                </>}
                <button type="button" onClick={share} className={button('subtle', 'px-3 py-2')}><Share2 size={14} /> Compartir</button>
                {available.length > 0 && <button type="button" onClick={addAll} className={button('secondary', 'px-4 py-2')}><ShoppingCart size={14} /> Agregar todo al carrito</button>}
              </div>
            </div>

            {items.length === 0 ? (
              <EmptyState icon={Heart} title="Esta lista está vacía" action={<Link to={paths.catalog()} className={button('primary')}>Explorar productos</Link>}>
                Toca el corazón o “Añadir a una lista” en cualquier producto para guardarlo aquí.
              </EmptyState>
            ) : (
              <ul className="grid gap-3">
                {items.map((p) => {
                  const entry = list.items.find((i) => i.productId === p.id)
                  return (
                    <li key={p.id} className="grid grid-cols-[110px_1fr] gap-4 border border-[#e6e6eb] bg-white p-4 sm:grid-cols-[150px_1fr_auto] sm:items-center">
                      <Link to={paths.product(p.slug)} className="aspect-[4/3] bg-[#f3f3f0]"><ProductArt type={p.art} color={p.colors[0].hex} /></Link>
                      <div className="min-w-0">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.15em] text-principal">{p.brand}</p>
                        <Link to={paths.product(p.slug)} className="text-[15px] font-semibold leading-snug hover:text-secundario">{p.name}</Link>
                        <div className="my-1.5"><Rating value={p.rating} count={p.reviews} size={12} /></div>
                        <Price price={p.price} oldPrice={p.oldPrice} size="sm" />
                        <p className={cx('mt-1 text-[12px]', p.stock ? 'text-[#20592b]' : 'text-[#b42318]')}>{p.stock ? 'Disponible' : 'Agotado'} · Guardado el {formatDate(new Date(entry.addedAt).toISOString(), { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <div className="col-span-2 flex gap-2 sm:col-span-1 sm:flex-col">
                        <button type="button" disabled={!p.stock} onClick={() => addToCart(p)} className={button('secondary', 'flex-1 px-4 py-2.5')}><ShoppingCart size={14} /> Agregar</button>
                        <button type="button" onClick={() => toggleInList(list.id, p)} className={button('subtle', 'px-4 py-2.5')} aria-label={`Quitar ${p.name} de la lista`}><X size={14} /> Quitar</button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )}
      </div>

      {dialog === 'create' && <NameDialog open onClose={() => setDialog(null)} title="Nueva lista" confirm="Crear lista" existing={names} onSubmit={(name) => navigate(paths.list(createList(name)))} />}
      {dialog === 'rename' && list && <NameDialog open onClose={() => setDialog(null)} title="Renombrar lista" confirm="Guardar" initial={list.name} existing={names} onSubmit={(name) => renameList(list.id, name)} />}
      <Dialog open={dialog === 'delete'} onClose={() => setDialog(null)} title="¿Eliminar esta lista?" labelledBy="delete-list-title">
        <p className="mb-6 text-[14px] text-[#626570]">Se eliminará “{list?.name}” con sus {plural(list?.items.length ?? 0, 'producto')}. Los productos seguirán disponibles en la tienda.</p>
        <div className="flex justify-end gap-2">
          <button type="button" autoFocus onClick={() => setDialog(null)} className={button('ghost')}>Cancelar</button>
          <button type="button" onClick={() => { deleteList(list.id); setDialog(null); navigate(paths.lists) }} className={button('primary')}>Eliminar lista</button>
        </div>
      </Dialog>
    </div>
  )
}
