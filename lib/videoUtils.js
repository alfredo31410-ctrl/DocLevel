// Convert a YouTube or Vimeo URL (or ID) into an embed URL.
export function toEmbedUrl(input) {
  if (!input) return '';
  const url = String(input).trim();

  // YouTube patterns
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Raw 11-char YouTube ID
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return `https://www.youtube.com/embed/${url}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  // Already an embed URL - just return
  return url;
}

export function getYouTubeThumbnail(videoUrl) {
  if (!videoUrl) return null;
  const url = String(videoUrl);
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return `https://img.youtube.com/vi/${url}/hqdefault.jpg`;
  return null;
}
