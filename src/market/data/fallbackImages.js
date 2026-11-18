// Imágenes públicas (Wikimedia Commons) que se muestran cuando un producto no tiene
// imagen subida desde el panel de administración. Si una de estas URL también falla,
// ProductArt muestra un marcador de posición local (ver components/ProductArt.jsx).

const thumb = (path, file) => `https://thumb.wikimedia.org/wikipedia/commons/thumb/${path}/${file}/960px-${file}`

const img = {
  cables: thumb('5/53', 'Cable_wires.jpg'),
  contactor: thumb('3/3c', 'Contactor_DIN_IEK.jpg'),
  breaker: thumb('5/54', '630_Amps_Molded_Case_Circuit_Breaker.jpg'),
  plc: thumb('5/5f', 'Siemens_sps_logo_8_12-24_RCE-03.jpg'),
  drive: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Variable-Frequency-Inverter.jpg',
  ledTube: thumb('6/65', 'LED_tubes_in_various_length.JPG'),
  emergency: thumb('c/cf', 'Sure-Lites_emergency_exit_light_2.jpg'),
  tray: thumb('5/5d', 'Cable_tray_with_cables.jpg'),
  conduit: thumb('1/1b', 'Conduit_cable_bank_vancouver.jpg'),
  panel: thumb('1/1d', 'OrganizedElectricalWiring.jpg'),
  ground: thumb('8/89', 'Ground_rod_installation.jpg'),
  tape: thumb('d/d0', 'Electrical-tape_black.jpg'),
  tools: thumb('a/a4', 'Repair_tool_kit.jpg'),
}

export const DEFAULT_IMAGE = img.tools

// Se evalúan en orden contra «nombre + categoría» del producto (sin tildes, minúsculas).
const rules = [
  [/breaker|interruptor|totalizador/, img.breaker],
  [/variador|inversor/, img.drive],
  [/plc|logo!|automatizacion|controlador/, img.plc],
  // Antes que «emergencia»: un pulsador de paro de emergencia es control, no iluminación.
  [/contactor|guardamotor|pulsador|rele|control y proteccion/, img.contactor],
  [/emergencia/, img.emergency],
  [/bandeja/, img.tray],
  [/tubo|emt|conduit|canalizacion/, img.conduit],
  [/cable|conductor|alambre/, img.cables],
  [/lampara|luminaria|led|iluminacion|reflector/, img.ledTube],
  [/gabinete|tablero|armario/, img.panel],
  [/tierra|varilla/, img.ground],
  [/cinta|consumible/, img.tape],
]

const normalize = (text = '') => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function fallbackImage(...texts) {
  const haystack = normalize(texts.join(' '))
  return rules.find(([pattern]) => pattern.test(haystack))?.[1] ?? DEFAULT_IMAGE
}
