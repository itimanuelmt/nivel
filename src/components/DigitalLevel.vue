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
const GRID_RADIUS = 86
const DOT_RADIUS = 11

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function degreesToOffset(degrees) {
  return clamp(degrees / MAX_DEGREES, -1, 1) * (GRID_RADIUS - DOT_RADIUS)
}

const deviation = computed(() =>
  props.plomada ? Math.abs(props.y) : Math.hypot(props.x, props.y)
)

const ok = computed(() => deviation.value <= props.tolerance)

const dotTransform = computed(() => {
  const ox = props.plomada ? 0 : degreesToOffset(props.x)
  const oy = degreesToOffset(props.y)
  return `translate(${ox}px, ${oy}px)`
})

const format = (value) => value.toFixed(1)
const displayValue = computed(() => (props.plomada ? Math.abs(props.y) : deviation.value))
const label = computed(() => (props.plomada ? 'Desviación vertical' : 'Desviación'))
</script>

<template>
  <div class="digital d-flex flex-column align-items-center gap-3">
    <div class="grid-frame" :class="{ level }">
      <div class="grid-glass">
        <div class="liquid" />
        <svg class="graduations" viewBox="0 0 200 200" aria-hidden="true">
          <circle class="g-ring" cx="100" cy="100" r="92" />
          <circle class="g-ring g-ring-inner" cx="100" cy="100" r="40" />
          <g class="g-ticks">
            <line x1="100" y1="8" x2="100" y2="16" transform="rotate(0 100 100)" />
            <line x1="100" y1="8" x2="100" y2="16" transform="rotate(45 100 100)" />
            <line x1="100" y1="8" x2="100" y2="16" transform="rotate(90 100 100)" />
            <line x1="100" y1="8" x2="100" y2="16" transform="rotate(135 100 100)" />
            <line x1="100" y1="8" x2="100" y2="16" transform="rotate(180 100 100)" />
            <line x1="100" y1="8" x2="100" y2="16" transform="rotate(225 100 100)" />
            <line x1="100" y1="8" x2="100" y2="16" transform="rotate(270 100 100)" />
            <line x1="100" y1="8" x2="100" y2="16" transform="rotate(315 100 100)" />
          </g>
          <line class="g-axis g-axis-h" x1="14" y1="100" x2="186" y2="100" />
          <line class="g-axis g-axis-v" x1="100" y1="14" x2="100" y2="186" />
          <circle class="g-center" cx="100" cy="100" r="3" />
        </svg>
        <span class="dot" :style="{ transform: dotTransform }"><span class="dot-sheen" /></span>
        <span class="glass-glint" />
      </div>
    </div>

    <div class="readout w-100">
      <div class="card text-center" :class="ok ? 'ok' : ''">
        <div class="card-body py-2">
          <div class="small text-secondary-emphasis">{{ label }}</div>
          <div class="readout-value display-6 fw-semibold lh-1">{{ format(displayValue) }}°</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.digital {
  user-select: none;
}

.grid-frame {
  position: relative;
  width: 236px;
  height: 236px;
  border-radius: 50%;
  padding: 16px;
  background: radial-gradient(circle at 30% 25%, #3a4146 0%, #22272b 45%, #101314 100%);
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.18),
    inset 0 -6px 12px rgba(0, 0, 0, 0.7),
    0 14px 32px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  transition: box-shadow 0.3s ease;
}

.grid-frame.level {
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.18),
    inset 0 -6px 12px rgba(0, 0, 0, 0.7),
    0 14px 32px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 0 38px rgba(52, 211, 153, 0.55);
}

.grid-glass {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(circle at 30% 22%, rgba(255, 255, 255, 0.2), transparent 48%);
  box-shadow:
    inset 0 0 22px rgba(0, 0, 0, 0.5),
    inset 0 0 5px rgba(255, 255, 255, 0.16);
}

.liquid {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    radial-gradient(circle at 38% 32%, rgba(96, 165, 250, 0.4), transparent 55%),
    radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.5) 0%, rgba(16, 122, 87, 0.7) 70%, rgba(10, 82, 68, 0.8) 100%);
}

.graduations {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.g-ring {
  fill: none;
  stroke: rgba(255, 255, 255, 0.45);
  stroke-width: 1.3;
}

.g-ring-inner {
  stroke: rgba(255, 255, 255, 0.4);
  stroke-width: 1.2;
}

.g-ticks line {
  stroke: rgba(255, 255, 255, 0.5);
  stroke-width: 2;
}

.g-ticks line:nth-child(2n) {
  stroke-width: 2.8;
}

.g-axis {
  stroke: rgba(255, 255, 255, 0.32);
  stroke-width: 1;
}

.g-center {
  fill: rgba(255, 255, 255, 0.7);
}

.dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 22px;
  height: 22px;
  margin: -11px 0 0 -11px;
  border-radius: 50%;
  background: radial-gradient(circle at 34% 30%, #ffffff 0%, #d9fff0 42%, #9fe8cd 80%);
  box-shadow:
    inset 0 -2px 5px rgba(34, 120, 96, 0.4),
    inset 0 3px 6px rgba(255, 255, 255, 0.9),
    0 1px 4px rgba(0, 0, 0, 0.4),
    0 0 18px rgba(255, 255, 255, 0.25);
  transition: transform 0.12s ease-out;
  will-change: transform;
}

.dot-sheen {
  position: absolute;
  top: 12%;
  left: 18%;
  width: 40%;
  height: 36%;
  border-radius: 50%;
  background: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.1));
  transform: rotate(-18deg);
}

.grid-frame.level .dot {
  box-shadow:
    inset 0 -2px 5px rgba(34, 120, 96, 0.4),
    inset 0 3px 6px rgba(255, 255, 255, 0.9),
    0 1px 4px rgba(0, 0, 0, 0.4),
    0 0 26px rgba(110, 231, 183, 0.9);
}

.glass-glint {
  position: absolute;
  top: 5%;
  left: 8%;
  width: 50%;
  height: 18%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  filter: blur(1px);
  transform: rotate(-12deg);
  pointer-events: none;
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
