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

export function computeTiltFromGravity(gravity) {
  return {
    tiltX: Math.atan2(gravity.y, -gravity.z) * RAD_TO_DEG,
    tiltY: Math.atan2(gravity.x, -gravity.z) * RAD_TO_DEG,
    plumbX: Math.atan2(gravity.x, -gravity.y) * RAD_TO_DEG,
    plumbY: Math.atan2(gravity.z, -gravity.y) * RAD_TO_DEG
  }
}

export function computeTilt(alpha, beta, gamma) {
  return computeTiltFromGravity(gravityInDevice(alpha, beta, gamma))
}

function normalize(vector) {
  const length = Math.hypot(vector.x, vector.y, vector.z)
  if (length <= 1e-9) return { x: 0, y: 0, z: -1 }
  return { x: vector.x / length, y: vector.y / length, z: vector.z / length }
}

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  }
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

function axisAngleToQuaternion(axis, angle) {
  const unit = normalize(axis)
  const half = angle / 2
  const scale = Math.sin(half)
  return { w: Math.cos(half), x: unit.x * scale, y: unit.y * scale, z: unit.z * scale }
}

function rotationBetween(from, to) {
  const a = normalize(from)
  const b = normalize(to)
  const aligned = dot(a, b)
  if (aligned > 1 - 1e-9) return { w: 1, x: 0, y: 0, z: 0 }
  if (aligned < -1 + 1e-9) {
    const pivot = Math.abs(a.x) < 0.9 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 }
    return axisAngleToQuaternion(cross(a, pivot), Math.PI)
  }
  return axisAngleToQuaternion(cross(a, b), Math.acos(aligned))
}

function rotateVector(vector, quaternion) {
  const { x, y, z } = vector
  const { w, x: qx, y: qy, z: qz } = quaternion
  const weight = w * w - (qx * qx + qy * qy + qz * qz)
  const align = 2 * (qx * x + qy * y + qz * z)
  const spin = 2 * w
  const turn = cross({ x: qx, y: qy, z: qz }, { x, y, z })
  return {
    x: weight * x + align * qx + spin * turn.x,
    y: weight * y + align * qy + spin * turn.y,
    z: weight * z + align * qz + spin * turn.z
  }
}

export function alignToFlat(gravity, reference) {
  const rotation = rotationBetween(reference, { x: 0, y: 0, z: -1 })
  return rotateVector(gravity, rotation)
}