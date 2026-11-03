function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secundario px-6 py-16 text-white">
      <section className="w-full max-w-3xl rounded-2xl border border-white/20 bg-white/5 p-8 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-principal">
          SIEV S.A.S.
        </p>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">SIGEP-SIEV</h1>
        <p className="mt-5 text-lg text-white/90">
          Sistema de Información y Gestión de Proyectos Eléctricos
        </p>
        <p className="mt-4 leading-relaxed text-white/75">
          Portal público y sistema de gestión de cotizaciones, inventario,
          proyectos eléctricos y flujo de caja.
        </p>
        <span className="mt-8 inline-block rounded-full border border-principal bg-principal/10 px-4 py-2 text-sm font-medium text-white">
          Proyecto en desarrollo
        </span>
      </section>
    </main>
  )
}

export default App
