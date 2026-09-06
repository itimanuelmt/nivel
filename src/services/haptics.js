const LEVEL_PATTERN = [60, 40, 60]

let wasLevel = false

export function vibrateOnLevelChange(isLevel, pattern = LEVEL_PATTERN) {
  const shouldVibrate = isLevel && !wasLevel
  wasLevel = isLevel
  if (shouldVibrate && navigator.vibrate) navigator.vibrate(pattern)
}

export function cancelVibration() {
  if (navigator.vibrate) navigator.vibrate(0)
}