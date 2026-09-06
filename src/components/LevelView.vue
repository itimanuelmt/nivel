<script setup>
import { computed, ref, watch } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useOrientation } from '../composables/useOrientation.js'
import { useCalibration } from '../composables/useCalibration.js'
import { vibrateOnLevelChange } from '../services/haptics.js'
import BubbleLevel from './BubbleLevel.vue'
import DigitalLevel from './DigitalLevel.vue'
import ToleranceControl from './ToleranceControl.vue'
import CalibrationControl from './CalibrationControl.vue'
import pkg from '../../package.json'

const appVersion = pkg.version

const useSimulator = import.meta.env.DEV
const DevSimulator = useSimulator
  ? defineAsyncComponent(() => import('./DevSimulator.vue'))
  : null

const mode = ref('horizontal')
const view = ref('bubble')
const tolerance = ref(0.5)

const { isSupported, status, error, gravity, activate, setSimulated } = useOrientation()
const { apply, setZero, reset, offsets } = useCalibration()

const calibrated = computed(() => apply(mode.value, gravity.value))

const isPlomada = computed(() => mode.value === 'vertical')

const bubbleX = computed(() => isPlomada.value ? 0 : -calibrated.value.y)
const bubbleY = computed(() => (isPlomada.value ? -calibrated.value.y : calibrated.value.x))

const deviation = computed(() =>
  isPlomada.value
    ? Math.abs(calibrated.value.y)
    : Math.hypot(calibrated.value.x, calibrated.value.y)
)

const isLevel = computed(() => deviation.value <= tolerance.value)
const needsCalibration = computed(
  () =>
    status.value === 'running' &&
    offsets.value[mode.value] === null &&
    deviation.value > 2
)

watch(isLevel, (level) => vibrateOnLevelChange(level))

const statusText = computed(
  () =>
    ({
      idle: 'Sensor inactivo',
      requesting: 'Solicitando permiso…',
      running: 'Sensor activo',
      denied: 'Permiso denegado',
      unsupported: 'Sensor no disponible'
    })[status.value]
)

const statusPillClass = computed(
  () =>
    ({
      idle: 'status-pill muted',
      requesting: 'status-pill muted requesting',
      running: 'status-pill ok',
      denied: 'status-pill danger',
      error: 'status-pill danger',
      unsupported: 'status-pill warn'
    })[status.value]
)

function onSetZero() {
  setZero(mode.value, gravity.value)
}

function onReset() {
  reset(mode.value)
}
</script>

<template>
  <div class="level-view container py-3 d-flex flex-column" style="min-height: 100dvh">
    <header class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="app-title mb-0">Nivel de Burbuja</h1>
      <span class="status-pill" :class="statusPillClass">
        <span class="status-dot" />
        {{ statusText }}
      </span>
    </header>

    <div class="d-flex flex-wrap gap-2 mb-3">
      <div class="btn-group btn-group-sm" role="group" aria-label="Modo de medida">
        <button
          class="btn"
          :class="mode === 'horizontal' ? 'btn-primary' : 'btn-outline-primary'"
          type="button"
          @click="mode = 'horizontal'"
        >
          Horizontal
        </button>
        <button
          class="btn"
          :class="mode === 'vertical' ? 'btn-primary' : 'btn-outline-primary'"
          type="button"
          @click="mode = 'vertical'"
        >
          Plomada
        </button>
      </div>
      <div class="btn-group btn-group-sm" role="group" aria-label="Vista">
        <button
          class="btn"
          :class="view === 'bubble' ? 'btn-primary' : 'btn-outline-primary'"
          type="button"
          @click="view = 'bubble'"
        >
          Burbuja
        </button>
        <button
          class="btn"
          :class="view === 'digital' ? 'btn-primary' : 'btn-outline-primary'"
          type="button"
          @click="view = 'digital'"
        >
          Digital
        </button>
      </div>
    </div>

    <div v-if="status === 'running'" class="d-flex justify-content-center my-4">
      <BubbleLevel
        v-if="view === 'bubble'"
        :x="bubbleX"
        :y="bubbleY"
        :level="isLevel"
        :plomada="isPlomada"
      />
      <DigitalLevel
        v-else
        :x="bubbleX"
        :y="bubbleY"
        :tolerance="tolerance"
        :level="isLevel"
        :plomada="isPlomada"
      />
    </div>

    <div v-else class="d-flex flex-column align-items-center justify-content-center my-auto gap-2 text-center">
      <p v-if="status === 'idle'" class="lead mb-0">Presiona para activar el sensor de orientación</p>
      <div v-else-if="status === 'requesting'" class="spinner-border text-primary" role="status" />
      <template v-else>
        <p class="mb-0 fw-semibold">{{ statusText }}</p>
        <p v-if="error" class="small text-secondary mb-0 text-break" style="max-width: 26rem">{{ error }}</p>
      </template>
      <button
        v-if="status === 'idle'"
        class="btn btn-primary btn-lg rounded-pill px-4"
        type="button"
        :disabled="!isSupported"
        @click="activate"
      >
        Activar sensor
      </button>
      <button
        v-if="status === 'denied' || status === 'error'"
        class="btn btn-primary btn-lg rounded-pill px-4"
        type="button"
        @click="activate"
      >
        Reintentar
      </button>
    </div>

    <div v-if="status === 'running'" class="d-flex flex-column gap-3 mt-auto pt-3">
      <p v-if="needsCalibration" class="small text-secondary mb-0">
        ¿Burbuja descentrada? Apoyá el teléfono sobre la superficie y tocá «Poner a cero» para calibrar.
      </p>
      <ToleranceControl v-model="tolerance" />
      <CalibrationControl :mode="mode" :offsets="offsets" :enabled="true" @zero="onSetZero" @reset="onReset" />
    </div>

    <DevSimulator v-if="useSimulator && DevSimulator" class="mt-4" :simulate="setSimulated" />

    <footer class="version-footer text-center pt-3">
      <span class="chip">v{{ appVersion }}</span>
    </footer>
  </div>
</template>