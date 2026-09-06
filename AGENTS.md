# AGENTS.md

PWA "Nivel de Burbuja": nivel de burbuja con sensor de orientación. Vue 3 (JS, sin TS) + Bootstrap 5.3 (Sass) + Vite 8 + `vite-plugin-pwa`.

## Estándares de código (obligatorios)
- **Clean Code**: nombres descriptivos, código legible y sin comentarios salvo que se pidan.
- **DRY**: no duplicar lógica; extraer a composables/`utils`/servicios cuando se reutilice.
- **SOLID**: componentes y módulos con responsabilidad única; componer, no heredar.
- **KISS**: la solución más simple que cumpla el requisito; evitar sobre-ingeniería.
- **Clean Architecture**: separación de capas (UI → componentes, dominio → lógica de negocio, datos → servicios/sensores); flujo de datos unidireccional de la UI hacia el dominio.

## Proceso de trabajo (obligatorio)
Cada tarea debe seguir el ciclo completo en orden, sin saltarse pasos:
1. **Planeación**: definir alcance y diseño en `PLAN.md` antes de escribir código.
2. **Codificación**: implementar cumpliendo los estándares de la sección anterior y los archivos ya definidos en el plan.
3. **Pruebas**: verificar con `npm run build` (única verificación disponible; no hay tests ni lint) y probar contra los requerimientos del plan.
4. **Despliegue**: cuando el usuario lo pida, commitear y pushear a `main` para disparar el deploy automático a GitHub Pages.

## Comandos
- `npm run dev` — dev server. IMPORTANTE: con `base: '/nivel/'`, se sirve en `http://localhost:5173/nivel/` (no en la raíz).
- `npm run build` — genera `dist/` + `sw.js` + manifest. Es la única verificación (no hay tests ni lint).
- `npm run preview` — sirve el build en `http://localhost:4173/nivel/`.
- `node scripts/gen-icon.mjs` — regenera los iconos placeholder en `public/icons/` (PNG puro, sin deps). Son placeholders; reemplazables por un logo real (actualizar manifest en `vite.config.js`).

## Deploy
- Push a `main` dispara `.github/workflows/deploy.yml`: `npm ci` → `npm run build` → deploy a GitHub Pages (`https://itimanuelmt.github.io/nivel/`).
- Mantén `package-lock.json` commiteado (el workflow usa `npm ci`).
- `base: '/nivel/'` en `vite.config.js` es obligatorio para que assets/sw/manifest resuelvan en Pages; no cambiarlo.

## Arquitectura (estado actual)
- Solo existe el scaffold: `src/main.js`, `src/App.vue`, `src/registerSW.js`, `src/styles/custom.scss`. El resto está previsto en `PLAN.md` (fase 2 en adelante), aún no implementado.
- Bootstrap se importa por Sass en `src/styles/custom.scss` (variables antes del import). Los warnings de deprecación de Sass (`@import`, `if()`) vienen de Bootstrap 5.3: son ruido, no arreglarlos.
- `src/registerSW.js` usa el virtual `virtual:pwa-register`; `registerType: 'autoUpdate'`.
- Invariantes planificadas (PLAN.md): sensor `deviceorientation` (iOS exige HTTPS + gesto de usuario con `requestPermission()`); simulador de tilt gated por `import.meta.env.DEV` (no debe salir en build).

## Entorno
- Windows/Laragon. La app corre con Vite, no Apache; el `dist/` también se puede servir desde Apache/Laragon respetando el base `/nivel/`.
- Detalle de sensor: `deviceorientation` requiere contexto seguro (HTTPS); en desarrollo `localhost` cuenta como seguro.