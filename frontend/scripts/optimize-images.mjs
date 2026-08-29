import sharp from 'sharp';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const SRC_DIR = join(process.cwd(), 'public/assets/products');

const SIZES = [150, 300, 400];

const files = readdirSync(SRC_DIR).filter(
  (f) => /\.(jpe?g|png)$/i.test(f) && !/-\d+w\.jpg$/i.test(f)
);

async function run() {
  for (const file of files) {
    const name = file.replace(/\.\w+$/, '');
    for (const size of SIZES) {
      const outPath = join(SRC_DIR, `${name}-${size}w.jpg`);
      if (existsSync(outPath)) continue; // évite de regénérer à chaque run
      await sharp(join(SRC_DIR, file))
        .resize(size, size, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(outPath);
      console.log(`✓ ${name}-${size}w.jpg`);
    }
  }
  console.log(`\nTerminé : ${files.length} images sources × ${SIZES.length} tailles.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});