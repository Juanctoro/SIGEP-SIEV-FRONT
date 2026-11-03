# SIGEP-SIEV — Frontend

Sistema de Información y Gestión de Proyectos Eléctricos de Soluciones Integrales Eléctricas del Valle S.A.S.

Base con React, Vite y Tailwind CSS, usando JavaScript.

## Requisitos

Node.js 22.12 o superior (recomendado: Node.js 24 LTS) y npm.

## Desarrollo local

```bash
npm ci
npm run dev
```

Abre la dirección que muestre Vite en la terminal.

## Comandos

- `npm run dev`: servidor de desarrollo con recarga automática.
- `npm run build`: genera la versión de producción en `dist/`.
- `npm run preview`: previsualiza la compilación de producción.
- `npm run lint`: revisa el código con Oxlint.

## Estructura inicial

- `src/main.jsx`: entrada de React.
- `src/App.jsx`: componente principal.
- `src/index.css`: estilos globales e importación de Tailwind.
- `vite.config.js`: plugins de React y Tailwind.

Tailwind se integra mediante `@tailwindcss/vite` y `@import 'tailwindcss';`. La configuración inicial no necesita `tailwind.config.js` ni PostCSS.

## Alcance del proyecto

Portal público y catálogo digital, gestión comercial y cotizaciones, inventario y materiales, seguimiento de proyectos y control del flujo de caja. Esta base aún no implementa los módulos ni la conexión al backend.

## Marketplace (rama `feat/market-mock`)

Tienda de tecnología en `/tienda`, funcionando solo en el frontend con datos de demostración:

- Inicio con destacados, categorías, ofertas del día y novedades.
- Catálogo con búsqueda, filtros (categoría, marca, precio, calificación, disponibilidad, ofertas), orden, paginación y vista en cuadrícula o lista. Los filtros viven en la URL.
- Detalle de producto con galería, colores, opciones de almacenamiento, especificaciones y reseñas.
- Carrito (panel lateral y página), cupones de prueba (`SIEV10`, `BIENVENIDO`, `ENVIOGRATIS`) y envío gratis desde $299.900.
- Listas: Favoritos y listas personalizadas (crear, renombrar, eliminar, agregar todo al carrito).
- Checkout en tres pasos (envío, pago y confirmación) e historial de pedidos.

Carrito, listas, pedidos y reseñas se guardan en `localStorage`. El inicio de sesión queda pendiente del módulo de autenticación.

### Estructura

- `src/market/data/`: catálogo, marcas, cupones y reseñas de ejemplo.
- `src/market/services/catalogService.js`: única capa de acceso a datos. Cada función indica el endpoint esperado; para conectar el backend se reemplaza su cuerpo por la petición HTTP y se conserva la forma de la respuesta.
- `src/market/context/StoreContext.jsx`: estado del carrito, listas, pedidos y notificaciones.
- `src/market/components/` y `src/market/pages/`: componentes y vistas.

Las imágenes de producto son ilustraciones vectoriales (`ProductArt`) que deben reemplazarse por fotos reales cuando el backend las entregue.
