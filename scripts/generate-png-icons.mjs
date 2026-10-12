import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // RGBA buffer with filter byte 0 at start of each row
  const rowStride = 1 + width * 4;
  const rawData = Buffer.alloc(rowStride * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  // Precompute CRC table
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }

  function makeChunk(typeStr, dataBuf) {
    const typeBuf = Buffer.from(typeStr, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(dataBuf.length, 0);

    const crcBuf = Buffer.alloc(4);
    const toCrc = Buffer.concat([typeBuf, dataBuf]);
    crcBuf.writeUInt32BE(crc32(toCrc), 0);

    return Buffer.concat([lenBuf, typeBuf, dataBuf, crcBuf]);
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Drawing function for volcanic cyber aesthetic icon
function drawVolcanoIcon(x, y, w, h, isMaskable = false) {
  const nx = x / w; // 0 to 1
  const ny = y / h; // 0 to 1

  // Base background: Dark navy/indigo gradient
  let r = 7 + Math.floor(ny * 6);
  let g = 10 + Math.floor(ny * 6);
  let b = 25 + Math.floor(ny * 12);
  let a = 255;

  const cx = 0.5;
  const cy = 0.52;
  const dx = nx - cx;
  const dy = ny - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Subtle ambient radial glow (electric blue/violet)
  if (dist < 0.45) {
    const factor = (1 - dist / 0.45);
    r = Math.min(255, Math.floor(r + 30 * factor));
    g = Math.min(255, Math.floor(g + 20 * factor));
    b = Math.min(255, Math.floor(b + 90 * factor));
  }

  // Volcano Cone geometry
  // Cone base from ny: 0.35 to 0.78
  // at ny=0.35, half-width is 0.08
  // at ny=0.78, half-width is 0.34
  if (ny >= 0.35 && ny <= 0.78) {
    const progress = (ny - 0.35) / (0.78 - 0.35);
    const halfWidth = 0.08 + progress * 0.26;
    if (Math.abs(dx) <= halfWidth) {
      // Inside mountain
      const horizDist = Math.abs(dx) / halfWidth;
      r = Math.floor(15 + (1 - horizDist) * 20);
      g = Math.floor(20 + (1 - horizDist) * 25);
      b = Math.floor(45 + (1 - horizDist) * 55);

      // Neon fissure lines down the slopes
      if (Math.abs(dx - (-0.05 + progress * 0.02)) < 0.015) {
        // Cyan fissure
        r = 0; g = 240; b = 255;
      } else if (Math.abs(dx - (0.05 - progress * 0.03)) < 0.015) {
        // Violet/magenta fissure
        r = 168; g = 85; b = 247;
      }
    }
  }

  // Caldera glowing rim at ny: 0.33 to 0.37
  if (ny >= 0.33 && ny <= 0.37 && Math.abs(dx) <= 0.09) {
    const cdist = Math.sqrt(Math.pow(dx / 0.09, 2) + Math.pow((ny - 0.35) / 0.02, 2));
    if (cdist <= 1.0) {
      r = 0; g = 240; b = 255;
    }
  }

  // Eruption beam / pulse upward at ny: 0.15 to 0.33
  if (ny >= 0.15 && ny < 0.33 && Math.abs(dx) <= 0.02) {
    const beamProgress = (ny - 0.15) / 0.18;
    r = Math.floor(100 * beamProgress);
    g = 240;
    b = 255;
  }

  // Radar/Pulse concentric arcs
  const arcDist1 = Math.abs(dist - 0.28);
  if (arcDist1 < 0.008 && ny < 0.45) {
    r = 0; g = 240; b = 255;
  }
  const arcDist2 = Math.abs(dist - 0.38);
  if (arcDist2 < 0.008 && ny < 0.45) {
    r = 139; g = 92; b = 246;
  }

  return [r, g, b, a];
}

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 192x192
const buf192 = createPNG(192, 192, (x, y, w, h) => drawVolcanoIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), buf192);

// 512x512
const buf512 = createPNG(512, 512, (x, y, w, h) => drawVolcanoIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), buf512);

// Maskable 512x512
const bufMaskable = createPNG(512, 512, (x, y, w, h) => drawVolcanoIcon(x, y, w, h, true));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), bufMaskable);

// Apple touch icon 180x180
const bufApple = createPNG(180, 180, (x, y, w, h) => drawVolcanoIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), bufApple);

// Favicon 64x64
const bufFavicon = createPNG(64, 64, (x, y, w, h) => drawVolcanoIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'favicon.ico'), bufFavicon);

console.log('Successfully generated all PWA icons in /public!');
