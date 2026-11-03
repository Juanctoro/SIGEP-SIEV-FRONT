import { useEffect, useId, useRef, useState } from 'react'
import logo from './assets/LogoSIEV.png'
import ContactForm from './components/ContactForm'
import { company, navigation, projects, services } from './data/institutional'

function ElectricalArt({ type = 'panel' }) {
  const gridId = useId()
  return <svg className={`electrical-art art-${type}`} viewBox="0 0 600 440" fill="none" aria-hidden="true">
    <defs><pattern id={gridId} width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" stroke="currentColor" strokeOpacity=".1" /></pattern></defs>
    <rect width="600" height="440" fill={`url(#${gridId})`} />
    {type === 'panel' ? <><path d="M130 70h340v300H130z" fill="#fff" fillOpacity=".04" stroke="currentColor" strokeWidth="2"/><path d="M150 90h300v260H150zM300 90v260" stroke="currentColor" strokeOpacity=".4"/>{[135,210,285].map((y) => <g key={y}><path d={`M175 ${y}h95v40h-95z M325 ${y}h95v40h-95z`} stroke="currentColor"/><path d={`M190 ${y+12}h14v16h-14z M223 ${y+12}h14v16h-14z M340 ${y+12}h14v16h-14z M373 ${y+12}h14v16h-14z`} fill="currentColor" fillOpacity=".5"/></g>)}<path d="M210 70V35h180v35M210 370v40m45-40v40m90-40v40m45-40v40" stroke="currentColor" strokeWidth="3"/><circle cx="445" cy="228" r="4" fill="var(--color-principal)"/></> : type === 'lighting' ? <><path d="M70 350h460M120 350V180l180-90 180 90v170M120 180h360M300 90v260" stroke="currentColor" strokeWidth="2"/>{[195,300,405].map((x) => <g key={x}><path d={`M${x} 180v55m-25 0h50l15 30h-80z`} stroke="currentColor" strokeWidth="2"/><path d={`M${x-22} 285l-30 65h105l-30-65`} fill="var(--color-principal)" fillOpacity=".15"/></g>)}</> : <><path d="M100 360h400M150 360V130h120v230m0-170h180v170M150 130l60-45 60 45" stroke="currentColor" strokeWidth="2"/>{[165,225,285].map((y) => <g key={y}>{[175,225,300,355,410].map((x) => <path key={x} d={`M${x} ${y}h18v28h-18z`} fill="currentColor" fillOpacity=".3"/>)}</g>)}<path d="M195 360v-42h30v42m115 0v-42h35v42" stroke="var(--color-principal)" strokeWidth="3"/></>}
    <path d="M30 30h30M30 30v30m540-30h-30m30 0v30M30 410h30m-30 0v-30m540 30h-30m30 0v-30" stroke="currentColor" strokeOpacity=".5"/>
  </svg>
}

const currentYear = new Date().getFullYear()

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('inicio')
  const [filter, setFilter] = useState('Todos')
  const dialog = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
    }, { rootMargin: '-20% 0px -55% 0px' })
    navigation.forEach(({ id }) => { const section = document.getElementById(id); if (section) observer.observe(section) })
    return () => observer.disconnect()
  }, [])

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="site-header">
      <div className="container header-inner">
        <a href="#inicio" aria-label="SIEV, ir al inicio" onClick={() => setMenuOpen(false)}><img className="brand-logo" src={logo} alt="SIEV - Soluciones Integrales Eléctricas del Valle" /></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</button>
        <nav id="main-navigation" aria-label="Navegación principal" className={menuOpen ? 'navigation is-open' : 'navigation'} onKeyDown={(event) => { if (event.key === 'Escape') setMenuOpen(false) }}>
          {navigation.map(({ id, label }) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <button type="button" className="login-button" onClick={() => { setMenuOpen(false); dialog.current.showModal() }}>Iniciar sesión <span aria-hidden="true">↗</span></button>
        </nav>
      </div>
    </header>
    <main id="contenido">
      <section id="inicio" className="hero section-anchor">
        <div className="container hero-grid">
          <div className="hero-copy"><p className="eyebrow"><span /> Ingeniería que conecta</p><h1>La energía detrás<br />de tu <em>próximo<br className="desktop-break" /> proyecto.</em></h1><p className="hero-description">Soluciones eléctricas integrales para transformar tus ideas en infraestructura que funciona.</p><div className="hero-actions"><a className="button button-primary" href="#contacto">Hablemos de tu proyecto <span aria-hidden="true">↗</span></a><a className="text-link" href="#portafolio">Explorar portafolio <span aria-hidden="true">→</span></a></div><p className="hero-footnote">Planeación. Instalación. Acompañamiento.</p></div>
          <div className="hero-visual"><div className="visual-top"><span>SIEV / INGENIERÍA ELÉCTRICA</span><span>01 — 04</span></div><ElectricalArt /><div className="visual-caption"><span className="visual-mark" aria-hidden="true">ϟ</span><div><strong>Conectamos soluciones.</strong><span>Diseñamos nuevas posibilidades.</span></div><span aria-hidden="true">↗</span></div><span className="art-label">ILUSTRACIÓN CONCEPTUAL / TABLERO ELÉCTRICO</span></div>
        </div>
      </section>
      <div className="expertise-strip"><div className="container"><span>UNA SOLUCIÓN INTEGRAL</span><p>Diseño <b>✦</b> Instalación <b>✦</b> Mantenimiento <b>✦</b> Suministro</p></div></div>
      <section id="nosotros" className="section section-anchor about-section"><div className="container about-grid"><div><p className="eyebrow">01 / Quiénes somos</p><h2>Más que instalaciones.<br /><span className="text-secundario">Conexiones que<br />impulsan.</span></h2><div className="about-stamp"><span aria-hidden="true">↗</span><p>Soluciones Integrales<br />Eléctricas del Valle S.A.S.</p></div></div><div className="about-content"><p className="large-copy">Un aliado para llevar tu proyecto del plano a la realidad.</p><p>{company.about}</p><p className="mock-caption">Presentación institucional de ejemplo, pendiente de aprobación por SIEV.</p><div className="purpose-grid"><article><span>01</span><h3>Nuestra misión</h3><p>{company.mission}</p></article><article><span>02</span><h3>Nuestra visión</h3><p>{company.vision}</p></article></div></div></div></section>
      <section className="services-section section"><div className="container"><div className="section-heading"><div><p className="eyebrow">Lo que hacemos</p><h2>Una visión completa.<br />Una solución para ti.</h2></div><p>Desde la primera idea hasta la puesta en marcha.<br />Servicios ilustrativos por confirmar con SIEV.</p></div><div className="services-grid">{services.map((service) => <article className="service-item" key={service.number}><div className="service-number"><span>{service.number}</span><span aria-hidden="true">↗</span></div><h3>{service.title}</h3><p>{service.text}</p><small>{service.detail}</small></article>)}</div></div></section>
      <section id="portafolio" className="section section-anchor portfolio-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">02 / Portafolio</p><h2>Ideas que toman forma.</h2></div><p>Una mirada a las soluciones que podemos desarrollar.<br />Proyectos conceptuales, no obras ejecutadas.</p></div><div className="filters" role="group" aria-label="Filtrar proyectos por sector">{['Todos', 'Comercial', 'Industrial', 'Residencial'].map((category) => <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="projects-grid">{projects.filter((project) => filter === 'Todos' || project.category === filter).map((project) => <article className="project-card" key={project.title}><div className="project-art"><ElectricalArt type={project.type} /><span>PROYECTO DE EJEMPLO</span></div><div className="project-info"><p>{project.category}</p><h3>{project.title}</h3><p>{project.text}</p></div></article>)}</div></div></section>
      <section id="contacto" className="section section-anchor contact-section"><div className="container contact-grid"><div className="contact-copy"><p className="eyebrow">03 / Contacto</p><h2>Todo gran proyecto<br />empieza con una<br /><em>conversación.</em></h2><p>Cuéntanos qué necesitas y demos el primer paso.</p><dl className="contact-details"><div><dt>Escríbenos</dt><dd>{company.email}</dd></div><div><dt>Llámanos</dt><dd>{company.phone}</dd></div><div><dt>Encuéntranos</dt><dd>{company.location}</dd></div><div><dt>Horario de atención</dt><dd>{company.hours}</dd></div></dl><p className="contact-demo-note">Datos de contacto ficticios. Formulario en modo demostración.</p></div><ContactForm /></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-top"><a href="#inicio" aria-label="Volver al inicio"><img src={logo} alt="SIEV" className="brand-logo" /></a><p>Energía para construir lo que viene.</p><a href="#inicio" className="text-link">Volver arriba ↑</a></div><div className="container footer-bottom"><p>© {currentYear} SIEV S.A.S.</p><p>Sitio de demostración · Contenido ilustrativo</p></div></footer>
    <dialog ref={dialog} className="login-dialog" onClick={(event) => { if (event.target === event.currentTarget) dialog.current.close() }}><div className="dialog-content"><p className="eyebrow">SIGEP-SIEV</p><h2>Portal de colaboradores</h2><p>El inicio de sesión estará disponible próximamente para acceder al sistema interno de gestión.</p><button className="button button-secondary" type="button" autoFocus onClick={() => dialog.current.close()}>Entendido</button></div></dialog>
  </>
}

export default App


