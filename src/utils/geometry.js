const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

function degToRad(degrees) {
  return degrees * DEG_TO_RAD
}

export function gravityInDevice(alpha, beta, gamma) {
  const a = degToRad(alpha)
  const b = degToRad(beta)
  const g = degToRad(gamma)
  const cosA = Math.cos(a)
  const sinA = Math.sin(a)
  const cosB = Math.cos(b)
  const sinB = Math.sin(b)
  const cosG = Math.cos(g)
  const sinG = Math.sin(g)
  return {
    x: -(cosA * sinG + sinA * sinB * cosG),
    y: -(sinA * sinG - cosA * sinB * cosG),
    z: -cosB * cosG
  }
}

export function computeTilt(alpha, beta, gamma) {
  const { x, y, z } = gravityInDevice(alpha, beta, gamma)
  return {
    tiltX: Math.atan2(y, -z) * RAD_TO_DEG,
    tiltY: Math.atan2(x, -z) * RAD_TO_DEG,
    plumbX: Math.atan2(x, -y) * RAD_TO_DEG,
    plumbY: Math.atan2(z, -y) * RAD_TO_DEG
  }
}