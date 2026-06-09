import qrcode from "qrcode-generator";

/**
 * Server-rendered QR code as a crisp inline SVG (no client JS, no canvas).
 * Dark modules on a white card with a real quiet zone so phone cameras lock
 * on instantly. Used on the 404 page and reusable anywhere a scannable link
 * helps (e.g. "continue on your phone").
 */
export function QrTag({
  value,
  size = 120,
  label,
  className,
}: {
  value: string;
  size?: number;
  label: string;
  className?: string;
}) {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();
  const count = qr.getModuleCount();
  const margin = 2; // quiet zone, in modules
  const dim = count + margin * 2;

  let path = "";
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) path += `M${c + margin} ${r + margin}h1v1h-1z`;
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${dim} ${dim}`}
      role="img"
      aria-label={label}
      className={className}
      shapeRendering="crispEdges"
    >
      <rect width={dim} height={dim} fill="#ffffff" />
      <path d={path} fill="#0b1020" />
    </svg>
  );
}
