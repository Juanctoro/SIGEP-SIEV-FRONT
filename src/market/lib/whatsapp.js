import { company } from '../../data/institutional'
import { formatPrice } from './format'

// El número de WhatsApp de la tienda es el mismo de la landing (src/data/institutional.js).
export const storeWhatsapp = company.whatsapp
export const storePhone = company.phone
export const storeAddress = company.location

export const deliveryLabels = {
  domicilio: 'Envío a domicilio',
  tienda: 'Recoger en el punto de venta',
}

export const paymentLabels = {
  transferencia: 'Transferencia bancaria / Nequi',
  efectivo: 'Efectivo al recibir',
  tarjeta: 'Tarjeta en el punto de venta',
  asesor: 'Que me asesoren',
}

export function whatsappUrl(text) {
  return `https://wa.me/${storeWhatsapp}?text=${encodeURIComponent(text)}`
}

/** Mensaje con el pedido completo que el cliente envía a la tienda. */
export function buildOrderMessage(order) {
  const { customer, items, totals } = order
  const lines = items.map((item, i) => {
    const variant = [item.color, item.option].filter(Boolean).join(', ')
    return `${i + 1}. ${item.name}${variant ? ` (${variant})` : ''} x${item.qty}: ${formatPrice(item.unitPrice * item.qty)}`
  })

  const delivery = customer.delivery === 'domicilio'
    ? [`*Entrega:* ${deliveryLabels.domicilio}`, `*Dirección:* ${customer.address}${customer.details ? `, ${customer.details}` : ''}, ${customer.city}`]
    : [`*Entrega:* ${deliveryLabels.tienda}`]

  return [
    `Hola, soy *${customer.name}* y quiero hacer este pedido en la tienda SIEV:`,
    '',
    ...lines,
    '',
    `*Total estimado:* ${formatPrice(totals.subtotal)}`,
    '',
    ...delivery,
    `*Forma de pago:* ${paymentLabels[customer.payment]}`,
    customer.phone && `*Celular:* ${customer.phone}`,
    customer.notes && `*Notas:* ${customer.notes}`,
    '',
    `Pedido ${order.id}. Quedo atento a la confirmación. ¡Gracias!`,
  ].filter((line) => typeof line === 'string').join('\n')
}

/** Mensaje corto para preguntar por un producto desde su ficha. */
export function buildProductQuestion(product, { color, option } = {}) {
  const variant = [color, option].filter(Boolean).join(', ')
  return `Hola, quiero información sobre *${product.name}*${variant ? ` (${variant})` : ''} de ${product.brand}, referencia ${product.sku}. ¿Está disponible?`
}
