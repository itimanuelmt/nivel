<script setup>
import { computed } from 'vue'

const props = defineProps({
  mode: { type: String, required: true },
  offsets: { type: Object, required: true },
  enabled: { type: Boolean, default: false }
})

const emit = defineEmits(['zero', 'reset'])

const current = computed(() => props.offsets[props.mode] ?? null)
const isCalibrated = computed(() => current.value !== null)
</script>

<template>
  <div class="calibration-control d-flex align-items-center justify-content-between gap-2">
    <span class="small text-secondary-emphasis">
      <template v-if="isCalibrated">Calibrado</template>
      <template v-else>Sin calibrar</template>
    </span>
    <div class="btn-group btn-group-sm">
      <button
        class="btn btn-outline-warning"
        type="button"
        :disabled="!enabled"
        @click="emit('zero')"
      >
        Poner a cero
      </button>
      <button
        class="btn btn-outline-secondary"
        type="button"
        :disabled="!enabled || !isCalibrated"
        @click="emit('reset')"
      >
        Restablecer
      </button>
    </div>
  </div>
</template>