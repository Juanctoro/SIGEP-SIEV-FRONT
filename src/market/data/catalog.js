// Datos de demostración del marketplace. Precios en pesos colombianos (COP).
// Reemplazar por las respuestas del backend cuando esté disponible (ver services/catalogService.js).

export const categories = [
  { id: 'televisores', name: 'Televisores', art: 'tv', description: 'Smart TV 4K, OLED y QLED para cada espacio.' },
  { id: 'portatiles', name: 'Portátiles', art: 'laptop', description: 'Equipos para estudio, oficina y alto rendimiento.' },
  { id: 'computadores', name: 'Computadores de escritorio', art: 'pc', description: 'Torres, todo en uno y estaciones de trabajo.' },
  { id: 'monitores', name: 'Monitores', art: 'monitor', description: 'Pantallas para productividad, diseño y gaming.' },
  { id: 'celulares', name: 'Celulares', art: 'phone', description: 'Smartphones de última generación.' },
  { id: 'tablets', name: 'Tablets', art: 'tablet', description: 'Portabilidad para trabajar, crear y entretenerse.' },
  { id: 'audio', name: 'Audio', art: 'headphones', description: 'Audífonos, parlantes y barras de sonido.' },
  { id: 'perifericos', name: 'Teclados y mouse', art: 'keyboard', description: 'Teclados mecánicos, mouse y accesorios.' },
  { id: 'gaming', name: 'Gaming', art: 'console', description: 'Consolas, controles y accesorios gamer.' },
  { id: 'smartwatches', name: 'Smartwatches', art: 'watch', description: 'Relojes inteligentes y bandas deportivas.' },
  { id: 'camaras', name: 'Cámaras', art: 'camera', description: 'Fotografía, video y cámaras de acción.' },
  { id: 'redes', name: 'Redes y conectividad', art: 'router', description: 'Routers, mallas Wi-Fi y accesorios de red.' },
]

const C = {
  negro: { name: 'Negro', hex: '#24262e' },
  grafito: { name: 'Grafito', hex: '#4a4d57' },
  plata: { name: 'Plata', hex: '#c9ccd3' },
  blanco: { name: 'Blanco', hex: '#f1f1f3' },
  azul: { name: 'Azul medianoche', hex: '#2d3484' },
  naranja: { name: 'Naranja', hex: '#e4581d' },
  verde: { name: 'Verde salvia', hex: '#8fa58c' },
  rosa: { name: 'Rosa', hex: '#e8b9b5' },
  arena: { name: 'Arena', hex: '#d8cbb3' },
}

const storage = (base, steps) => ({
  name: 'Almacenamiento',
  values: steps.map(([label, delta]) => ({ label, priceDelta: delta })),
})

// rawProducts: los campos mínimos; el resto se completa en buildProduct().
const rawProducts = [
  // Televisores
  { id: 'p001', name: 'Smart TV 55" Crystal UHD 4K', brand: 'Samsung', category: 'televisores', price: 2149900, oldPrice: 2599900, rating: 4.6, reviews: 312, stock: 24, colors: [C.negro], badges: ['Más vendido'], date: '2026-06-02',
    summary: 'Imagen 4K nítida con procesador Crystal y Tizen OS para todas tus apps.',
    highlights: ['Resolución 4K UHD (3840 × 2160)', 'HDR10+ y modo juego automático', 'Tizen OS con asistentes de voz', '3 puertos HDMI y 2 USB'],
    specs: { Pantalla: '55 pulgadas LED', Resolución: '3840 × 2160 (4K UHD)', 'Tasa de refresco': '60 Hz', 'Sistema operativo': 'Tizen OS', Conectividad: 'Wi-Fi 5, Bluetooth 5.2', Puertos: '3 HDMI, 2 USB, Ethernet', Audio: '20 W, 2 canales', Garantía: '1 año con el fabricante' } },
  { id: 'p002', name: 'Smart TV 65" OLED evo C4', brand: 'LG', category: 'televisores', price: 7999900, oldPrice: 9499900, rating: 4.9, reviews: 148, stock: 6, colors: [C.grafito], badges: ['Premium'], date: '2026-08-15',
    summary: 'Negros perfectos y contraste infinito con píxeles autoiluminados.',
    highlights: ['Panel OLED evo autoiluminado', 'Procesador α9 Gen7 con IA', '144 Hz, G-Sync y FreeSync Premium', 'Dolby Vision y Dolby Atmos'],
    specs: { Pantalla: '65 pulgadas OLED', Resolución: '3840 × 2160 (4K UHD)', 'Tasa de refresco': '144 Hz', 'Sistema operativo': 'webOS 24', Conectividad: 'Wi-Fi 6, Bluetooth 5.1', Puertos: '4 HDMI 2.1, 3 USB', Audio: '40 W, 2.2 canales', Garantía: '2 años con el fabricante' } },
  { id: 'p003', name: 'Google TV 50" 4K QLED', brand: 'TCL', category: 'televisores', price: 1599900, oldPrice: 1899900, rating: 4.4, reviews: 207, stock: 31, colors: [C.negro], badges: [], date: '2026-04-20',
    summary: 'Color QLED y Google TV con recomendaciones personalizadas.',
    highlights: ['Tecnología Quantum Dot', 'Google TV con Chromecast integrado', 'Dolby Vision y HDR10', 'Control por voz con Google Assistant'],
    specs: { Pantalla: '50 pulgadas QLED', Resolución: '3840 × 2160 (4K UHD)', 'Tasa de refresco': '60 Hz', 'Sistema operativo': 'Google TV', Conectividad: 'Wi-Fi 5, Bluetooth 5.0', Puertos: '3 HDMI, 1 USB', Audio: '20 W Dolby Audio', Garantía: '1 año con el fabricante' } },
  { id: 'p004', name: 'Smart TV 43" Full HD', brand: 'Hisense', category: 'televisores', price: 1099900, oldPrice: null, rating: 4.2, reviews: 96, stock: 40, colors: [C.negro], badges: [], date: '2026-02-11',
    summary: 'Ideal para habitaciones: compacto, eficiente y con VIDAA OS.',
    highlights: ['Resolución Full HD', 'VIDAA OS con Netflix y YouTube', 'Modo deporte y modo cine', 'Bajo consumo energético'],
    specs: { Pantalla: '43 pulgadas LED', Resolución: '1920 × 1080 (Full HD)', 'Tasa de refresco': '60 Hz', 'Sistema operativo': 'VIDAA', Conectividad: 'Wi-Fi 5', Puertos: '2 HDMI, 2 USB', Audio: '16 W', Garantía: '1 año con el fabricante' } },
  { id: 'p005', name: 'Smart TV 75" Neo QLED 4K', brand: 'Samsung', category: 'televisores', price: 8999900, oldPrice: 10999900, rating: 4.8, reviews: 64, stock: 3, colors: [C.plata], badges: ['Últimas unidades'], date: '2026-09-01',
    summary: 'Mini LED con Quantum Matrix para brillo extremo en espacios amplios.',
    highlights: ['Tecnología Quantum Mini LED', 'Procesador Neural Quantum 4K', '120 Hz con Motion Xcelerator', 'Object Tracking Sound+'],
    specs: { Pantalla: '75 pulgadas Neo QLED', Resolución: '3840 × 2160 (4K UHD)', 'Tasa de refresco': '120 Hz', 'Sistema operativo': 'Tizen OS', Conectividad: 'Wi-Fi 6E, Bluetooth 5.3', Puertos: '4 HDMI 2.1, 2 USB', Audio: '60 W, 4.2.2 canales', Garantía: '2 años con el fabricante' } },

  // Portátiles
  { id: 'p006', name: 'Portátil IdeaPad Slim 5 14"', brand: 'Lenovo', category: 'portatiles', price: 3299900, oldPrice: 3799900, rating: 4.6, reviews: 241, stock: 18, colors: [C.grafito, C.plata], badges: ['Más vendido'], date: '2026-05-10',
    summary: 'Delgado, liviano y con batería para todo el día.',
    highlights: ['AMD Ryzen 7 8845HS', '16 GB RAM LPDDR5x', 'SSD de 512 GB', 'Pantalla 14" WUXGA OLED'],
    specs: { Procesador: 'AMD Ryzen 7 8845HS', Memoria: '16 GB LPDDR5x', Almacenamiento: 'SSD 512 GB NVMe', Pantalla: '14" OLED 1920 × 1200', Gráficos: 'AMD Radeon 780M', Batería: 'Hasta 12 horas', Peso: '1,46 kg', 'Sistema operativo': 'Windows 11 Home' },
    options: storage(0, [['512 GB', 0], ['1 TB', 400000]]) },
  { id: 'p007', name: 'MacBook Air 13" chip M4', brand: 'Apple', category: 'portatiles', price: 5499900, oldPrice: 5999900, rating: 4.9, reviews: 389, stock: 12, colors: [C.plata, C.azul, C.arena], badges: ['Nuevo'], date: '2026-09-20',
    summary: 'Potencia del chip M4 en un diseño sin ventilador y silencioso.',
    highlights: ['Chip Apple M4 de 10 núcleos', '16 GB de memoria unificada', 'Pantalla Liquid Retina 13,6"', 'Hasta 18 horas de batería'],
    specs: { Procesador: 'Apple M4 (CPU 10 núcleos)', Memoria: '16 GB unificada', Almacenamiento: 'SSD 256 GB', Pantalla: '13,6" Liquid Retina 2560 × 1664', Gráficos: 'GPU 8 núcleos', Batería: 'Hasta 18 horas', Peso: '1,24 kg', 'Sistema operativo': 'macOS' },
    options: storage(0, [['256 GB', 0], ['512 GB', 900000], ['1 TB', 1800000]]) },
  { id: 'p008', name: 'Portátil Gamer TUF A15', brand: 'ASUS', category: 'portatiles', price: 4899900, oldPrice: 5699900, rating: 4.7, reviews: 176, stock: 9, colors: [C.grafito], badges: ['Gamer'], date: '2026-07-04',
    summary: 'RTX 4060 y pantalla de 144 Hz para jugar sin límites.',
    highlights: ['AMD Ryzen 7 7435HS', 'NVIDIA GeForce RTX 4060 8 GB', 'Pantalla 15,6" FHD 144 Hz', 'Certificación militar MIL-STD-810H'],
    specs: { Procesador: 'AMD Ryzen 7 7435HS', Memoria: '16 GB DDR5', Almacenamiento: 'SSD 512 GB NVMe', Pantalla: '15,6" IPS 1920 × 1080, 144 Hz', Gráficos: 'NVIDIA GeForce RTX 4060 8 GB', Batería: '90 Wh', Peso: '2,2 kg', 'Sistema operativo': 'Windows 11 Home' } },
  { id: 'p009', name: 'Portátil Inspiron 15 3530', brand: 'Dell', category: 'portatiles', price: 2499900, oldPrice: null, rating: 4.3, reviews: 133, stock: 27, colors: [C.negro, C.plata], badges: [], date: '2026-03-08',
    summary: 'Confiable para la oficina y el estudio, con teclado numérico.',
    highlights: ['Intel Core i5-1335U', '8 GB RAM DDR4', 'SSD de 512 GB', 'Pantalla 15,6" Full HD 120 Hz'],
    specs: { Procesador: 'Intel Core i5-1335U', Memoria: '8 GB DDR4', Almacenamiento: 'SSD 512 GB', Pantalla: '15,6" FHD 120 Hz', Gráficos: 'Intel Iris Xe', Batería: '41 Wh', Peso: '1,65 kg', 'Sistema operativo': 'Windows 11 Home' } },
  { id: 'p010', name: 'Portátil Pavilion x360 2 en 1', brand: 'HP', category: 'portatiles', price: 3099900, oldPrice: 3499900, rating: 4.4, reviews: 88, stock: 14, colors: [C.plata, C.azul], badges: [], date: '2026-06-18',
    summary: 'Pantalla táctil que gira 360° para trabajar o dibujar.',
    highlights: ['Intel Core Ultra 5 125U', 'Pantalla táctil 14" FHD', 'Bisagra de 360°', 'Compatible con lápiz HP'],
    specs: { Procesador: 'Intel Core Ultra 5 125U', Memoria: '16 GB DDR5', Almacenamiento: 'SSD 512 GB', Pantalla: '14" táctil FHD', Gráficos: 'Intel Graphics', Batería: 'Hasta 9 horas', Peso: '1,51 kg', 'Sistema operativo': 'Windows 11 Home' } },

  // Computadores de escritorio
  { id: 'p011', name: 'Todo en uno IdeaCentre AIO 24"', brand: 'Lenovo', category: 'computadores', price: 3599900, oldPrice: 3999900, rating: 4.5, reviews: 71, stock: 10, colors: [C.blanco, C.negro], badges: [], date: '2026-04-02',
    summary: 'Todo en un solo equipo: ideal para el hogar y la oficina.',
    highlights: ['Intel Core i5-13420H', 'Pantalla 23,8" FHD sin bordes', 'Cámara FHD con privacidad', 'Teclado y mouse incluidos'],
    specs: { Procesador: 'Intel Core i5-13420H', Memoria: '16 GB DDR5', Almacenamiento: 'SSD 512 GB', Pantalla: '23,8" IPS FHD', Gráficos: 'Intel UHD', Conectividad: 'Wi-Fi 6, Bluetooth 5.2', 'Sistema operativo': 'Windows 11 Home', Garantía: '1 año' } },
  { id: 'p012', name: 'PC Gamer Ryzen 5 + RTX 4060', brand: 'SIEV Build', category: 'computadores', price: 4599900, oldPrice: 5199900, rating: 4.8, reviews: 52, stock: 7, colors: [C.negro], badges: ['Ensamblado'], date: '2026-08-28',
    summary: 'Torre ensamblada y probada, lista para jugar en 1080p y 1440p.',
    highlights: ['AMD Ryzen 5 7600', 'NVIDIA RTX 4060 8 GB', '32 GB RAM DDR5', 'Chasis con vidrio templado y ventilación ARGB'],
    specs: { Procesador: 'AMD Ryzen 5 7600', Memoria: '32 GB DDR5 6000 MHz', Almacenamiento: 'SSD 1 TB NVMe Gen4', Gráficos: 'NVIDIA GeForce RTX 4060 8 GB', 'Fuente de poder': '650 W 80 Plus Bronze', 'Board': 'B650M', 'Sistema operativo': 'Windows 11 Pro', Garantía: '1 año por componente' } },
  { id: 'p013', name: 'iMac 24" chip M4', brand: 'Apple', category: 'computadores', price: 7299900, oldPrice: null, rating: 4.9, reviews: 44, stock: 5, colors: [C.azul, C.verde, C.rosa, C.plata], badges: ['Nuevo'], date: '2026-10-01',
    summary: 'Pantalla Retina 4,5K y colores vibrantes en un diseño ultradelgado.',
    highlights: ['Chip Apple M4', 'Pantalla Retina 4,5K de 24"', 'Cámara de 12 MP Center Stage', 'Magic Keyboard y Magic Mouse incluidos'],
    specs: { Procesador: 'Apple M4 (CPU 8 núcleos)', Memoria: '16 GB unificada', Almacenamiento: 'SSD 256 GB', Pantalla: '24" Retina 4480 × 2520', Audio: 'Seis parlantes', Conectividad: 'Wi-Fi 6E, Bluetooth 5.3', 'Sistema operativo': 'macOS', Garantía: '1 año' } },

  // Monitores
  { id: 'p014', name: 'Monitor 27" QHD IPS 165 Hz', brand: 'LG', category: 'monitores', price: 1299900, oldPrice: 1599900, rating: 4.7, reviews: 194, stock: 22, colors: [C.negro], badges: ['Oferta'], date: '2026-05-21',
    summary: 'Resolución QHD y 165 Hz para jugar y trabajar con fluidez.',
    highlights: ['Panel IPS 27" 2560 × 1440', '165 Hz y 1 ms GtG', 'HDR10 y sRGB 99%', 'Ajuste de altura e inclinación'],
    specs: { Tamaño: '27 pulgadas', Panel: 'IPS', Resolución: '2560 × 1440 (QHD)', 'Tasa de refresco': '165 Hz', 'Tiempo de respuesta': '1 ms GtG', Puertos: '2 HDMI, 1 DisplayPort', VESA: '100 × 100', Garantía: '1 año' } },
  { id: 'p015', name: 'Monitor curvo 32" Odyssey G5', brand: 'Samsung', category: 'monitores', price: 1499900, oldPrice: 1799900, rating: 4.6, reviews: 120, stock: 11, colors: [C.negro], badges: ['Gamer'], date: '2026-06-30',
    summary: 'Curvatura 1000R inmersiva con 165 Hz y QHD.',
    highlights: ['Curvatura 1000R', 'QHD 2560 × 1440', '165 Hz y 1 ms', 'AMD FreeSync Premium'],
    specs: { Tamaño: '32 pulgadas', Panel: 'VA curvo 1000R', Resolución: '2560 × 1440 (QHD)', 'Tasa de refresco': '165 Hz', 'Tiempo de respuesta': '1 ms MPRT', Puertos: '1 HDMI, 1 DisplayPort', VESA: '75 × 75', Garantía: '1 año' } },
  { id: 'p016', name: 'Monitor 24" Full HD P2425H', brand: 'Dell', category: 'monitores', price: 799900, oldPrice: null, rating: 4.5, reviews: 260, stock: 45, colors: [C.negro], badges: [], date: '2026-01-15',
    summary: 'El monitor de oficina por excelencia: ergonómico y con certificación de bajo brillo azul.',
    highlights: ['IPS 24" Full HD 100 Hz', 'ComfortView Plus', 'Base ergonómica completa', 'USB-C y concentrador USB'],
    specs: { Tamaño: '23,8 pulgadas', Panel: 'IPS', Resolución: '1920 × 1080 (FHD)', 'Tasa de refresco': '100 Hz', 'Tiempo de respuesta': '5 ms', Puertos: 'HDMI, DisplayPort, VGA, USB-C', VESA: '100 × 100', Garantía: '3 años' } },
  { id: 'p017', name: 'Monitor 4K 27" ProArt', brand: 'ASUS', category: 'monitores', price: 2799900, oldPrice: 3199900, rating: 4.8, reviews: 39, stock: 4, colors: [C.negro], badges: ['Profesional'], date: '2026-07-22',
    summary: 'Color calibrado de fábrica para diseño, fotografía y video.',
    highlights: ['4K UHD 27" IPS', 'Calman Verified, ΔE < 2', '100% sRGB y Rec. 709', 'USB-C con 96 W de carga'],
    specs: { Tamaño: '27 pulgadas', Panel: 'IPS', Resolución: '3840 × 2160 (4K UHD)', 'Tasa de refresco': '60 Hz', 'Tiempo de respuesta': '5 ms', Puertos: 'HDMI, DisplayPort, USB-C 96 W', VESA: '100 × 100', Garantía: '3 años' } },

  // Celulares
  { id: 'p018', name: 'Galaxy S25 5G', brand: 'Samsung', category: 'celulares', price: 3899900, oldPrice: 4499900, rating: 4.8, reviews: 512, stock: 30, colors: [C.azul, C.plata, C.negro], badges: ['Más vendido'], date: '2026-08-05',
    summary: 'Galaxy AI, cámara de 50 MP y un diseño compacto premium.',
    highlights: ['Pantalla Dynamic AMOLED 2X 6,2" 120 Hz', 'Cámara principal de 50 MP', 'Snapdragon 8 Elite for Galaxy', 'Galaxy AI integrado'],
    specs: { Pantalla: '6,2" Dynamic AMOLED 2X, 120 Hz', Procesador: 'Snapdragon 8 Elite', RAM: '12 GB', 'Cámara trasera': '50 + 12 + 10 MP', 'Cámara frontal': '12 MP', Batería: '4.000 mAh, carga 25 W', 'Sistema operativo': 'Android 15, One UI 7', Resistencia: 'IP68' },
    options: storage(0, [['128 GB', 0], ['256 GB', 400000], ['512 GB', 1100000]]) },
  { id: 'p019', name: 'iPhone 16', brand: 'Apple', category: 'celulares', price: 4699900, oldPrice: 4999900, rating: 4.8, reviews: 433, stock: 21, colors: [C.negro, C.blanco, C.rosa, C.verde], badges: [], date: '2026-09-12',
    summary: 'Control de Cámara, chip A18 y Apple Intelligence.',
    highlights: ['Pantalla Super Retina XDR 6,1"', 'Chip A18', 'Cámara Fusion de 48 MP', 'Botón de Acción y Control de Cámara'],
    specs: { Pantalla: '6,1" Super Retina XDR OLED', Procesador: 'Apple A18', RAM: '8 GB', 'Cámara trasera': '48 + 12 MP', 'Cámara frontal': '12 MP', Batería: 'Hasta 22 h de video', 'Sistema operativo': 'iOS 18', Resistencia: 'IP68' },
    options: storage(0, [['128 GB', 0], ['256 GB', 600000], ['512 GB', 1500000]]) },
  { id: 'p020', name: 'Redmi Note 14 Pro', brand: 'Xiaomi', category: 'celulares', price: 1499900, oldPrice: 1799900, rating: 4.5, reviews: 640, stock: 52, colors: [C.negro, C.azul, C.verde], badges: ['Oferta'], date: '2026-05-02',
    summary: 'Cámara de 200 MP y carga rápida de 45 W a un precio imbatible.',
    highlights: ['Cámara principal de 200 MP', 'AMOLED 6,67" 120 Hz', 'Batería de 5.500 mAh', 'Resistencia IP68'],
    specs: { Pantalla: '6,67" AMOLED 1.5K, 120 Hz', Procesador: 'MediaTek Dimensity 7300 Ultra', RAM: '8 GB', 'Cámara trasera': '200 + 8 + 2 MP', 'Cámara frontal': '32 MP', Batería: '5.500 mAh, carga 45 W', 'Sistema operativo': 'Android 14, HyperOS', Resistencia: 'IP68' },
    options: storage(0, [['256 GB', 0], ['512 GB', 250000]]) },
  { id: 'p021', name: 'Moto G85 5G', brand: 'Motorola', category: 'celulares', price: 1099900, oldPrice: 1299900, rating: 4.3, reviews: 285, stock: 38, colors: [C.azul, C.verde], badges: [], date: '2026-03-25',
    summary: 'Pantalla curva pOLED y sonido Dolby Atmos.',
    highlights: ['pOLED curva 6,67" 120 Hz', 'Cámara 50 MP con OIS', 'Sonido estéreo Dolby Atmos', '5G y NFC'],
    specs: { Pantalla: '6,67" pOLED 120 Hz', Procesador: 'Snapdragon 6s Gen 3', RAM: '8 GB', 'Cámara trasera': '50 + 8 MP', 'Cámara frontal': '32 MP', Batería: '5.000 mAh, carga 30 W', 'Sistema operativo': 'Android 14', Resistencia: 'IP52' },
    options: storage(0, [['256 GB', 0]]) },

  // Tablets
  { id: 'p022', name: 'iPad Air 11" chip M2', brand: 'Apple', category: 'tablets', price: 3599900, oldPrice: 3899900, rating: 4.8, reviews: 157, stock: 13, colors: [C.azul, C.plata, C.rosa], badges: [], date: '2026-06-10',
    summary: 'Potencia de computador en una tablet liviana y versátil.',
    highlights: ['Chip M2', 'Pantalla Liquid Retina 11"', 'Compatible con Apple Pencil Pro', 'Touch ID en el botón superior'],
    specs: { Pantalla: '11" Liquid Retina', Procesador: 'Apple M2', Almacenamiento: '128 GB', 'Cámara trasera': '12 MP', Conectividad: 'Wi-Fi 6E', Batería: 'Hasta 10 horas', Peso: '462 g', 'Sistema operativo': 'iPadOS 18' },
    options: storage(0, [['128 GB', 0], ['256 GB', 550000]]) },
  { id: 'p023', name: 'Galaxy Tab S10 FE', brand: 'Samsung', category: 'tablets', price: 2299900, oldPrice: 2699900, rating: 4.6, reviews: 92, stock: 17, colors: [C.grafito, C.plata], badges: ['S Pen incluido'], date: '2026-07-14',
    summary: 'Pantalla de 10,9" y S Pen incluido para tomar notas y dibujar.',
    highlights: ['Pantalla 10,9" 90 Hz', 'S Pen incluido', 'Resistencia IP68', 'Galaxy AI'],
    specs: { Pantalla: '10,9" LCD 90 Hz', Procesador: 'Exynos 1580', Almacenamiento: '128 GB + microSD', 'Cámara trasera': '13 MP', Conectividad: 'Wi-Fi 6', Batería: '8.000 mAh', Peso: '497 g', 'Sistema operativo': 'Android 15' } },
  { id: 'p024', name: 'Tab P12 con teclado', brand: 'Lenovo', category: 'tablets', price: 1699900, oldPrice: 1999900, rating: 4.4, reviews: 58, stock: 0, colors: [C.grafito], badges: [], date: '2026-02-27',
    summary: 'Pantalla 3K de 12,7" con teclado y lápiz incluidos.',
    highlights: ['Pantalla 3K de 12,7"', 'Teclado y Tab Pen Plus incluidos', 'Cuatro parlantes JBL', 'Batería de 10.200 mAh'],
    specs: { Pantalla: '12,7" LTPS 3K', Procesador: 'MediaTek Dimensity 7050', Almacenamiento: '128 GB', 'Cámara trasera': '8 MP', Conectividad: 'Wi-Fi 6', Batería: '10.200 mAh', Peso: '615 g', 'Sistema operativo': 'Android 13' } },

  // Audio
  { id: 'p025', name: 'Audífonos WH-1000XM5', brand: 'Sony', category: 'audio', art: 'headphones', price: 1699900, oldPrice: 1999900, rating: 4.8, reviews: 402, stock: 19, colors: [C.negro, C.plata, C.azul], badges: ['Más vendido'], date: '2026-04-12',
    summary: 'La mejor cancelación de ruido de su clase y 30 horas de batería.',
    highlights: ['Cancelación de ruido líder con 8 micrófonos', 'Hasta 30 horas de batería', 'Audio de alta resolución LDAC', 'Multipunto: dos dispositivos a la vez'],
    specs: { Tipo: 'Over-ear inalámbricos', 'Cancelación de ruido': 'Sí, adaptativa', Batería: 'Hasta 30 horas', Carga: 'USB-C, 3 min = 3 h', Bluetooth: '5.2, LDAC, AAC', Peso: '250 g', Micrófonos: '8', Garantía: '1 año' } },
  { id: 'p026', name: 'AirPods Pro 2 USB-C', brand: 'Apple', category: 'audio', art: 'earbuds', price: 1199900, oldPrice: 1349900, rating: 4.7, reviews: 520, stock: 34, colors: [C.blanco], badges: [], date: '2026-05-30',
    summary: 'Cancelación activa de ruido 2x y audio espacial personalizado.',
    highlights: ['Cancelación activa de ruido', 'Modo de audio adaptativo', 'Audio espacial personalizado', 'Estuche MagSafe con USB-C'],
    specs: { Tipo: 'In-ear inalámbricos', 'Cancelación de ruido': 'Sí', Batería: '6 h (30 h con estuche)', Carga: 'USB-C, MagSafe, Qi', Bluetooth: '5.3', Resistencia: 'IP54', Chip: 'Apple H2', Garantía: '1 año' } },
  { id: 'p027', name: 'Parlante Flip 6 portátil', brand: 'JBL', category: 'audio', art: 'speaker', price: 549900, oldPrice: 649900, rating: 4.7, reviews: 860, stock: 60, colors: [C.negro, C.azul, C.naranja], badges: ['Oferta'], date: '2026-01-20',
    summary: 'Sonido potente a prueba de agua y polvo para llevar a todas partes.',
    highlights: ['Resistencia IP67', '12 horas de reproducción', 'PartyBoost para conectar varios parlantes', 'Sonido JBL Original Pro'],
    specs: { Tipo: 'Parlante portátil', Potencia: '30 W', Batería: 'Hasta 12 horas', Resistencia: 'IP67', Bluetooth: '5.1', Peso: '550 g', Carga: 'USB-C', Garantía: '1 año' } },
  { id: 'p028', name: 'Barra de sonido 3.1 Dolby Atmos', brand: 'LG', category: 'audio', art: 'soundbar', price: 1399900, oldPrice: 1799900, rating: 4.5, reviews: 77, stock: 8, colors: [C.negro], badges: [], date: '2026-06-25',
    summary: 'Cine en casa con subwoofer inalámbrico y Dolby Atmos.',
    highlights: ['Sistema 3.1 canales, 400 W', 'Dolby Atmos y DTS:X', 'Subwoofer inalámbrico', 'HDMI eARC'],
    specs: { Tipo: 'Barra de sonido', Potencia: '400 W', Canales: '3.1', Formatos: 'Dolby Atmos, DTS:X', Conectividad: 'HDMI eARC, Bluetooth, óptico', Subwoofer: 'Inalámbrico', Peso: '3,4 kg', Garantía: '1 año' } },

  // Periféricos
  { id: 'p029', name: 'Teclado mecánico K552 RGB', brand: 'Redragon', category: 'perifericos', art: 'keyboard', price: 189900, oldPrice: 229900, rating: 4.6, reviews: 980, stock: 75, colors: [C.negro, C.blanco], badges: ['Más vendido'], date: '2026-02-03',
    summary: 'Teclado TKL mecánico con switches rojos y estructura metálica.',
    highlights: ['Formato TKL 87 teclas', 'Switches mecánicos Red', 'Iluminación RGB', 'Estructura de aluminio'],
    specs: { Formato: 'TKL (87 teclas)', Switches: 'Outemu Red', Iluminación: 'RGB', Conexión: 'USB cableado', Idioma: 'Español (latinoamericano)', 'Anti-ghosting': 'Sí, 100%', Peso: '980 g', Garantía: '6 meses' } },
  { id: 'p030', name: 'Mouse inalámbrico MX Master 3S', brand: 'Logitech', category: 'perifericos', art: 'mouse', price: 459900, oldPrice: 519900, rating: 4.9, reviews: 610, stock: 41, colors: [C.grafito, C.blanco], badges: [], date: '2026-03-14',
    summary: 'El mouse de productividad definitivo con clics silenciosos.',
    highlights: ['Sensor 8000 DPI en cualquier superficie', 'Clics silenciosos', 'Rueda MagSpeed', 'Hasta 3 equipos con Easy-Switch'],
    specs: { Sensor: 'Darkfield 8000 DPI', Conexión: 'Bluetooth y Logi Bolt', Botones: '7', Batería: 'Hasta 70 días', Carga: 'USB-C', Peso: '141 g', Compatibilidad: 'Windows, macOS, Linux', Garantía: '1 año' } },
  { id: 'p031', name: 'Combo teclado y mouse MK270', brand: 'Logitech', category: 'perifericos', art: 'keyboard', price: 129900, oldPrice: null, rating: 4.5, reviews: 1320, stock: 120, colors: [C.negro], badges: [], date: '2025-11-08',
    summary: 'Combo inalámbrico confiable para el día a día.',
    highlights: ['Conexión inalámbrica 2,4 GHz', 'Teclado de tamaño completo', '8 teclas multimedia', 'Batería de larga duración'],
    specs: { Conexión: 'Receptor USB 2,4 GHz', 'Teclado': 'Tamaño completo, español', Mouse: 'Óptico 1000 DPI', Batería: 'Teclado 24 meses, mouse 12 meses', Alcance: '10 m', Compatibilidad: 'Windows, Chrome OS', Peso: '700 g', Garantía: '1 año' } },
  { id: 'p032', name: 'Mouse gamer G502 X Lightspeed', brand: 'Logitech', category: 'perifericos', art: 'mouse', price: 559900, oldPrice: 649900, rating: 4.7, reviews: 218, stock: 16, colors: [C.negro, C.blanco], badges: ['Gamer'], date: '2026-08-11',
    summary: 'Switches híbridos LIGHTFORCE y sensor HERO 25K.',
    highlights: ['Sensor HERO 25K', 'Switches ópticos-mecánicos LIGHTFORCE', '13 controles programables', 'Inalámbrico LIGHTSPEED'],
    specs: { Sensor: 'HERO 25K', Conexión: 'LIGHTSPEED inalámbrico', Botones: '13 programables', Batería: 'Hasta 130 horas', Carga: 'USB-C', Peso: '102 g', Compatibilidad: 'Windows, macOS', Garantía: '2 años' } },

  // Gaming
  { id: 'p033', name: 'Consola PlayStation 5 Slim', brand: 'Sony', category: 'gaming', art: 'console', price: 2899900, oldPrice: 3199900, rating: 4.9, reviews: 702, stock: 15, colors: [C.blanco], badges: ['Más vendido'], date: '2026-04-28',
    summary: 'Carga ultrarrápida, retroalimentación háptica y juegos en 4K.',
    highlights: ['SSD de 1 TB', 'Juegos hasta 4K y 120 fps', 'Control DualSense incluido', 'Lector de discos Blu-ray'],
    specs: { Almacenamiento: 'SSD 1 TB', Resolución: 'Hasta 4K, 120 fps', Lector: 'Blu-ray Ultra HD', Control: 'DualSense', Conectividad: 'Wi-Fi 6, Bluetooth 5.1', Puertos: 'HDMI 2.1, 2 USB-C, 2 USB-A', Garantía: '1 año' } },
  { id: 'p034', name: 'Consola Xbox Series S 1 TB', brand: 'Microsoft', category: 'gaming', art: 'console', price: 1999900, oldPrice: 2299900, rating: 4.7, reviews: 288, stock: 20, colors: [C.negro], badges: [], date: '2026-03-03',
    summary: 'Totalmente digital, compacta y con acceso a Game Pass.',
    highlights: ['SSD de 1 TB', 'Hasta 1440p y 120 fps', 'Compatible con Game Pass', 'Diseño compacto'],
    specs: { Almacenamiento: 'SSD 1 TB', Resolución: 'Hasta 1440p, 120 fps', Lector: 'Sin lector (digital)', Control: 'Control inalámbrico Xbox', Conectividad: 'Wi-Fi 5', Puertos: 'HDMI 2.1, 3 USB', Garantía: '1 año' } },
  { id: 'p035', name: 'Control DualSense inalámbrico', brand: 'Sony', category: 'gaming', art: 'gamepad', price: 349900, oldPrice: 399900, rating: 4.8, reviews: 455, stock: 48, colors: [C.blanco, C.negro, C.azul], badges: [], date: '2026-02-19',
    summary: 'Retroalimentación háptica y gatillos adaptables.',
    highlights: ['Retroalimentación háptica', 'Gatillos adaptables', 'Micrófono integrado', 'Carga USB-C'],
    specs: { Compatibilidad: 'PS5, PC', Conexión: 'Bluetooth, USB-C', Batería: 'Hasta 12 horas', Audio: 'Jack 3,5 mm, micrófono', Peso: '280 g', Garantía: '1 año' } },

  // Smartwatches
  { id: 'p036', name: 'Galaxy Watch7 44 mm', brand: 'Samsung', category: 'smartwatches', art: 'watch', price: 1199900, oldPrice: 1499900, rating: 4.5, reviews: 134, stock: 23, colors: [C.verde, C.plata], badges: [], date: '2026-07-09',
    summary: 'Monitoreo de salud avanzado con Galaxy AI.',
    highlights: ['Pantalla Super AMOLED', 'Sensor BioActive', 'GPS de doble frecuencia', 'Resistencia 5 ATM + IP68'],
    specs: { Pantalla: '1,5" Super AMOLED', Caja: '44 mm aluminio', Sensores: 'Ritmo cardíaco, ECG, SpO2', Batería: 'Hasta 40 horas', Resistencia: '5 ATM + IP68', Conectividad: 'Bluetooth 5.3, Wi-Fi, NFC', Compatibilidad: 'Android', Garantía: '1 año' } },
  { id: 'p037', name: 'Apple Watch Series 10 42 mm', brand: 'Apple', category: 'smartwatches', art: 'watch', price: 2199900, oldPrice: null, rating: 4.8, reviews: 210, stock: 11, colors: [C.negro, C.plata, C.rosa], badges: ['Nuevo'], date: '2026-09-25',
    summary: 'La pantalla más grande y el diseño más delgado de Apple Watch.',
    highlights: ['Pantalla OLED gran angular', 'Detección de apnea del sueño', 'Carga más rápida', 'Resistente al agua hasta 50 m'],
    specs: { Pantalla: 'OLED LTPO3 siempre activa', Caja: '42 mm aluminio', Sensores: 'ECG, ritmo cardíaco, temperatura', Batería: 'Hasta 18 horas', Resistencia: 'WR50', Conectividad: 'GPS, Bluetooth 5.3, Wi-Fi', Compatibilidad: 'iPhone', Garantía: '1 año' } },
  { id: 'p038', name: 'Smart Band 9', brand: 'Xiaomi', category: 'smartwatches', art: 'band', price: 199900, oldPrice: 249900, rating: 4.4, reviews: 870, stock: 90, colors: [C.negro, C.rosa, C.azul], badges: ['Oferta'], date: '2026-01-30',
    summary: 'Hasta 21 días de batería y más de 150 modos deportivos.',
    highlights: ['AMOLED 1,62"', 'Hasta 21 días de batería', '150+ modos deportivos', 'Resistencia 5 ATM'],
    specs: { Pantalla: '1,62" AMOLED', Caja: 'Aluminio', Sensores: 'Ritmo cardíaco, SpO2, sueño', Batería: 'Hasta 21 días', Resistencia: '5 ATM', Conectividad: 'Bluetooth 5.4', Compatibilidad: 'Android, iOS', Garantía: '1 año' } },

  // Cámaras
  { id: 'p039', name: 'Cámara mirrorless Alpha a6400 + lente', brand: 'Sony', category: 'camaras', art: 'camera', price: 4599900, oldPrice: 4999900, rating: 4.8, reviews: 98, stock: 6, colors: [C.negro], badges: [], date: '2026-05-05',
    summary: 'Autoenfoque en tiempo real y video 4K en un cuerpo compacto.',
    highlights: ['Sensor APS-C de 24,2 MP', 'Real-time Eye AF', 'Video 4K HDR', 'Lente 16-50 mm incluido'],
    specs: { Sensor: 'APS-C Exmor 24,2 MP', Video: '4K 30p, Full HD 120p', Enfoque: '425 puntos híbridos', Pantalla: '3" táctil abatible 180°', Lente: 'E PZ 16-50 mm', Conectividad: 'Wi-Fi, Bluetooth, NFC', Peso: '403 g (cuerpo)', Garantía: '1 año' } },
  { id: 'p040', name: 'Cámara de acción HERO13 Black', brand: 'GoPro', category: 'camaras', art: 'actioncam', price: 2099900, oldPrice: 2399900, rating: 4.6, reviews: 141, stock: 14, colors: [C.negro], badges: [], date: '2026-08-20',
    summary: 'Video 5,3K, estabilización HyperSmooth 6.0 y sumergible a 10 m.',
    highlights: ['Video 5,3K a 60 fps', 'Estabilización HyperSmooth 6.0', 'Sumergible hasta 10 m', 'Batería Enduro mejorada'],
    specs: { Sensor: '27 MP', Video: '5,3K 60p, 4K 120p', Estabilización: 'HyperSmooth 6.0', Pantalla: 'Frontal y trasera', Resistencia: 'Sumergible 10 m', Conectividad: 'Wi-Fi, Bluetooth', Peso: '159 g', Garantía: '1 año' } },

  // Redes
  { id: 'p041', name: 'Router Wi-Fi 6 Archer AX55', brand: 'TP-Link', category: 'redes', art: 'router', price: 359900, oldPrice: 429900, rating: 4.6, reviews: 389, stock: 37, colors: [C.negro], badges: [], date: '2026-02-08',
    summary: 'Wi-Fi 6 de doble banda hasta 3 Gbps para toda la casa.',
    highlights: ['Wi-Fi 6 AX3000', 'OFDMA y MU-MIMO', '4 antenas de alto rendimiento', 'Compatible con EasyMesh'],
    specs: { Estándar: 'Wi-Fi 6 (802.11ax)', Velocidad: 'Hasta 3000 Mbps', Bandas: '2,4 GHz y 5 GHz', Antenas: '4 externas', Puertos: '1 WAN + 4 LAN Gigabit', Seguridad: 'WPA3', Garantía: '2 años' } },
  { id: 'p042', name: 'Sistema Wi-Fi Mesh Deco X20 (3 unidades)', brand: 'TP-Link', category: 'redes', art: 'mesh', price: 899900, oldPrice: 1099900, rating: 4.7, reviews: 164, stock: 12, colors: [C.blanco], badges: ['Oferta'], date: '2026-06-06',
    summary: 'Cobertura sin zonas muertas en casas de hasta 550 m².',
    highlights: ['Wi-Fi 6 AX1800', 'Cobertura hasta 550 m²', 'Hasta 150 dispositivos', 'Control parental y antivirus'],
    specs: { Estándar: 'Wi-Fi 6 (802.11ax)', Velocidad: 'Hasta 1800 Mbps', Unidades: '3', Cobertura: 'Hasta 550 m²', Puertos: '2 Gigabit por unidad', Seguridad: 'WPA3, HomeShield', Garantía: '2 años' } },
]

const categoryArt = Object.fromEntries(categories.map((c) => [c.id, c.art]))

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/["”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function buildProduct(raw) {
  const category = categories.find((c) => c.id === raw.category)
  return {
    ...raw,
    slug: `${slugify(raw.brand)}-${slugify(raw.name)}`,
    sku: `SIEV-${raw.id.slice(1).padStart(5, '0')}`,
    art: raw.art ?? categoryArt[raw.category],
    categoryName: category.name,
    options: raw.options ?? null,
    description: `${raw.summary} ${raw.name} de ${raw.brand} combina calidad de construcción, rendimiento confiable y el respaldo de garantía oficial. Todos nuestros productos son nuevos, sellados y cuentan con factura electrónica.`,
    oldPrice: raw.oldPrice ?? null,
  }
}

export const products = rawProducts.map(buildProduct)

export const brands = [...new Set(products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, 'es'))

export const coupons = {
  SIEV10: { code: 'SIEV10', label: '10 % de descuento (máx. $200.000)', type: 'percent', value: 10, max: 200000 },
  BIENVENIDO: { code: 'BIENVENIDO', label: '$50.000 en compras desde $500.000', type: 'fixed', value: 50000, min: 500000 },
  ENVIOGRATIS: { code: 'ENVIOGRATIS', label: 'Envío gratis en tu pedido', type: 'shipping' },
}

export const shippingRules = {
  freeFrom: 299900,
  standard: 14900,
  express: 29900,
}

export const cities = ['Cali', 'Bogotá', 'Medellín', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales', 'Palmira', 'Tuluá', 'Buga', 'Popayán', 'Pasto', 'Armenia', 'Ibagué', 'Neiva', 'Santa Marta', 'Villavicencio']
