import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import ProductArt from './ProductArt'
import { Dialog } from './ui'
import { button, cx, inputClass } from './styles'
import { useStore } from '../context/StoreContext'
import { plural } from '../lib/format'

// Diálogo para añadir un producto a una o varias listas, o crear una lista nueva.
function ListDialogContent({ product, onClose }) {
  const { lists, isInList, toggleInList, createList } = useStore()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    const clean = name.trim()
    if (clean.length < 2) { setError('El nombre debe tener al menos 2 caracteres.'); return }
    if (lists.some((l) => l.name.toLowerCase() === clean.toLowerCase())) { setError('Ya tienes una lista con ese nombre.'); return }
    createList(clean, product)
    setName('')
    setError('')
  }

  return (
    <>
      <div className="mb-5 flex items-center gap-3 bg-[#f6f6f4] p-3">
        <span className="h-12 w-16 shrink-0 bg-white"><ProductArt type={product.art} color={product.colors[0].hex} /></span>
        <p className="m-0 text-[13px] font-semibold leading-snug">{product.name}</p>
      </div>
      <fieldset className="mb-5">
        <legend className="mb-2 text-[11px] font-bold uppercase tracking-[.15em] text-[#73757d]">Tus listas</legend>
        <ul className="max-h-60 divide-y divide-[#eeeef2] overflow-y-auto border border-[#eeeef2]">
          {lists.map((list) => {
            const checked = isInList(list.id, product.id)
            return (
              <li key={list.id}>
                <label className="flex cursor-pointer items-center gap-3 px-3 py-3 hover:bg-[#fafafa]">
                  <input type="checkbox" className="peer sr-only" checked={checked} onChange={() => toggleInList(list.id, product)} />
                  <span className={cx('grid size-5 shrink-0 place-items-center border transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-principal', checked ? 'border-secundario bg-secundario text-white' : 'border-[#c9cbd6] bg-white')}>{checked && <Check size={13} strokeWidth={3} />}</span>
                  <span className="flex-1 text-[14px]">{list.name}</span>
                  <span className="text-[12px] text-[#73757d]">{plural(list.items.length, 'producto')}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>
      <form onSubmit={submit} noValidate>
        <label htmlFor="new-list" className="mb-2 block text-[12px] font-semibold">Crear una lista nueva</label>
        <div className="flex gap-2">
          <input id="new-list" value={name} maxLength={40} onChange={(e) => { setName(e.target.value); setError('') }} placeholder="Ej.: Oficina en casa, Regalos de Navidad" className={inputClass} aria-invalid={!!error} aria-describedby={error ? 'new-list-error' : undefined} />
          <button type="submit" className={button('outline', 'shrink-0 px-4')}><Plus size={15} /> Crear</button>
        </div>
        {error && <p id="new-list-error" className="mt-1.5 text-[12px] text-[#b42318]">{error}</p>}
      </form>
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={onClose} className={button('secondary')}>Listo</button>
      </div>
    </>
  )
}

export default function ListDialog() {
  const { listDialog, closeListDialog } = useStore()
  return (
    <Dialog open={!!listDialog} onClose={closeListDialog} title="Guardar en una lista" labelledBy="list-dialog-title">
      {listDialog && <ListDialogContent key={listDialog.id} product={listDialog} onClose={closeListDialog} />}
    </Dialog>
  )
}
