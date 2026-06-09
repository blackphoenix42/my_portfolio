/**
 * Tiny module-scoped registry that tracks which fullscreen egg overlays
 * (terminal, matrix, etc.) are currently open. Global keyboard listeners
 * (Konami, typed-word detection, theme cycler) consult this so typing
 * "matrix" *inside* the matrix overlay doesn't re-trigger eggs or scroll
 * the page.
 *
 * Kept outside React state on purpose — listeners read it inside event
 * handlers, where stale closures would otherwise be a problem.
 */

const open = new Set<string>();
const listeners = new Set<() => void>();

export function setOverlayOpen(id: string, isOpen: boolean): void {
  const before = open.size;
  if (isOpen) open.add(id);
  else open.delete(id);
  if (open.size !== before) listeners.forEach((fn) => fn());
}

export function isAnyOverlayOpen(): boolean {
  return open.size > 0;
}

export function subscribeOverlay(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
