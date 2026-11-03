const currency = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

export const formatPrice = (value) => currency.format(value).replace(/ /g, ' ')

export const formatDate = (iso, options = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Intl.DateTimeFormat('es-CO', options).format(new Date(iso))

export const plural = (count, singular, pluralForm = `${singular}s`) => `${count} ${count === 1 ? singular : pluralForm}`

export function installments(price, months = 12) {
  return Math.ceil(price / months / 100) * 100
}

export function deliveryEstimate(method = 'estandar') {
  const add = method === 'express' ? 1 : method === 'tienda' ? 0 : 3
  const date = new Date()
  let added = 0
  while (added < add) {
    date.setDate(date.getDate() + 1)
    if (date.getDay() !== 0) added++
  }
  if (method === 'tienda') return 'Hoy desde las 4:00 p. m.'
  const text = formatDate(date.toISOString(), { weekday: 'long', day: 'numeric', month: 'long' })
  return text.charAt(0).toUpperCase() + text.slice(1)
}
