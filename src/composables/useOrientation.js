import { onBeforeUnmount, readonly, ref } from 'vue'
import { computeTilt } from '../utils/geometry.js'

export function useOrientation() {
  const tilt = ref({ tiltX: 0, tiltY: 0, plumbX: 0, plumbY: 0 })
  const status = ref('idle')
  const isSupported = 'DeviceOrientationEvent' in window

  let handler = null

  function onDeviceOrientation(event) {
    if (event.alpha === null) return
    tilt.value = computeTilt(event.alpha, event.beta, event.gamma)
  }

  function stop() {
    if (handler) {
      window.removeEventListener('deviceorientation', handler)
      handler = null
    }
  }

  async function activate() {
    if (!isSupported) {
      status.value = 'unsupported'
      return
    }
    const requestPermission = window.DeviceOrientationEvent?.requestPermission
    if (requestPermission) {
      status.value = 'requesting'
      try {
        const result = await requestPermission.call(window.DeviceOrientationEvent)
        if (result !== 'granted') {
          status.value = 'denied'
          return
        }
      } catch {
        status.value = 'denied'
        return
      }
    }
    stop()
    handler = onDeviceOrientation
    window.addEventListener('deviceorientation', handler)
    status.value = 'running'
  }

  onBeforeUnmount(stop)

  function setSimulated(euler) {
    tilt.value = computeTilt(euler.alpha ?? 0, euler.beta ?? 0, euler.gamma ?? 0)
  }

  return {
    isSupported,
    status,
    tilt: readonly(tilt),
    activate,
    setSimulated
  }
}