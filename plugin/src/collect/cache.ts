// Word count cache to avoid recomputation
export interface WordCacheEntry {
  mtime: number;
  words: number;
}

const wordCountCache = new Map<string, WordCacheEntry>();

export function getCachedWords(path: string, mtime: number): number | null {
  const cached = wordCountCache.get(path);
  if (cached && cached.mtime === mtime) return cached.words;
  return null;
}

export function setCachedWords(path: string, mtime: number, words: number): void {
  wordCountCache.set(path, { mtime, words });
}

export function clearCache(): void {
  wordCountCache.clear();
}
