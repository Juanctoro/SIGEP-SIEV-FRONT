import { useId } from 'react'

// Ilustraciones vectoriales de los productos (marcador de posición).
// Siguen el estilo de líneas técnicas de la landing. Cuando el backend entregue
// imágenes reales, ProductImage puede mostrar la foto y usar este arte como respaldo.

const INK = '#222630'

function isLight(hex) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 150
}

function Screen({ x, y, w, h, rx = 2, id }) {
  return <>
    <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#${id}-screen)`} />
    <path d={`M${x + w * 0.55} ${y} L${x + w * 0.35} ${y + h} H${x + w * 0.47} L${x + w * 0.67} ${y} Z`} fill="#fff" opacity=".07" />
    <circle cx={x + w * 0.78} cy={y + h * 0.3} r={Math.min(w, h) * 0.07} fill="#e4581d" opacity=".9" />
    <path d={`M${x + w * 0.1} ${y + h * 0.82} q${w * 0.18} ${-h * 0.32} ${w * 0.36} ${-h * 0.12} t${w * 0.44} ${-h * 0.1}`} stroke="#fff" strokeOpacity=".35" strokeWidth="2" fill="none" />
  </>
}

function shapes(type, body, tone, id) {
  const s = { stroke: INK, strokeWidth: 2, strokeLinejoin: 'round' }
  switch (type) {
    case 'tv':
      return <>
        <path d="M112 208 l-16 30 h10 l18-30 M288 208 l16 30 h-10 l-18-30" {...s} fill={body} />
        <rect x="52" y="40" width="296" height="170" rx="4" fill={body} {...s} />
        <Screen x={58} y={46} w={284} h={156} id={id} />
      </>
    case 'laptop':
      return <>
        <rect x="96" y="44" width="208" height="146" rx="9" fill={body} {...s} />
        <Screen x={105} y={54} w={190} h={126} id={id} />
        <path d="M66 192 H334 L350 212 Q351 220 342 220 H58 Q49 220 50 212 Z" fill={body} {...s} />
        <rect x="176" y="192" width="48" height="6" rx="3" fill={tone} />
      </>
    case 'pc':
      return <>
        <rect x="44" y="58" width="190" height="122" rx="5" fill={body} {...s} />
        <Screen x={51} y={65} w={176} h={100} id={id} />
        <path d="M128 180 h22 v30 h-22 z" fill={body} {...s} />
        <rect x="100" y="208" width="78" height="8" rx="3" fill={body} {...s} />
        <rect x="254" y="54" width="96" height="176" rx="7" fill={body} {...s} />
        <path d="M268 74 h68 M268 86 h68 M268 98 h68" stroke={tone} strokeWidth="3" strokeLinecap="round" />
        <circle cx="302" cy="200" r="7" fill="none" stroke="#e4581d" strokeWidth="3" />
        <path d="M262 120 v86" stroke="#e4581d" strokeOpacity=".7" strokeWidth="2" />
      </>
    case 'monitor':
      return <>
        <path d="M188 200 h24 l4 34 h-32 z" fill={body} {...s} />
        <rect x="146" y="230" width="108" height="9" rx="4" fill={body} {...s} />
        <rect x="48" y="30" width="304" height="174" rx="6" fill={body} {...s} />
        <Screen x={55} y={37} w={290} h={156} id={id} />
      </>
    case 'phone':
      return <>
        <rect x="96" y="40" width="98" height="196" rx="18" fill={body} {...s} />
        <rect x="106" y="52" width="44" height="54" rx="12" fill={tone} stroke={INK} strokeWidth="1.5" />
        <circle cx="119" cy="66" r="7" fill={INK} /><circle cx="137" cy="66" r="7" fill={INK} /><circle cx="119" cy="90" r="7" fill={INK} />
        <circle cx="137" cy="90" r="3" fill="#e4581d" />
        <rect x="206" y="28" width="100" height="204" rx="18" fill={body} {...s} />
        <Screen x={212} y={34} w={88} h={192} rx={13} id={id} />
        <rect x="241" y="41" width="30" height="8" rx="4" fill={INK} />
      </>
    case 'tablet':
      return <>
        <rect x="62" y="50" width="276" height="188" rx="16" fill={body} {...s} />
        <Screen x={72} y={60} w={256} h={168} rx={8} id={id} />
        <path d="M330 248 L356 120 l6 2 -26 128 z" fill="#f1f1f3" {...s} />
      </>
    case 'headphones':
      return <>
        <path d="M118 176 C112 64 288 64 282 176" fill="none" stroke={INK} strokeWidth="18" strokeLinecap="round" />
        <path d="M118 176 C112 64 288 64 282 176" fill="none" stroke={body} strokeWidth="13" strokeLinecap="round" />
        <rect x="92" y="142" width="54" height="92" rx="24" fill={body} {...s} />
        <rect x="254" y="142" width="54" height="92" rx="24" fill={body} {...s} />
        <rect x="132" y="152" width="18" height="72" rx="9" fill={tone} />
        <rect x="250" y="152" width="18" height="72" rx="9" fill={tone} />
        <circle cx="282" cy="210" r="4" fill="#e4581d" />
      </>
    case 'earbuds':
      return <>
        <rect x="132" y="120" width="136" height="110" rx="38" fill={body} {...s} />
        <path d="M134 160 H266" stroke={INK} strokeWidth="2" />
        <circle cx="200" cy="196" r="4" fill="#e4581d" />
        <g transform="translate(118 46) rotate(-14)"><ellipse cx="22" cy="22" rx="20" ry="22" fill={body} {...s} /><rect x="14" y="36" width="15" height="48" rx="7" fill={body} {...s} /></g>
        <g transform="translate(240 40) rotate(14)"><ellipse cx="22" cy="22" rx="20" ry="22" fill={body} {...s} /><rect x="14" y="36" width="15" height="48" rx="7" fill={body} {...s} /></g>
      </>
    case 'speaker':
      return <>
        <rect x="70" y="108" width="260" height="108" rx="54" fill={body} {...s} />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${108 + i * 26} 118 v88`} stroke={tone} strokeWidth="5" strokeLinecap="round" />)}
        <ellipse cx="80" cy="162" rx="18" ry="50" fill={body} {...s} />
        <ellipse cx="80" cy="162" rx="9" ry="28" fill={tone} />
        <rect x="178" y="150" width="44" height="24" rx="5" fill="#e4581d" />
      </>
    case 'soundbar':
      return <>
        <rect x="286" y="80" width="78" height="150" rx="10" fill={body} {...s} />
        <circle cx="325" cy="160" r="26" fill={tone} stroke={INK} strokeWidth="1.5" />
        <rect x="30" y="166" width="246" height="44" rx="14" fill={body} {...s} />
        {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={48 + (i % 15) * 15} cy={180 + Math.floor(i / 15) * 14} r="2.4" fill={tone} />)}
        <circle cx="262" cy="188" r="3" fill="#e4581d" />
      </>
    case 'keyboard':
      return <>
        <rect x="40" y="96" width="320" height="118" rx="10" fill={body} {...s} />
        {Array.from({ length: 4 }, (_, row) => Array.from({ length: 13 }, (_, col) => (
          <rect key={`${row}-${col}`} x={52 + col * 23.4} y={108 + row * 22} width="19" height="17" rx="3" fill={tone} />
        )))}
        <rect x="122" y="196" width="140" height="11" rx="3" fill={tone} />
        <rect x="52" y="108" width="19" height="17" rx="3" fill="#e4581d" />
      </>
    case 'mouse':
      return <>
        <path d="M200 52 C254 52 270 106 270 156 C270 218 242 250 200 250 C158 250 130 218 130 156 C130 106 146 52 200 52 Z" fill={body} {...s} />
        <path d="M200 52 V132 M134 132 C170 140 230 140 266 132" stroke={INK} strokeWidth="2" fill="none" />
        <rect x="193" y="76" width="14" height="34" rx="7" fill="#e4581d" />
        <path d="M150 170 C150 200 162 222 182 232" stroke={tone} strokeWidth="5" strokeLinecap="round" fill="none" />
      </>
    case 'console':
      return <>
        <path d="M128 36 C150 30 170 30 178 40 V236 H122 C116 180 114 90 128 36 Z" fill={body} {...s} />
        <path d="M178 40 H232 V236 H178 Z" fill={tone} {...s} />
        <path d="M232 40 C250 30 270 30 282 36 C296 90 294 180 288 236 H232 Z" fill={body} {...s} />
        <path d="M190 210 h30" stroke="#e4581d" strokeWidth="3" strokeLinecap="round" />
        <g transform="translate(236 168) scale(.55)">{gamepad(body, tone, s)}</g>
      </>
    case 'gamepad':
      return <g transform="translate(-8 4)">{gamepad(body, tone, s)}</g>
    case 'watch':
    case 'band': {
      const band = type === 'band'
      return <>
        <rect x={band ? 182 : 170} y="18" width={band ? 36 : 60} height="264" rx="14" fill={tone} {...s} />
        <rect x={band ? 166 : 146} y={band ? 96 : 82} width={band ? 68 : 108} height={band ? 118 : 136} rx={band ? 30 : 30} fill={body} {...s} />
        <rect x={band ? 174 : 156} y={band ? 106 : 92} width={band ? 52 : 88} height={band ? 98 : 116} rx={band ? 22 : 22} fill={`url(#${id}-screen)`} />
        <text x="200" y={band ? 160 : 148} textAnchor="middle" fill="#fff" fontSize={band ? 18 : 26} fontFamily="Segoe UI, sans-serif" fontWeight="600">10:09</text>
        <circle cx="200" cy={band ? 182 : 178} r={band ? 6 : 9} fill="none" stroke="#e4581d" strokeWidth="3" />
        {!band && <rect x="252" y="122" width="9" height="24" rx="3" fill="#e4581d" stroke={INK} strokeWidth="1.5" />}
      </>
    }
    case 'camera':
      return <>
        <rect x="118" y="72" width="76" height="28" rx="5" fill={body} {...s} />
        <rect x="70" y="94" width="260" height="142" rx="14" fill={body} {...s} />
        <rect x="282" y="78" width="26" height="16" rx="4" fill="#e4581d" stroke={INK} strokeWidth="1.5" />
        <circle cx="200" cy="168" r="60" fill={tone} {...s} />
        <circle cx="200" cy="168" r="46" fill={INK} />
        <circle cx="200" cy="168" r="30" fill={`url(#${id}-screen)`} />
        <circle cx="188" cy="156" r="7" fill="#fff" opacity=".5" />
        <path d="M70 128 h70 M260 128 h70" stroke={tone} strokeWidth="3" />
      </>
    case 'actioncam':
      return <>
        <rect x="112" y="82" width="176" height="136" rx="18" fill={body} {...s} />
        <rect x="128" y="104" width="86" height="92" rx="12" fill={tone} />
        <circle cx="171" cy="150" r="34" fill={INK} />
        <circle cx="171" cy="150" r="20" fill={`url(#${id}-screen)`} />
        <rect x="226" y="108" width="48" height="48" rx="6" fill={`url(#${id}-screen)`} stroke={INK} strokeWidth="1.5" />
        <rect x="236" y="72" width="30" height="12" rx="3" fill="#e4581d" stroke={INK} strokeWidth="1.5" />
      </>
    case 'router':
      return <>
        {[96, 158, 242, 304].map((x, i) => <rect key={x} x={x} y="60" width="12" height="110" rx="6" fill={body} {...s} transform={`rotate(${[-12, -4, 4, 12][i]} ${x + 6} 170)`} />)}
        <path d="M60 170 H340 L352 214 Q354 224 344 224 H56 Q46 224 48 214 Z" fill={body} {...s} />
        {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={130 + i * 28} cy="196" r="4" fill={i === 0 ? '#e4581d' : tone} />)}
      </>
    case 'mesh':
      return <>
        {[[78, 92, 0.85], [158, 62, 1], [250, 92, 0.85]].map(([x, y, k]) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${k})`}>
            <rect x="0" y="0" width="80" height="164" rx="22" fill={body} {...s} />
            <path d="M8 140 H72" stroke={tone} strokeWidth="3" />
            <circle cx="40" cy="152" r="4" fill="#e4581d" />
          </g>
        ))}
      </>
    default:
      return <rect x="100" y="60" width="200" height="160" rx="12" fill={body} {...s} />
  }
}

function gamepad(body, tone, s) {
  return <>
    <path d="M120 120 C120 98 140 88 164 88 H236 C260 88 280 98 280 120 L304 204 C310 228 286 240 270 224 L244 196 H156 L130 224 C114 240 90 228 96 204 Z" fill={body} {...s} />
    <path d="M140 124 h12 v-12 h10 v12 h12 v10 h-12 v12 h-10 v-12 h-12 z" fill={tone} />
    {[[248, 112], [264, 128], [232, 128], [248, 144]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="7" fill={i === 0 ? '#e4581d' : tone} />)}
    <circle cx="176" cy="170" r="14" fill={tone} stroke="#222630" strokeWidth="1.5" />
    <circle cx="224" cy="170" r="14" fill={tone} stroke="#222630" strokeWidth="1.5" />
  </>
}

/**
 * view: 0 = frontal, 1 = detalle (acercamiento), 2 = plano técnico con medidas, 3 = colores disponibles.
 */
export default function ProductArt({ type, color = '#24262e', colors = [], view = 0, className = '', label, grid = true }) {
  const id = useId().replace(/:/g, '')
  const tone = isLight(color) ? 'rgba(34,38,48,.14)' : 'rgba(255,255,255,.16)'
  const zoom = view === 1 ? 'translate(-120 -80) scale(1.6)' : undefined

  return (
    <svg viewBox="0 0 400 300" className={`block h-full w-full ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <pattern id={`${id}-grid`} width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke={INK} strokeOpacity=".06" /></pattern>
        <linearGradient id={`${id}-screen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b44a8" /><stop offset=".6" stopColor="#2d3484" /><stop offset="1" stopColor="#171a46" />
        </linearGradient>
      </defs>
      {grid && <rect width="400" height="300" fill={`url(#${id}-grid)`} />}
      {view !== 3 && <ellipse cx="200" cy="252" rx="150" ry="10" fill={INK} opacity=".07" />}
      {view === 3 ? (
        <g>
          <g transform="translate(60 6) scale(.7)">{shapes(type, color, tone, id)}</g>
          {colors.map((c, i) => {
            const x = 200 - (colors.length - 1) * 22 + i * 44
            return <g key={c.name}><circle cx={x} cy="258" r="14" fill={c.hex} stroke={INK} strokeWidth="1.5" />{c.hex === color && <circle cx={x} cy="258" r="19" fill="none" stroke="#e4581d" strokeWidth="2" />}</g>
          })}
        </g>
      ) : (
        <g transform={zoom}>{shapes(type, color, tone, id)}</g>
      )}
      {view === 2 && (
        <g stroke="#e4581d" strokeWidth="1.2" fill="#e4581d" fontSize="10" fontFamily="Segoe UI, sans-serif" letterSpacing="1.5">
          <path d="M40 270 H360 M40 264 v12 M360 264 v12 M376 30 V250 M370 30 h12 M370 250 h12" fill="none" />
          <text x="200" y="290" textAnchor="middle" stroke="none">ANCHO</text>
          <text x="392" y="140" textAnchor="middle" stroke="none" transform="rotate(90 392 140)">ALTO</text>
        </g>
      )}
      {grid && <path d="M14 14h18M14 14v18M386 14h-18M386 14v18M14 286h18M14 286v-18M386 286h-18M386 286v-18" stroke={INK} strokeOpacity=".25" fill="none" />}
    </svg>
  )
}
