import { onBeforeUnmount, readonly, ref } from 'vue'
import { computeTilt, gravityInDevice } from '../utils/geometry.js'

function detectPlatform() {
  const userAgent = navigator.userAgent
  if (/Android/.test(userAgent)) return 'android'
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios'
  if (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1) return 'ios'
  return 'other'
}

const SETTINGS_HINTS = {
  android:
    'En Chrome permití el acceso a sensores para este sitio: tocá el candado en la barra de direcciones → Sensores (o Ajustes del sitio) → Permitir. Luego volvé y tocá Reintentar.',
  ios: 'En iOS activá "Movimiento y orientación" para este sitio: Ajustes → Safari → Acceso a movimiento y orientación. Luego volvé y tocá Reintentar.',
  other:
    'Habilitá el permiso de sensores o movimiento para este sitio en la configuración del navegador y luego tocá Reintentar.'
}

function settingsHint() {
  return SETTINGS_HINTS[detectPlatform()]
}

export function useOrientation() {
  const tilt = ref({ tiltX: 0, tiltY: 0, plumbX: 0, plumbY: 0 })
  const gravity = ref({ x: 0, y: 0, z: -1 })
  const status = ref('idle')
  const error = ref('')
  const isSupported = 'DeviceOrientationEvent' in window

  let handler = null
  let lastGravity = { x: 0, y: 0, z: -1 }
  const SMOOTHING = 0.35 // Factor de suavizado para evitar vibración excesiva (jitter)

  function onDeviceOrientation(event) {
    if (event.beta === null || event.gamma === null) return
    const rawGravity = gravityInDevice(event.alpha, event.beta, event.gamma)
    
    lastGravity = {
      x: lastGravity.x + SMOOTHING * (rawGravity.x - lastGravity.x),
      y: lastGravity.y + SMOOTHING * (rawGravity.y - lastGravity.y),
      z: lastGravity.z + SMOOTHING * (rawGravity.z - lastGravity.z)
    }
    gravity.value = { ...lastGravity }
  }

  function stop() {
    if (handler) {
      window.removeEventListener('deviceorientation', handler)
      handler = null
    }
  }

  function startListener() {
    stop()
    handler = onDeviceOrientation
    window.addEventListener('deviceorientation', handler)
    status.value = 'running'
    error.value = ''
  }

  async function activate() {
    error.value = ''
    if (!isSupported) {
      status.value = 'unsupported'
      return
    }
    const requestPermission = window.DeviceOrientationEvent?.requestPermission
    if (!requestPermission) {
      startListener()
      return
    }
    status.value = 'requesting'
    try {
      const result = await requestPermission.call(window.DeviceOrientationEvent)
      if (result !== 'granted') {
        status.value = 'denied'
        error.value = settingsHint()
        return
      }
    } catch (cause) {
      const timedOutGesture = cause?.name === 'NotAllowedError'
      status.value = timedOutGesture ? 'denied' : 'error'
      error.value = timedOutGesture
        ? 'El navegador no reconoció el gesto de activación. Tocá Reintentar para intentar de nuevo.'
        : 'No se pudo acceder al sensor del dispositivo.'
      return
    }
    startListener()
  }

  onBeforeUnmount(stop)

  function setSimulated(euler) {
    const alpha = euler.alpha ?? 0
    const beta = euler.beta ?? 0
    const gamma = euler.gamma ?? 0
    const rawGravity = gravityInDevice(alpha, beta, gamma)
    lastGravity = rawGravity
    gravity.value = { ...rawGravity }
  }

  return {
    isSupported,
    status,
    error: readonly(error),
    tilt: readonly(tilt),
    gravity: readonly(gravity),
    activate,
    setSimulated
  }
}