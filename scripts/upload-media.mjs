// Uploads every file the app loads through `media('...')` (src/lib/media.ts) from public/assets to
// the Cloudflare R2 bucket. The list is read from the source, so it can never drift from the code.
//
//   npx wrangler login              (once; opens the browser)
//   node scripts/upload-media.mjs   (bucket name via R2_BUCKET, default aquasol)
//   node scripts/upload-media.mjs --dry-run
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BUCKET = process.env.R2_BUCKET || 'aquasol';
const DRY = process.argv.includes('--dry-run');
// Filenames are not content-hashed, so a week rather than forever: a replaced file shows up within
// days even if its name is reused (better still, give a changed file a new name).
const CACHE = 'public,max-age=604800'; // no space: on Windows the args pass through a shell
const TYPES = { mp4: 'video/mp4', webm: 'video/webm', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif' };

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(n) ? [p] : [];
  });

const files = [
  ...new Set(walk('src').flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/\bmedia\(\s*'([^']+)'\s*\)/g)].map((m) => m[1]))),
].sort();

if (!files.length) throw new Error('No media(...) calls found under src/');
const missing = files.filter((f) => !existsSync(join('public/assets', f)));
if (missing.length) throw new Error(`Not in public/assets: ${missing.join(', ')}`);

console.log(`${files.length} files -> r2://${BUCKET}${DRY ? '  (dry run)' : ''}`);
for (const f of files) {
  const type = TYPES[f.split('.').pop().toLowerCase()];
  if (!type) throw new Error(`No content type for ${f}`);
  const args = ['wrangler', 'r2', 'object', 'put', `${BUCKET}/${f}`, '--file', join('public/assets', f), '--content-type', type, '--cache-control', CACHE, '--remote'];
  console.log(`  ${f}  (${(statSync(join('public/assets', f)).size / 1024).toFixed(0)} kB, ${type})`);
  if (!DRY) execFileSync('npx', args, { stdio: 'inherit', shell: process.platform === 'win32' });
}
console.log(DRY ? 'Dry run only; nothing uploaded.' : 'Done.');
