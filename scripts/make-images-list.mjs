// scripts/make-images-list.mjs
import { readdir } from 'node:fs/promises';
import path from 'node:path';

// usage: node scripts/make-images-list.mjs "images/song1" 12
const dir = process.argv[2] ?? 'images/song1';        // folder of images
const secondsPerImage = Number(process.argv[3] ?? 8); // time per image (s)

const entries = (await readdir(dir, { withFileTypes: true }))
  .filter(d => d.isFile() && /\.(png|jpe?g|webp)$/i.test(d.name))
  .map(d => d.name)
  .sort((a,b) => {
    const na = a.match(/\d+/)?.[0], nb = b.match(/\d+/)?.[0];
    return (na && nb && na !== nb) ? Number(na) - Number(nb) : a.localeCompare(b);
  })
  .map((name, i) => ({
    src: path.posix.join(dir.replace(/\\/g, '/'), name),
    start: i * secondsPerImage,
    end:   (i + 1) * secondsPerImage
  }));

console.log(JSON.stringify(entries, null, 2));
