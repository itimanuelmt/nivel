import { readonly, ref } from 'vue'
import { alignToFlat, computeTiltFromGravity } from '../utils/geometry.js'

const STORAGE_KEY = 'nivel-burbuja:calibration'
const EMPTY = () => ({ horizontal: null, vertical: null })

function asReference(entry) {
  const hasVector =
    entry && Number.isFinite(entry.x) && Number.isFinite(entry.y) && Number.isFinite(entry.z)
  return hasVector ? { x: entry.x, y: entry.y, z: entry.z } : null
}

function loadOffsets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY()
    const parsed = JSON.parse(raw)
    return {
      horizontal: asReference(parsed.horizontal),
      vertical: asReference(parsed.vertical)
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

  function setZero(mode, gravity) {
    offsets.value[mode] = { x: gravity.x, y: gravity.y, z: gravity.z }
    persist()
  }

  function reset(mode) {
    offsets.value[mode] = null
    persist()
  }

  function apply(mode, gravity) {
    const reference = offsets.value[mode]
    const corrected = reference ? alignToFlat(gravity, reference) : gravity
    return axisValues(mode, computeTiltFromGravity(corrected))
  }

  return {
    offsets: readonly(offsets),
    setZero,
    reset,
    apply
  }
}