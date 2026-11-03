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
- `src/App.jsx`: enrutador principal: landing en `/` y marketplace en `/tienda`.
- `src/LandingPage.jsx`: página institucional.
- `src/index.css`: estilos globales e importación de Tailwind.
- `vite.config.js`: plugins de React y Tailwind.

Tailwind se integra mediante `@tailwindcss/vite` y `@import 'tailwindcss';`. La configuración inicial no necesita `tailwind.config.js` ni PostCSS.

## Alcance del proyecto

Portal público y catálogo digital, gestión comercial y cotizaciones, inventario y materiales, seguimiento de proyectos y control del flujo de caja. Esta base aún no implementa los módulos ni la conexión al backend.

## Landing institucional

- `src/data/institutional.js`: información institucional, servicios, clientes y contactos suministrados; proyectos conceptuales de ejemplo.
- `src/components/ContactForm.jsx`: validación y preparación del mensaje para WhatsApp.
- `src/assets/LogoSIEV.png`: identidad visual suministrada.
- `src/index.css`: colores `principal` y `secundario`, estilos y adaptación móvil.

El portafolio contiene ilustraciones conceptuales; no representa obras ejecutadas. El formulario valida nombre, detalle de la necesidad y teléfono opcional, y abre WhatsApp al +57 318 309 0738 con el mensaje codificado. El visitante debe confirmar el envío en WhatsApp; el sitio no almacena solicitudes ni envía mensajes automáticamente. Si la nueva pestaña no se abre, se muestra un enlace alternativo. El botón de acceso dirige al formulario de autenticación de demostración. Pendientes: proyectos y fotografías reales, política de tratamiento de datos aprobada y autenticación real con backend.
## Marketplace

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

En producción, el servidor debe redirigir las rutas de la aplicación a `index.html` para permitir abrir directamente `/tienda/catalogo` y las demás rutas de React Router.

## Autenticación de demostración

- `/login`: inicio de sesión con usuario y contraseña.
- `/registro`: registro con nombre, usuario, correo, contraseña y confirmación.
- `/cuenta`: perfil de la sesión; redirige al login si no se ha iniciado sesión.
- Cuenta pública de prueba: usuario `demo.siev`, contraseña `SievDemo2026!`.

El registro y las credenciales viven exclusivamente en memoria y se pierden al recargar. La contraseña se transforma con PBKDF2 y un salt aleatorio para compararla durante la demostración; no se guarda en localStorage ni sessionStorage. No se envían correos ni se verifica su titularidad. La sesión solo representa el estado de la interfaz y no protege recursos del servidor. No usar credenciales reales.

`src/auth/authService.js` contiene el adaptador que debe reemplazarse al integrar el backend. La autenticación real debe validar credenciales y permisos en el servidor, verificar el correo y proporcionar la sesión; el frontend no asigna roles ni acceso al sistema interno. La tienda sigue conservando sus datos de ejemplo localmente, sin asociarlos a una cuenta real.
