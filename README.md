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

## Landing institucional

- `src/data/institutional.js`: textos, servicios, proyectos y contactos de ejemplo.
- `src/components/ContactForm.jsx`: validación y envío simulado del formulario.
- `src/assets/LogoSIEV.png`: identidad visual suministrada.
- `src/index.css`: colores `principal` y `secundario`, estilos y adaptación móvil.

El portafolio contiene ilustraciones conceptuales; no representa obras ejecutadas. El formulario no transmite ni almacena datos. Para producción: reemplazar el contenido mock, verificar contactos, integrar el endpoint de envío y su manejo de errores, incorporar la política de tratamiento de datos aprobada y conectar el inicio de sesión. El botón de acceso abre por ahora un aviso informativo.
