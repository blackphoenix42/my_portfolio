import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-tight flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="mono-label">/ 404</p>
      <h1 className="text-display-2 mt-2 font-semibold tracking-tight">Page not found</h1>
      <p className="text-fg-muted mt-3 max-w-md">
        The page you're looking for doesn't exist. Try the home page or browse my work.
      </p>
      <div className="mt-6 flex gap-2">
        <Link href="/" className="btn-primary">
          Home
        </Link>
        <Link href="/work" className="btn-secondary">
          Work
        </Link>
      </div>
    </div>
  );
}
