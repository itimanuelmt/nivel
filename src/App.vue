<script setup>
const version = '0.1.0'
</script>

<template>
  <div class="d-flex flex-column align-items-center justify-content-center vh-100 text-center px-3">
    <div
      class="rounded-circle d-flex align-items-center justify-content-center text-white fs-1 fw-bold mb-4"
      style="width: 96px; height: 96px; background: radial-gradient(circle at 35% 30%, #3dd6a8, #20c997);"
    >
      N
    </div>
    <h1 class="display-6 fw-semibold text-white mb-2">Nivel de Burbuja</h1>
    <p class="lead text-secondary-emphasis mb-4">Fase 1 · Scaffold Vue 3 + Bootstrap 5 + PWA</p>
    <button class="btn btn-outline-light btn-lg rounded-pill px-4" type="button">Empezar</button>
    <span class="small text-secondary-emphasis mt-4">v{{ version }}</span>
  </div>
</template>