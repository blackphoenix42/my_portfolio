// Default loading UI for any locale-scoped route. Shows immediately on
// client-side navigation while the destination's RSC payload streams in,
// which makes menu clicks feel instant even before the page is compiled
// in dev mode.
export default function Loading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading" className="container-tight py-16">
      <div className="bg-bg-elev/60 mb-6 h-3 w-24 animate-pulse rounded" />
      <div className="bg-bg-elev/60 mb-3 h-10 w-3/4 animate-pulse rounded" />
      <div className="bg-bg-elev/40 mb-8 h-5 w-1/2 animate-pulse rounded" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border-border bg-bg-elev/40 h-36 animate-pulse rounded-lg border"
          />
        ))}
      </div>
    </div>
  );
}
