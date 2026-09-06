<script setup>
import { computed } from 'vue'

const props = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  tolerance: { type: Number, default: 0.5 },
  level: { type: Boolean, default: false },
  plomada: { type: Boolean, default: false }
})

const MAX_DEGREES = 10
const GRID_RADIUS = 90
const DOT_RADIUS = 10

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function degreesToOffset(degrees) {
  return clamp(degrees / MAX_DEGREES, -1, 1) * (GRID_RADIUS - DOT_RADIUS)
}

const dotStyle = computed(() => ({
  '--ox': `${degreesToOffset(props.x)}px`,
  '--oy': `${degreesToOffset(props.y)}px`
}))

const format = (value) => value.toFixed(1)

const okX = computed(() => Math.abs(props.x) <= props.tolerance)
const okY = computed(() => Math.abs(props.y) <= props.tolerance)
</script>

<template>
  <div class="digital d-flex flex-column align-items-center gap-3">
    <div class="grid" :class="{ level }">
      <span class="line line-x" />
      <span class="line line-y" />
      <span class="dot" :style="dotStyle" />
    </div>

    <div class="readouts d-flex gap-2 w-100">
      <div v-if="!plomada" class="card flex-fill text-center" :class="okX ? 'ok' : ''">
        <div class="card-body py-2">
          <div class="small text-secondary-emphasis">Inclinación X</div>
          <div class="readout-value display-6 fw-semibold lh-1">{{ format(x) }}°</div>
        </div>
      </div>
      <div class="card flex-fill text-center" :class="okY ? 'ok' : ''">
        <div class="card-body py-2">
          <div class="small text-secondary-emphasis">{{ plomada ? 'Desviación vertical' : 'Inclinación Y' }}</div>
          <div class="readout-value display-6 fw-semibold lh-1">{{ format(plomada ? Math.abs(y) : y) }}°</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  position: relative;
  width: 200px;
  height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(32, 201, 151, 0.08), rgba(9, 12, 14, 0.6) 72%);
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.55);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.grid.level {
  border-color: rgba(32, 201, 151, 0.8);
  box-shadow: 0 0 28px rgba(32, 201, 151, 0.4);
}

.line {
  position: absolute;
  background: rgba(255, 255, 255, 0.28);
}

.line-x {
  top: 50%;
  left: 8%;
  width: 84%;
  height: 1px;
}

.line-y {
  top: 8%;
  left: 50%;
  width: 1px;
  height: 84%;
}

.dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px;
  border-radius: 50%;
  background: radial-gradient(circle at 33% 28%, #ffffff, #cdf7e5 46%, #8ee9c5 82%);
  box-shadow: 0 0 16px rgba(142, 233, 197, 0.55);
  transform: translate3d(var(--ox), var(--oy), 0);
  transition: transform 0.12s ease-out;
  will-change: transform;
}

.card {
  background: var(--app-surface);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.readout-value {
  font-family: var(--app-mono);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.card .readout-value {
  color: #f8f9fa;
}

.card.ok {
  border-color: rgba(52, 211, 153, 0.7);
  background: rgba(52, 211, 153, 0.12);
}

.card.ok .readout-value {
  color: var(--app-accent);
}
</style>