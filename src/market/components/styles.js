// Clases reutilizables (misma línea visual de la landing: esquinas rectas, eyebrows en mayúscula).
export const cx = (...classes) => classes.filter(Boolean).join(' ')

export const btn = {
  base: 'inline-flex items-center justify-center gap-2.5 px-5 py-3 text-[13px] font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50',
  primary: 'bg-principal text-white hover:bg-[#c94c17] active:translate-y-px',
  secondary: 'bg-secundario text-white hover:bg-[#232968] active:translate-y-px',
  outline: 'border border-secundario text-secundario hover:bg-secundario hover:text-white',
  ghost: 'text-secundario hover:bg-[#f0f0f6]',
  subtle: 'border border-[#dddfe5] bg-white text-[#222630] hover:border-secundario hover:text-secundario',
}
export const button = (variant = 'primary', extra = '') => cx(btn.base, btn[variant], extra)

export const inputClass = 'block w-full min-w-0 border border-[#dddfe5] bg-[#fafafa] px-3 py-2.5 text-[13px] text-[#222630] outline-none transition placeholder:text-[#9a9ca5] focus:border-secundario focus:bg-white aria-[invalid=true]:border-[#b42318]'
