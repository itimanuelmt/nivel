# Plan — PWA "Nivel de Burbuja" (Vue 3 + Bootstrap 5)

## Alcance confirmado
- **Modos**: nivel horizontal (2 ejes, celular plano) + plomada vertical (celular contra pared), con toggle.
- **Visual**: vista clásica de burbuja y vista digital, conmutable.
- **Extras**: grados numéricos X/Y (1 decimal), vibración al nivelar, tolerancia configurable (0.1°–2°, default 0.5°), calibración/offset persistente.
- **Idioma UI**: español.
- **Probado en celular real + HTTPS** (Laragon Auto SSL / túnel HTTPS).
- **Stack**: Vue 3 (Composition API, JavaScript puro, sin TypeScript) + Bootstrap 5.3 (Sass) + Vite + `vite-plugin-pwa`.

## Arquitectura

### Sensores (`src/composables/useOrientation.js`)
- `deviceorientation` → matriz de rotación (Euler α/β/γ) → vector de gravedad en ejes del dispositivo → `tiltX`/`tiltY` en grados.
- Independiente de la orientación física (portrait/landscape).
- iOS: botón "Activar sensor" que dispara `DeviceOrientationEvent.requestPermission()` (requiere gesto de usuario).
- Estado: `unsupported | idle | running` + manejo de errores.

### Cálculo (`src/utils/geometry.js`)
- Euler → matriz DCM → tilt en grados.
- En modo plomada se mide la inclinación respecto al eje Y (gravedad alineada con "arriba"); el mismo sensor alimenta ambos modos.

### Calibración (`src/composables/useCalibration.js`)
- Offset X/Y persistido en `localStorage`.
- Botones "Poner a cero" y "Restablecer".

### Háptica (`src/services/haptics.js`)
- `navigator.vibrate([60, 40, 60])` cuando `|tilt| <= tolerancia`, con umbral anti-repetición.

### UI (componentes)
- `LevelView` — contenedor: toggle de modo, toggle de vista, tolerancia, calibración.
- `BubbleLevel` — burbuja CSS/SVG sobre ampolla circular (X/Y) + ampolla vertical en modo plomada.
- `DigitalLevel` — crosshair, grados Y/X, card verde cuando está a nivel.
- `ToleranceControl` — slider de tolerancia.
- `CalibrationControl` — offset poner a cero / restablecer.
- `DevSimulator` — sliders de tilt para probar sin sensor (solo `import.meta.env.DEV`, excluido del build).

## Estructura del proyecto
```
nivel_burbuja/
├─ index.html
├─ vite.config.js            # vite + vite-plugin-pwa
├─ package.json
├─ PLAN.md
├─ public/icons/             # iconos placeholder (SVG → PNG 192/512/maskable)
├─ src/
│  ├─ main.js                # bootstrap.scss customizado + bootstrap.bundle.js
│  ├─ App.vue
│  ├─ registerSW.js
│  ├─ styles/custom.scss     # override de variables Bootstrap 5.3 + estilos burbuja
│  ├─ composables/
│  │  ├─ useOrientation.js
│  │  └─ useCalibration.js
│  ├─ services/
│  │  └─ haptics.js
│  ├─ utils/
│  │  └─ geometry.js
│  └─ components/
│     ├─ LevelView.vue
│     ├─ BubbleLevel.vue
│     ├─ DigitalLevel.vue
│     ├─ ToleranceControl.vue
│     ├─ CalibrationControl.vue
│     └─ DevSimulator.vue
```

## Bootstrap y PWA
- Bootstrap 5.3 vía Sass oficial (`bootstrap/scss` con variables sobreescritas antes del import) + `bootstrap.bundle.min.js`.
- PWA: `vite-plugin-pwa`, `registerType: 'autoUpdate'`, manifest con `lang: 'es'`, `display: 'standalone'`, theme color, cache offline total.
- Iconos placeholder mínimos (SVG simple → PNG) para manifest válido e instalable; reemplazables con logo propio más adelante.

## Cómo probar en celular real (HTTPS)
1. Dev local: `npm run dev` en `localhost:5173` (contexto seguro).
2. Test real: `npm run build` + `npm run preview` + túnel HTTPS (`cloudflared tunnel --url http://localhost:4173` o "Share" de Laragon) → abrir URL en celular → iOS: tap "Activar sensor".
3. Alternativa producción: servir `dist/` desde Apache de Laragon con Auto SSL.

## Verificación
- `npm run build` sin errores y service worker generado.
- Preview local: modos, toggle, tolerancia, vibración y calibración (con DevSimulator).
- Prueba manual en celular por túnel HTTPS.

## Pasos de implementación
1. Scaffold Vite + Vue 3 + Bootstrap (Sass) en `C:\laragon\www\nivel_burbuja`.
2. `geometry.js` + `useOrientation` (con permiso iOS).
3. `useCalibration` + `haptics.js`.
4. Componentes UI (modo, vista, tolerancia, calibración, simulador).
5. Config PWA + iconos placeholder.
6. Build, preview y scripts de prueba por túnel HTTPS.