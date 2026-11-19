import { useRef } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import ProductArt from '../components/ProductArt'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import { BenefitsStrip } from '../components/Footer'
import { Countdown, Eyebrow, Price, SectionHeading } from '../components/ui'
import { button } from '../components/styles'
import { useStore } from '../context/StoreContext'
import { brands, categories, products } from '../data/catalog'
import { getHomeSections, getProductsByIds } from '../services/catalogService'
import { useAsync } from '../lib/useAsync'
import { paths } from '../routes'

const container = 'w-full px-5 lg:px-10 2xl:px-14'
// Destacado: el producto de mayor precio con stock (o el primero si no hay stock).
const pickHero = () => [...products].filter((p) => p.stock > 0).sort((a, b) => b.price - a.price)[0] ?? products[0]

function Hero() {
  const hero = pickHero()
  return (
    <section className="bg-[#fafaf8]">
      <div className={`${container} grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-16`}>
        <div>
          <Eyebrow>Materiales eléctricos</Eyebrow>
          <h1 className="mb-6 text-[clamp(40px,5vw,64px)] font-semibold leading-[1.05] tracking-[-.055em]">
            Todo para tu <span className="text-principal">proyecto</span><br />eléctrico.
          </h1>
          <p className="mb-8 max-w-md text-[16px] leading-[1.75] text-[#61636d]">
            Cables, protección, automatización, iluminación y canalización de marcas reconocidas, con asesoría técnica de SIEV.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to={paths.catalog()} className={button('primary', 'gap-7 px-6 py-4')}>Explorar catálogo <ArrowUpRight size={16} /></Link>
            <Link to={paths.catalog({ oferta: '1', orden: 'descuento' })} className="inline-flex items-center gap-3 text-[13px] font-semibold hover:text-secundario">Ver ofertas del día <ArrowRight size={15} /></Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 border-t border-[#e2e2e8] pt-5">
            {[[`${products.length}+`, 'productos'], [`${brands.length}`, 'marcas'], [`${categories.length}`, 'categorías']].map(([n, l]) => (
              <div key={l}><dt className="sr-only">{l}</dt><dd className="m-0 text-[24px] font-semibold tracking-[-.04em] text-secundario">{n}</dd><span className="text-[11px] text-[#73757d]">{l}</span></div>
            ))}
          </dl>
        </div>

        {hero && <Link to={paths.product(hero.slug)} className="group relative block bg-secundario p-6 text-[#e3e4ff]">
          <div className="flex justify-between text-[9px] tracking-[.16em]"><span>SIEV / DESTACADO DE LA SEMANA</span><span>01 — 04</span></div>
          <div className="my-3 aspect-[4/3] bg-[#f6f6f4] transition duration-500 group-hover:bg-white">
            <ProductArt type={hero.art} color={hero.colors[0].hex} />
          </div>
          <div className="flex items-center gap-4 border-t border-white/20 pt-5">
            <span className="text-[38px] leading-none text-principal" aria-hidden="true">ϟ</span>
            <div className="flex-1">
              <strong className="block text-[15px] font-medium text-white">{hero.brand} {hero.name}</strong>
              <span className="text-[12px] opacity-75">${hero.price.toLocaleString('es-CO')} · {hero.unit}</span>
            </div>
            <ArrowUpRight size={20} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </Link>}
      </div>
    </section>
  )
}

function CategoryGrid() {
  return (
    <section className={`${container} py-16`} aria-labelledby="cat-title">
      <SectionHeading eyebrow="01 / Categorías" title={<span id="cat-title">Encuentra lo que buscas.</span>} action={<Link to={paths.catalog()} className="inline-flex items-center gap-2 text-[13px] font-semibold text-secundario hover:underline">Ver todo el catálogo <ArrowRight size={15} /></Link>} />
      <div className="grid grid-cols-2 border-l border-t border-[#e2e2e8] sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((c, i) => (
          <Link key={c.id} to={paths.category(c.id)} className="group flex flex-col border-b border-r border-[#e2e2e8] bg-white p-4 transition hover:bg-[#f6f6f4]">
            <span className="mb-2 flex justify-between text-[11px] text-principal"><span>{String(i + 1).padStart(2, '0')}</span><ArrowUpRight size={14} className="opacity-0 transition group-hover:opacity-100" /></span>
            <span className="mb-3 aspect-[4/3]"><ProductArt type={c.art} color="#2d3484" /></span>
            <span className="text-[13px] font-semibold leading-snug group-hover:text-secundario">{c.name}</span>
            <span className="text-[11px] text-[#73757d]">{products.filter((p) => p.category === c.id).length} productos</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Carousel({ items }) {
  const ref = useRef(null)
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <div className="relative">
      <div ref={ref} className="mk-scroll-x -mx-5 flex gap-4 overflow-x-auto px-5 pb-4 lg:-mx-10 lg:px-10 2xl:-mx-14 2xl:px-14">
        {items.map((p) => <div key={p.id} className="w-[250px] shrink-0 sm:w-[270px]"><ProductCard product={p} /></div>)}
      </div>
      <div className="mt-2 hidden justify-end gap-2 sm:flex">
        <button type="button" onClick={() => scroll(-1)} aria-label="Ver anteriores" className="grid size-10 place-items-center border border-[#dddfe5] bg-white hover:border-secundario hover:text-secundario"><ChevronLeft size={18} /></button>
        <button type="button" onClick={() => scroll(1)} aria-label="Ver siguientes" className="grid size-10 place-items-center border border-[#dddfe5] bg-white hover:border-secundario hover:text-secundario"><ChevronRight size={18} /></button>
      </div>
    </div>
  )
}

// Dos categorías destacadas; si no existen en el catálogo se usan las dos primeras.
const promos = [
  { id: 'automatizacion', eyebrow: 'Automatización', title: 'Controla tus procesos', text: 'PLC, variadores de frecuencia y módulos lógicos para tableros e industria.', dark: true },
  { id: 'iluminacion', eyebrow: 'Iluminación LED', title: 'Luz eficiente y segura', text: 'Luminarias herméticas y de emergencia para bodegas, plantas y zonas húmedas.', dark: false },
]

function PromoBanners() {
  const items = promos
    .map((promo, i) => ({ ...promo, category: categories.find((c) => c.id === promo.id) ?? categories[i] }))
    .filter((promo) => promo.category)
  if (!items.length) return null
  return (
    <section className={`${container} grid gap-5 py-6 md:grid-cols-2`} aria-label="Categorías destacadas">
      {items.map(({ id, eyebrow, title, text, dark, category }) => (
        <Link key={id} to={paths.category(category.id)} className={`group relative grid min-h-[240px] grid-cols-[1.1fr_1fr] items-center gap-6 overflow-hidden p-7 ${dark ? 'bg-[#222630] text-white' : 'bg-[#f6eee9]'}`}>
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.18em] text-principal">{eyebrow}</p>
            <h3 className={`mb-3 text-[26px] font-semibold leading-tight tracking-[-.04em] ${dark ? '' : 'text-secundario'}`}>{title}</h3>
            <p className={`mb-5 text-[13px] ${dark ? 'text-white/70' : 'text-[#626570]'}`}>{text}</p>
            <span className={`inline-flex items-center gap-2 text-[13px] font-semibold ${dark ? '' : 'text-secundario'}`}>Ver productos <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
          </div>
          <span className="block aspect-[4/3] overflow-hidden"><ProductArt type={category.art} className="transition duration-500 group-hover:scale-105" /></span>
        </Link>
      ))}
    </section>
  )
}

function RecentlyViewed() {
  const { recent } = useStore()
  const items = getProductsByIds(recent).slice(0, 6)
  if (!items.length) return null
  return (
    <section className={`${container} py-12`} aria-labelledby="recent-title">
      <SectionHeading eyebrow="Para ti" title={<span id="recent-title">Vistos recientemente</span>} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((p) => (
          <Link key={p.id} to={paths.product(p.slug)} className="group border border-[#e6e6eb] bg-white p-3 hover:border-secundario">
            <span className="mb-2 block aspect-[4/3] bg-[#f3f3f0]"><ProductArt type={p.art} color={p.colors[0].hex} /></span>
            <span className="line-clamp-2 text-[12px] font-semibold leading-snug group-hover:text-secundario">{p.name}</span>
            <span className="mt-1 block"><Price price={p.price} size="sm" /></span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const { data, loading } = useAsync(() => getHomeSections(), 'home')

  return (
    <>
      <Hero />
      <BenefitsStrip />
      <CategoryGrid />

      {/* Las ofertas aparecen solo cuando algún producto tiene precio anterior. */}
      {(loading || data?.deals.length > 0) && <section className="bg-white py-16" aria-labelledby="deals-title">
        <div className={container}>
          <SectionHeading
            eyebrow="02 / Ofertas del día"
            title={<span id="deals-title" className="inline-flex flex-wrap items-center gap-4"><Zap size={26} className="text-principal" fill="currentColor" /> Precios que se acaban hoy</span>}
            action={<div className="flex items-center gap-3 text-[12px] text-[#626570]">Terminan en <Countdown /></div>}
          />
          {loading ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)}</div> : <Carousel items={data.deals} />}
        </div>
      </section>}

      <PromoBanners />

      <section className={`${container} py-16`} aria-labelledby="best-title">
        <SectionHeading eyebrow="03 / Destacados" title={<span id="best-title">Materiales para tu próxima obra.</span>} action={<Link to={paths.catalog()} className="inline-flex items-center gap-2 text-[13px] font-semibold text-secundario hover:underline">Ver más <ArrowRight size={15} /></Link>} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {loading ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />) : data.bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="border-y border-[#e6e6eb] bg-[#f0f0ed] py-6" aria-label="Marcas">
        <div className={`${container} flex flex-wrap items-center justify-between gap-x-8 gap-y-3`}>
          <span className="text-[10px] font-bold tracking-[.16em]">MARCAS OFICIALES</span>
          <p className="m-0 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-[#565966]">
            {brands.filter((b) => b !== 'SIEV Build').map((b, i) => (
              <Link key={b} to={paths.catalog({ marcas: b })} className="hover:text-secundario">{i > 0 && <b className="mr-6 font-normal text-principal" aria-hidden="true">✦</b>}{b}</Link>
            ))}
          </p>
        </div>
      </section>

      <section className={`${container} py-16`} aria-labelledby="new-title">
        <SectionHeading eyebrow="04 / Novedades" title={<span id="new-title">Recién llegados a la tienda.</span>} action={<Link to={paths.catalog({ orden: 'novedades' })} className="inline-flex items-center gap-2 text-[13px] font-semibold text-secundario hover:underline">Ver novedades <ArrowRight size={15} /></Link>} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {loading ? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />) : data.newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <RecentlyViewed />
    </>
  )
}
