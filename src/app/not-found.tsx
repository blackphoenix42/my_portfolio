import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-tight flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="mono-label">/ 404</p>
      <h1 className="mt-2 text-display-2 font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-md text-fg-muted">
        The page you're looking for doesn't exist. Try the home page or browse the case studies.
      </p>
      <div className="mt-6 flex gap-2">
        <Link href="/" className="btn-primary">
          Home
        </Link>
        <Link href="/work" className="btn-secondary">
          Case studies
        </Link>
      </div>
    </div>
  );
}
