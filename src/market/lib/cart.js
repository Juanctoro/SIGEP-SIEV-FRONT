export const lineKey = (productId, color, option) => [productId, color ?? '', option ?? ''].join('|')

// Precio de un producto según la opción elegida (p. ej. almacenamiento).
export function priceFor(product, optionLabel) {
  const delta = product.options?.values.find((v) => v.label === optionLabel)?.priceDelta ?? 0
  return { price: product.price + delta, oldPrice: product.oldPrice ? product.oldPrice + delta : null }
}
