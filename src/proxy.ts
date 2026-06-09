import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the metadata image route `/opengraph-image` (a root-level special
  //   file with no extension — without this exclusion the proxy rewrites it
  //   into the `[locale]` tree, where it hits the catch-all and 404s)
  // - … the ones containing a dot (e.g. `favicon.ico`, `robots.txt`)
  matcher: "/((?!api|_next|_vercel|opengraph-image|.*\\..*).*)",
};
