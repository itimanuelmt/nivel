<script setup>
import { computed } from 'vue'

const props = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  level: { type: Boolean, default: false }
})

const MAX_DEGREES = 10
const VIAL_RADIUS = 130
const BUBBLE_RADIUS = 31

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function degreesToOffset(degrees) {
  return clamp(degrees / MAX_DEGREES, -1, 1) * (VIAL_RADIUS - BUBBLE_RADIUS)
}

const bubbleStyle = computed(() => ({
  '--ox': `${degreesToOffset(props.x)}px`,
  '--oy': `${degreesToOffset(props.y)}px`
}))
</script>

<template>
<div class="vial d-flex align-items-center justify-content-center" :class="{ level }">
      <div class="ticks" />
      <div class="ring" />
      <div class="axis axis-x" />
      <div class="axis axis-y" />
      <div class="markers" />
      <div class="bubble" :style="bubbleStyle" />
    </div>
</template>

<style scoped>
.vial {
  position: relative;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background:
    radial-gradient(circle at 32% 26%, rgba(255, 255, 255, 0.1), transparent 55%),
    radial-gradient(circle, rgba(32, 201, 151, 0.12) 0%, rgba(9, 12, 14, 0.92) 72%);
  box-shadow: inset 0 0 44px rgba(0, 0, 0, 0.6), 0 12px 34px rgba(0, 0, 0, 0.45);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.vial.level {
  border-color: rgba(32, 201, 151, 0.75);
  box-shadow: inset 0 0 44px rgba(0, 0, 0, 0.6), 0 0 34px rgba(32, 201, 151, 0.45);
}

.ticks {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  background: repeating-conic-gradient(
    from 0deg,
    rgba(255, 255, 255, 0.2) 0deg 0.5deg,
    transparent 0.5deg 30deg
  );
  -webkit-mask: radial-gradient(closest-side, transparent 94.5%, #000 95.5%);
  mask: radial-gradient(closest-side, transparent 94.5%, #000 95.5%);
  pointer-events: none;
}

.ring {
  position: absolute;
  inset: 21%;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.axis {
  position: absolute;
  background: rgba(255, 255, 255, 0.26);
}

.axis-x {
  top: 50%;
  left: 10%;
  width: 80%;
  height: 1px;
}

.axis-y {
  top: 10%;
  left: 50%;
  width: 1px;
  height: 80%;
}

.markers {
  position: absolute;
  inset: 50%;
  width: 8px;
  height: 8px;
  margin: -4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 1);
}

.bubble {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 62px;
  height: 62px;
  margin: -31px;
  border-radius: 50%;
  background: radial-gradient(circle at 33% 28%, #ffffff, #cdf7e5 46%, #8ee9c5 82%);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(142, 233, 197, 0.4);
  transform: translate3d(var(--ox), var(--oy), 0);
  transition: transform 0.12s ease-out, box-shadow 0.3s ease;
  will-change: transform;
}

.vial.level .bubble {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5), 0 0 32px rgba(142, 233, 197, 0.85);
}
</style>