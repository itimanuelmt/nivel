import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'icons')

const BG = [20, 22, 25, 255]       // #141619
const BUBBLE = [32, 201, 151, 255] // #20c997
const RING = [99, 230, 190, 255]   // #63e6be
const GLOW = [210, 255, 240, 255]

const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  const stride = 1 + width * 4
  const raw = Buffer.alloc(height * stride)
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0
    rgba.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4)
  }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

function setPixel(buf, index, [r, g, b, a]) {
  buf[index] = r
  buf[index + 1] = g
  buf[index + 2] = b
  buf[index + 3] = a
}

function fillCircle(buf, size, cx, cy, r, color) {
  for (let y = Math.round(cy - r); y <= Math.round(cy + r); y++) {
    for (let x = Math.round(cx - r); x <= Math.round(cx + r); x++) {
      if (x < 0 || y < 0 || x >= size || y >= size) continue
      if (Math.hypot(x - cx, y - cy) <= r) setPixel(buf, (y * size + x) * 4, color)
    }
  }
}

function inRoundedRect(x, y, w, h, r) {
  if (!(x >= 0 && x <= w && y >= 0 && y <= h)) return false
  const cx = Math.min(Math.max(x, r), w - r)
  const cy = Math.min(Math.max(y, r), h - r)
  const dx = x - cx
  const dy = y - cy
  return dx * dx + dy * dy <= r * r
}

function drawIcon(size, { maskable = false } = {}) {
  const buf = Buffer.alloc(size * size * 4)
  const c = size / 2
  const cornerR = size * (maskable ? 0 : 0.2)
  const bubbleR = size * (maskable ? 0.2 : 0.27)
  const ringR = bubbleR + size * 0.028
  const ringW = Math.max(2, size * 0.018)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!maskable && !inRoundedRect(x, y, size - 1, size - 1, cornerR)) continue
      const i = (y * size + x) * 4
      setPixel(buf, i, BG)
      const d = Math.hypot(x - c, y - c)
      if (d <= bubbleR) {
        setPixel(buf, i, BUBBLE)
      } else if (Math.abs(d - ringR) <= ringW) {
        setPixel(buf, i, RING)
      }
    }
  }

  const glow = { cx: c - bubbleR * 0.35, cy: c - bubbleR * 0.35, r: Math.max(1, bubbleR * 0.2) }
  fillCircle(buf, size, glow.cx, glow.cy, glow.r, GLOW)
  fillCircle(buf, size, c, c, Math.max(1, size * 0.015), RING)

  return encodePNG(size, size, buf)
}

mkdirSync(outDir, { recursive: true })
const targets = [
  ['pwa-192x192.png', 192, {}],
  ['pwa-512x512.png', 512, {}],
  ['pwa-maskable-512x512.png', 512, { maskable: true }],
  ['apple-touch-icon.png', 180, {}]
]
for (const [file, size, opts] of targets) {
  writeFileSync(join(outDir, file), drawIcon(size, opts))
  console.log(`generated public/icons/${file}`)
}