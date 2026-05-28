import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tNav = await getTranslations("nav");
  return (
    <div className="container-tight flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="mono-label">/ 404</p>
      <h1 className="text-display-2 mt-2 font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-fg-muted mt-3 max-w-md">{t("subheading")}</p>
      <div className="mt-6 flex gap-2">
        <Link href="/" className="btn-primary">
          {tNav("home")}
        </Link>
        <Link href="/work" className="btn-secondary">
          {tNav("work")}
        </Link>
      </div>
    </div>
  );
}
