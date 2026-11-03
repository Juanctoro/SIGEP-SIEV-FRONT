// Reseñas de demostración generadas de forma determinista a partir del id del producto.

const names = ['Laura M.', 'Andrés G.', 'Camila R.', 'Juan P.', 'Valentina S.', 'Santiago L.', 'Daniela C.', 'Felipe O.', 'Mariana T.', 'Carlos V.', 'Natalia H.', 'Sebastián A.', 'Paula Q.', 'Julián E.']
const cities = ['Cali', 'Bogotá', 'Medellín', 'Palmira', 'Barranquilla', 'Pereira', 'Tuluá']

const templates = {
  5: [
    ['Excelente compra', 'Llegó antes de lo esperado y en perfecto estado. Funciona de maravilla, totalmente recomendado.'],
    ['Superó mis expectativas', 'La calidad es muy buena para el precio. El empaque venía sellado y con factura.'],
    ['Muy satisfecho', 'Lo uso todos los días y no he tenido ningún problema. La atención por WhatsApp fue rápida.'],
  ],
  4: [
    ['Muy bueno', 'Cumple con lo que promete. Le quito una estrella porque la entrega tardó un día más.'],
    ['Buena relación calidad-precio', 'Buen producto, aunque el manual podría ser más claro. Lo volvería a comprar.'],
  ],
  3: [
    ['Cumple', 'Está bien para el uso básico. Esperaba un poco más en algunos detalles de acabado.'],
  ],
}

function seeded(seed) {
  let value = [...seed].reduce((acc, char) => acc * 31 + char.charCodeAt(0), 7) % 2147483647
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

export function generateReviews(product) {
  const random = seeded(product.id)
  const count = 5
  const reviews = []
  for (let i = 0; i < count; i++) {
    const roll = random()
    const rating = product.rating >= 4.7 ? (roll < 0.8 ? 5 : 4) : roll < 0.55 ? 5 : roll < 0.9 ? 4 : 3
    const pool = templates[rating]
    const [title, body] = pool[Math.floor(random() * pool.length)]
    const daysAgo = Math.floor(random() * 120) + 2
    reviews.push({
      id: `${product.id}-r${i}`,
      author: names[Math.floor(random() * names.length)],
      city: cities[Math.floor(random() * cities.length)],
      rating,
      title,
      body,
      date: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      verified: random() > 0.2,
      helpful: Math.floor(random() * 40),
    })
  }
  return reviews.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function ratingDistribution(product) {
  // Distribución aproximada coherente con el promedio y el total de reseñas.
  const r = product.rating
  const weights = r >= 4.7 ? [0.82, 0.13, 0.03, 0.01, 0.01] : r >= 4.4 ? [0.64, 0.24, 0.07, 0.03, 0.02] : [0.5, 0.28, 0.12, 0.06, 0.04]
  return [5, 4, 3, 2, 1].map((stars, index) => ({ stars, count: Math.round(product.reviews * weights[index]) }))
}
