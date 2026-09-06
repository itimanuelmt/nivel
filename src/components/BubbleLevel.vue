<script setup>
import { computed } from 'vue'

const props = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  level: { type: Boolean, default: false },
  plomada: { type: Boolean, default: false }
})

const MAX_DEGREES = 10
const VIAL_RADIUS = 130
const VIAL_VIEWBOX = 260
const BUBBLE_RADIUS = 30

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function degreesToOffset(degrees) {
  return clamp(degrees / MAX_DEGREES, -1, 1) * (VIAL_RADIUS - BUBBLE_RADIUS)
}

const bubbleTransform = computed(() => {
  const ox = props.plomada ? 0 : degreesToOffset(props.x)
  const oy = props.plomada ? degreesToOffset(props.y) : 0
  return `translate(${ox}px, ${oy}px)`
})
</script>

<template>
  <div class="spirit-level d-flex flex-column align-items-center">
    <div class="vial-frame" :class="{ level }">
      <div class="vial-glass">
        <div class="liquid" />
        <svg class="graduations" viewBox="0 0 260 260" aria-hidden="true">
          <circle class="g-ring" cx="130" cy="130" r="118" />
          <circle class="g-ring g-ring-mid" cx="130" cy="130" r="66" />
          <circle class="g-ring g-ring-inner" cx="130" cy="130" r="24" />
          <g class="g-ticks">
            <line x1="130" y1="12" x2="130" y2="22" transform="rotate(0 130 130)" />
            <line x1="130" y1="12" x2="130" y2="22" transform="rotate(30 130 130)" />
            <line x1="130" y1="12" x2="130" y2="22" transform="rotate(60 130 130)" />
            <line x1="130" y1="12" x2="130" y2="22" transform="rotate(90 130 130)" />
            <line x1="130" y1="12" x2="130" y2="22" transform="rotate(120 130 130)" />
            <line x1="130" y1="12" x2="130" y2="22" transform="rotate(150 130 130)" />
            <line x1="130" y1="12" x2="130" y2="22" transform="rotate(180 130 130)" />
            <line x1="130" y1="12" x2="130" y2="22" transform="rotate(210 130 130)" />
            <line x1="130" y1="12" x2="130" y2="22" transform="rotate(240 130 130)" />
            <line x1="130" y1="12" x2="130" y2="22" transform="rotate(270 130 130)" />
            <line x1="130" y1="12" x2="130" y2="22" transform="rotate(300 130 130)" />
            <line x1="130" y1="12" x2="130" y2="22" transform="rotate(330 130 130)" />
          </g>
          <line class="g-axis g-axis-h" x1="20" y1="130" x2="240" y2="130" />
          <line class="g-axis g-axis-v" x1="130" y1="20" x2="130" y2="240" />
          <circle class="g-center" cx="130" cy="130" r="4" />
        </svg>
        <div class="bubble" :style="{ transform: bubbleTransform }">
          <span class="bubble-sheen" />
        </div>
        <span class="glass-glint glass-glint-1" />
        <span class="glass-glint glass-glint-2" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.spirit-level {
  user-select: none;
}

.vial-frame {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  padding: 18px;
  background:
    radial-gradient(circle at 30% 25%, #3a4146 0%, #22272b 45%, #101314 100%);
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.18),
    inset 0 -6px 12px rgba(0, 0, 0, 0.7),
    0 18px 40px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  transition: box-shadow 0.3s ease;
}

.vial-frame.level {
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.18),
    inset 0 -6px 12px rgba(0, 0, 0, 0.7),
    0 18px 40px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 0 42px rgba(52, 211, 153, 0.55);
}

.vial-glass {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.08), transparent 60%),
    radial-gradient(circle at 30% 22%, rgba(255, 255, 255, 0.22), transparent 45%);
  box-shadow:
    inset 0 0 26px rgba(0, 0, 0, 0.55),
    inset 0 0 6px rgba(255, 255, 255, 0.18),
    0 1px 2px rgba(255, 255, 255, 0.25);
}

.liquid {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    radial-gradient(circle at 38% 32%, rgba(96, 165, 250, 0.5), transparent 55%),
    radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.55) 0%, rgba(16, 122, 87, 0.75) 70%, rgba(10, 82, 68, 0.85) 100%);
  box-shadow: inset 0 0 40px rgba(10, 62, 45, 0.6);
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
  stroke: rgba(255, 255, 255, 0.5);
  stroke-width: 1.4;
}

.g-ring-mid {
  stroke: rgba(255, 255, 255, 0.32);
  stroke-width: 1;
}

.g-ring-inner {
  stroke: rgba(255, 255, 255, 0.55);
  stroke-width: 1.6;
}

.g-ticks line {
  stroke: rgba(255, 255, 255, 0.55);
  stroke-width: 2;
}

.g-ticks line:nth-child(4n + 1) {
  stroke-width: 3;
}

.g-axis {
  stroke: rgba(255, 255, 255, 0.38);
  stroke-width: 1;
}

.g-center {
  fill: rgba(255, 255, 255, 0.8);
}

.bubble {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  margin: -30px 0 0 -30px;
  border-radius: 50%;
  background: radial-gradient(circle at 34% 30%, #ffffff 0%, #e8fff6 40%, #b5eddc 80%);
  box-shadow:
    inset 0 -4px 8px rgba(34, 120, 96, 0.35),
    inset 0 4px 10px rgba(255, 255, 255, 0.9),
    0 2px 6px rgba(0, 0, 0, 0.35),
    0 0 26px rgba(255, 255, 255, 0.28);
  transition: transform 0.12s ease-out;
  will-change: transform;
}

.bubble-sheen {
  position: absolute;
  top: 12%;
  left: 18%;
  width: 38%;
  height: 32%;
  border-radius: 50%;
  background: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.1));
  transform: rotate(-18deg);
  filter: blur(0.5px);
}

.vial-frame.level .bubble {
  box-shadow:
    inset 0 -4px 8px rgba(34, 120, 96, 0.35),
    inset 0 4px 10px rgba(255, 255, 255, 0.9),
    0 2px 6px rgba(0, 0, 0, 0.35),
    0 0 34px rgba(110, 231, 183, 0.85);
}

.glass-glint {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.09);
  filter: blur(1px);
}

.glass-glint-1 {
  top: 6%;
  left: 10%;
  width: 46%;
  height: 20%;
  transform: rotate(-14deg);
}

.glass-glint-2 {
  bottom: 12%;
  right: 8%;
  width: 30%;
  height: 12%;
  transform: rotate(160deg);
  background: rgba(255, 255, 255, 0.05);
}
</style>
