/**
 * URL for a heavy media file (video, large photo). In production `VITE_MEDIA_BASE` points at the
 * Cloudflare R2 bucket; unset (local dev, or to fall back) the same file is served from
 * `public/assets`. `scripts/upload-media.mjs` uploads every file passed to `media()` here.
 */
const BASE = (import.meta.env.VITE_MEDIA_BASE as string | undefined)?.replace(/\/+$/, '') || '/assets';

export const media = (file: string): string => `${BASE}/${file}`;
