import { readonly, ref } from 'vue'

const STORAGE_KEY = 'nivel-burbuja:calibration'
const EMPTY = () => ({ horizontal: { x: 0, y: 0 }, vertical: { x: 0, y: 0 } })

function loadOffsets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY()
    const parsed = JSON.parse(raw)
    return {
      horizontal: parsed.horizontal ?? { x: 0, y: 0 },
      vertical: parsed.vertical ?? { x: 0, y: 0 }
    }
  } catch {
    return EMPTY()
  }
}

function axisValues(mode, tilt) {
  return mode === 'vertical' ? { x: tilt.plumbX, y: tilt.plumbY } : { x: tilt.tiltX, y: tilt.tiltY }
}

export function useCalibration() {
  const offsets = ref(loadOffsets())

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offsets.value))
  }

  function setZero(mode, tilt) {
    offsets.value[mode] = axisValues(mode, tilt)
    persist()
  }

  function reset(mode) {
    offsets.value[mode] = { x: 0, y: 0 }
    persist()
  }

  function apply(mode, tilt) {
    const current = axisValues(mode, tilt)
    const offset = offsets.value[mode]
    return { x: current.x - offset.x, y: current.y - offset.y }
  }

  return {
    offsets: readonly(offsets),
    setZero,
    reset,
    apply
  }
}