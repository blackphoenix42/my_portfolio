# Privacy

_Last updated: 2026._

This website ([binaryphoenix.vercel.app](https://binaryphoenix.vercel.app)) is a personal
portfolio. The privacy posture is intentionally minimal. A user-facing version of this
policy is also rendered at [`/privacy`](https://binaryphoenix.vercel.app/privacy) (translated
into all six supported languages).

## What we collect

### Server logs

The hosting platform (e.g. Vercel) records standard request logs — IP address, request path,
user-agent, response code, timestamp — for operational and abuse-prevention purposes.
These logs are retained for a short period by the host and are not joined with any other dataset.

### Contact form

When you submit the contact form (`/contact`), the following fields are sent to the maintainer by
email via [Resend](https://resend.com):

- Name, email, optional company, role context, subject, message, **any attachments you choose to
  include** (up to 5 files, 10 MB total).

The IP address is used **transiently** to enforce a rate limit (see
[`src/lib/rate-limit.ts`](../src/lib/rate-limit.ts)). It is not stored.

### Cookies

Exactly one cookie is set: `NEXT_LOCALE`, used by the language switcher to remember the language
you picked. No analytics cookies, no advertising cookies, no tracking pixels.

### Analytics

[Vercel Web Analytics](https://vercel.com/docs/analytics) and [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
are enabled in the root layout. Both are **cookie-less** and exempt from GDPR consent: they
aggregate page views and Core Web Vitals using a short-lived hash that's recomputed daily and
never linked back to an individual visitor.

## What we do not do

- We do not sell or share your data.
- We do not use third-party analytics scripts (Google Analytics, etc.).
- We do not load third-party advertising or remarketing pixels.
- We do not embed third-party fonts that phone home (Google Fonts is self-hosted via `next/font`).

## Third-party services in use

| Service                            | Purpose                            | Data shared                                |
| ---------------------------------- | ---------------------------------- | ------------------------------------------ |
| Vercel                             | Hosting + edge functions           | Request logs                               |
| [Resend](https://resend.com)       | Sending the contact-form email     | Your form submission + attachments         |
| Vercel Web Analytics               | Aggregate page-view metrics        | Anonymous, cookie-less aggregates only     |
| Vercel Speed Insights              | Real-user Core Web Vitals (LCP, …) | Anonymous, cookie-less performance samples |
| GitHub / LinkedIn (outbound links) | External profile pages             | Standard browser request when you click    |

## Your rights

You can request deletion of any message you've sent via the contact form by replying to the
acknowledgement email or contacting the maintainer directly.

## Contact

Questions about privacy? Use the [contact form](https://ayushyadav.dev/contact) or email the
address listed there.
