export const company = {
  name: 'Soluciones Integrales Eléctricas del Valle S.A.S.',
  email: 'sie.delvalle@hotmail.com',
  phone: '+57 318 309 0738',
  secondPhone: '+57 314 637 2034',
  whatsapp: '573183090738',
  location: 'Cra 3A # 14-117, Villagorgona, Candelaria, Valle del Cauca',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cra+3A+14-117+Villagorgona+Candelaria+Valle',
  about: 'En Soluciones Integrales Eléctricas del Valle S.A.S. acompañamos a plantas de producción, empresas y hogares con soluciones eléctricas completas: diseñamos, suministramos, instalamos y mantenemos. Trabajamos de la mano del área de mantenimiento de cada cliente para que la operación nunca se detenga.',
}

export const values = [
  { title: 'Seguridad primero', text: 'Cada trabajo se planea con análisis de riesgos, EPP y procedimientos certificados.' },
  { title: 'Un equipo unido y responsable', text: 'Técnicos y supervisores que responden por el resultado de principio a fin.' },
  { title: 'Cumplimiento', text: 'Cronogramas claros y comunicación constante con el área de mantenimiento del cliente.' },
]

export const services = [
  { title: 'Montajes eléctricos en baja y media tensión', text: 'Acometidas, redes, subestaciones y montajes industriales ejecutados con normativa vigente y personal calificado.' },
  { title: 'Tableros eléctricos', text: 'Armado, cableado, modernización y mantenimiento de tableros de distribución, control y fuerza.' },
  { title: 'Automatización industrial', text: 'Programación e integración con PLC, variadores y HMI Siemens y Delta.' },
  { title: 'Proyectos de iluminación', text: 'Diseño e instalación de iluminación interior, exterior e industrial eficiente.' },
  { title: 'Corrección de factor de potencia', text: 'Estudio, bancos de condensadores y control para reducir penalizaciones por energía reactiva.' },
  { title: 'Bandejas portacables y tubería', text: 'Canalizaciones ordenadas y seguras en bandeja, tubería EMT, IMC y PVC.' },
  { title: 'Mantenimiento preventivo', text: 'Rutinas programadas, termografía, ajustes y limpieza para evitar paros no planeados.' },
  { title: 'Planos y diseño eléctrico', text: 'Levantamientos, diagramas unifilares y planos de proyectos eléctricos.' },
  { title: 'Alquiler de plantas eléctricas', text: 'Respaldo de energía para obras, eventos y contingencias en planta.' },
  { title: 'Suministro de materiales', text: 'Material eléctrico para proyectos residenciales, comerciales e industriales.' },
  { title: 'Trabajo en altura y espacios confinados', text: 'Personal certificado y protocolos de seguridad para tareas de alto riesgo.' },
].map((service, index) => ({ ...service, number: String(index + 1).padStart(2, '0') }))

export const clients = ['Cargill', 'Pollos El Bucanero', 'Avícola Pollo Listo', 'Agrograin', 'Savicol']
export const process = [
  { title: 'Visita técnica', text: 'Evaluamos en sitio la necesidad, el alcance y las condiciones de seguridad.' },
  { title: 'Cotización', text: 'Enviamos una propuesta detallada con materiales, mano de obra y tiempos.' },
  { title: 'Ejecución', text: 'Con la orden de compra aprobada, nuestro equipo realiza el trabajo según lo pactado.' },
  { title: 'Entrega y soporte', text: 'Pruebas, informe del trabajo realizado y acompañamiento posterior.' },
]

// Ejemplos conceptuales: sustituir cuando se disponga de proyectos y fotografías reales.
export const projects = [
  { category: 'Comercial', title: 'Iluminación para espacios de trabajo', text: 'Ejemplo de renovación de iluminación y distribución eléctrica en oficinas.', type: 'lighting' },
  { category: 'Industrial', title: 'Distribución eléctrica industrial', text: 'Ejemplo de adecuación de tableros y circuitos para una planta de producción.', type: 'panel' },
  { category: 'Residencial', title: 'Infraestructura para nuevos hogares', text: 'Ejemplo de diseño e instalación de redes para un conjunto residencial.', type: 'building' },
]
export const navigation = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Quiénes somos' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'portafolio', label: 'Portafolio' },
  { id: 'contacto', label: 'Contacto' },
]
