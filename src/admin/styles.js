// Clases compartidas del panel de administración.

export const cx = (...classes) => classes.filter(Boolean).join(' ')

const buttonTones = {
  primary: 'bg-principal text-white hover:bg-[#c94c17] disabled:bg-[#e9a283]',
  secondary: 'bg-secundario text-white hover:bg-[#232970]',
  outline: 'border border-[#dcdde8] bg-white text-[#1f2230] hover:border-secundario hover:text-secundario',
  ghost: 'text-[#4a4d5c] hover:bg-[#eef0f7]',
  danger: 'bg-[#c4321c] text-white hover:bg-[#a52815]',
}

export const button = (tone = 'primary', extra = '') =>
  cx('inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition disabled:cursor-not-allowed', buttonTones[tone], extra)

export const inputClass = 'w-full rounded-lg border border-[#dcdde8] bg-white px-3 py-2.5 text-[14px] text-[#1f2230] outline-none transition placeholder:text-[#a3a6b5] focus:border-secundario focus:ring-4 focus:ring-secundario/10 aria-[invalid=true]:border-[#c4321c] aria-[invalid=true]:ring-[#c4321c]/10'
