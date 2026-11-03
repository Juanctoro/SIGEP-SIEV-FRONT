import { Link } from 'react-router'
import { useEffect, useId, useRef, useState } from 'react'
import logo from './assets/LogoSIEV.png'
import ContactForm from './components/ContactForm'
import { clients, company, navigation, process, projects, services, values } from './data/institutional'

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

function LandingPage() {
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
          <Link to="/tienda" onClick={() => setMenuOpen(false)}>Tienda</Link>
          <button type="button" className="login-button" onClick={() => { setMenuOpen(false); dialog.current.showModal() }}>Iniciar sesión <span aria-hidden="true">↗</span></button>
        </nav>
      </div>
    </header>
    <main id="contenido">
      <section id="inicio" className="hero section-anchor">
        <div className="container hero-grid">
          <div className="hero-copy"><p className="eyebrow"><span /> Ingeniería eléctrica · Valle del Cauca</p><h1>Energía bien<br />instalada.<br /><em>Trabajo bien hecho.</em></h1><p className="hero-description">Montajes eléctricos, tableros, automatización y mantenimiento para la industria, el comercio y el hogar. Un equipo unido y responsable que cumple lo que cotiza.</p><div className="hero-actions"><a className="button button-primary" href="#contacto">Solicitar cotización <span aria-hidden="true">↗</span></a><a className="text-link" href="#servicios">Ver servicios <span aria-hidden="true">→</span></a></div><ul className="hero-highlights"><li>Baja y media tensión</li><li>Automatización Siemens · Delta</li><li>Trabajo en altura y espacios confinados</li></ul></div>
          <div className="hero-visual"><div className="visual-top"><span>SIEV / INGENIERÍA ELÉCTRICA</span><span>BAJA Y MEDIA TENSIÓN</span></div><ElectricalArt /><div className="visual-caption"><span className="visual-mark" aria-hidden="true">ϟ</span><div><strong>Automatización industrial</strong><span>Siemens · Delta</span></div><span aria-hidden="true">↗</span></div><span className="art-label">ILUSTRACIÓN CONCEPTUAL / TABLERO ELÉCTRICO</span></div>
        </div>
      </section>
      <div className="expertise-strip"><div className="container"><span>UNA SOLUCIÓN INTEGRAL</span><p>Diseño <b>✦</b> Instalación <b>✦</b> Mantenimiento <b>✦</b> Suministro</p></div></div>
      <section className="clients-section" aria-labelledby="clients-title"><div className="container"><p id="clients-title" className="eyebrow">Empresas que confían en nosotros</p><ul className="client-list">{clients.map((client) => <li key={client}>{client}</li>)}</ul></div></section>
      <section id="nosotros" className="section section-anchor about-section"><div className="container about-grid"><div><p className="eyebrow">01 / Nosotros</p><h2>Un aliado eléctrico<br /><span className="text-secundario">para la industria<br />del Valle.</span></h2><div className="about-stamp"><span aria-hidden="true">↗</span><p>Soluciones Integrales<br />Eléctricas del Valle S.A.S.</p></div></div><div className="about-content"><p className="large-copy">Diseñamos, suministramos, instalamos y mantenemos.</p><p>{company.about}</p><div className="values-list">{values.map((value, index) => <article key={value.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{value.title}</h3><p>{value.text}</p></div></article>)}</div></div></div></section>
      <section id="servicios" className="services-section section section-anchor"><div className="container"><div className="section-heading"><div><p className="eyebrow">Lo que hacemos</p><h2>Soluciones integrales,<br />de la acometida al tablero.</h2></div><p>Todo lo que su planta, negocio u hogar necesita en un solo proveedor eléctrico.</p></div><div className="services-grid">{services.map((service) => <article className="service-item" key={service.number}><div className="service-number"><span>{service.number}</span><span aria-hidden="true">↗</span></div><h3>{service.title}</h3><p>{service.text}</p><a className="text-link service-link" href="#contacto" aria-label={`Cotizar este servicio: ${service.title}`}>Cotizar este servicio <span aria-hidden="true">→</span></a></article>)}</div></div></section>
      <section className="section process-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">Cómo trabajamos</p><h2>Un proceso claro,<br />sin sorpresas.</h2></div></div><ol className="process-grid">{process.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></div></section>
      <section id="portafolio" className="section section-anchor portfolio-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">02 / Portafolio</p><h2>Ideas que toman forma.</h2></div><p>Una mirada a las soluciones que podemos desarrollar.<br />Proyectos conceptuales, no obras ejecutadas.</p></div><div className="filters" role="group" aria-label="Filtrar proyectos por sector">{['Todos', 'Comercial', 'Industrial', 'Residencial'].map((category) => <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="projects-grid">{projects.filter((project) => filter === 'Todos' || project.category === filter).map((project) => <article className="project-card" key={project.title}><div className="project-art"><ElectricalArt type={project.type} /><span>PROYECTO DE EJEMPLO</span></div><div className="project-info"><p>{project.category}</p><h3>{project.title}</h3><p>{project.text}</p></div></article>)}</div></div></section>
      <section className="contact-cta"><div className="container"><div><h2>¿Tiene un proyecto o una falla por resolver?</h2><p>Escríbanos y programamos una visita técnica.</p></div><a className="button button-primary" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp <span aria-hidden="true">↗</span></a></div></section>
      <section id="contacto" className="section section-anchor contact-section"><div className="container contact-grid"><div className="contact-copy"><p className="eyebrow">03 / Contacto</p><h2>Solicite su<br /><em>cotización.</em></h2><p>Cuéntenos qué necesita y le respondemos con una propuesta a la medida.</p><dl className="contact-details"><div><dt>Correo</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div><div><dt>Celular</dt><dd><a href={`tel:+${company.whatsapp}`}>{company.phone}</a><br /><a href="tel:+573146372034">{company.secondPhone}</a></dd></div><div className="contact-address"><dt>Dirección</dt><dd><a href={company.mapsUrl} target="_blank" rel="noopener noreferrer">{company.location} ↗</a></dd></div></dl></div><ContactForm /></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-top"><a href="#inicio" aria-label="Volver al inicio"><img src={logo} alt="SIEV" className="brand-logo" /></a><p>Energía para construir lo que viene.</p><a href="#inicio" className="text-link">Volver arriba ↑</a></div><div className="container footer-bottom"><p>© {currentYear} SIEV S.A.S.</p><p>Soluciones Integrales Eléctricas del Valle S.A.S.</p></div></footer>
    <dialog ref={dialog} className="login-dialog" onClick={(event) => { if (event.target === event.currentTarget) dialog.current.close() }}><div className="dialog-content"><p className="eyebrow">SIGEP-SIEV</p><h2>Portal de colaboradores</h2><p>El inicio de sesión estará disponible próximamente para acceder al sistema interno de gestión.</p><button className="button button-secondary" type="button" autoFocus onClick={() => dialog.current.close()}>Entendido</button></div></dialog>
  </>
}

export default LandingPage
