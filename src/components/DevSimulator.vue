<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  simulate: { type: Function, required: true }
})

const alpha = ref(0)
const beta = ref(0)
const gamma = ref(0)

watch([alpha, beta, gamma], () => {
  props.simulate({ alpha: alpha.value, beta: beta.value, gamma: gamma.value })
}, { immediate: true })

function resetSimulation() {
  alpha.value = 0
  beta.value = 0
  gamma.value = 0
}
</script>

<template>
  <div class="card border-secondary">
    <div class="card-body py-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="card-title mb-0 small fw-semibold">Simulador (solo desarrollo)</h6>
        <button class="btn btn-sm btn-outline-secondary" type="button" @click="resetSimulation">
          Nivelar
        </button>
      </div>
      <div class="mb-2">
        <label class="form-label small text-secondary-emphasis" for="sim-beta">
          Beta (inclinación frontal) · {{ beta.toFixed(1) }}°
        </label>
        <input
          id="sim-beta"
          class="form-range"
          type="range"
          min="-90"
          max="90"
          step="0.1"
          v-model.number="beta"
        />
      </div>
      <div>
        <label class="form-label small text-secondary-emphasis" for="sim-gamma">
          Gamma (inclinación lateral) · {{ gamma.toFixed(1) }}°
        </label>
        <input
          id="sim-gamma"
          class="form-range"
          type="range"
          min="-90"
          max="90"
          step="0.1"
          v-model.number="gamma"
        />
      </div>
    </div>
  </div>
</template>