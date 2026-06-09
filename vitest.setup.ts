import "@testing-library/jest-dom/vitest";

// Vitest v4's jsdom environment populates the `Storage` class onto the global
// but never copies the `localStorage` / `sessionStorage` instances from
// `dom.window`. That leaves `window.localStorage` undefined inside tests
// (since `window === globalThis` here) and clashes with Node 22+'s
// experimental `localStorage` global. Re-attach jsdom's instances explicitly.
const jsdomWindow = (globalThis as { jsdom?: { window?: Window } }).jsdom?.window;
if (jsdomWindow) {
  for (const key of ["localStorage", "sessionStorage"] as const) {
    const value = jsdomWindow[key];
    if (value && (globalThis as Record<string, unknown>)[key] !== value) {
      Object.defineProperty(globalThis, key, {
        configurable: true,
        writable: true,
        value,
      });
    }
  }
}
