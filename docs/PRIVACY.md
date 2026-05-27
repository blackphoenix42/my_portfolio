# Privacy

_Last updated: 2026._

This website ([ayushyadav.dev](https://ayushyadav.dev)) is a personal portfolio. The privacy
posture is intentionally minimal.

## What we collect

### Server logs

The hosting platform (e.g. Vercel) records standard request logs — IP address, request path,
user-agent, response code, timestamp — for operational and abuse-prevention purposes.
These logs are retained for a short period by the host and are not joined with any other dataset.

### Contact form

When you submit the contact form (`/contact`), the following fields are sent to the maintainer by
email via [Resend](https://resend.com):

- Name, email, optional company, role context, subject, message.

The IP address is used **transiently** to enforce a rate limit (see
[`src/lib/rate-limit.ts`](../src/lib/rate-limit.ts)). It is not stored.

### Cookies

This site does **not** use analytics cookies, advertising cookies, or any tracking pixels.
The only cookies that may be set are technical (e.g. theme preference in `localStorage`, which is
not a cookie at all, and any cookies set by the hosting platform).

## What we do not do

- We do not sell or share your data.
- We do not use third-party analytics scripts (Google Analytics, etc.).
- We do not load third-party advertising or remarketing pixels.
- We do not embed third-party fonts that phone home (Google Fonts is self-hosted via `next/font`).

## Third-party services in use

| Service                            | Purpose                          | Data shared                             |
| ---------------------------------- | -------------------------------- | --------------------------------------- |
| Hosting (e.g. Vercel)              | Serving the site, edge functions | Request logs                            |
| [Resend](https://resend.com)       | Sending the contact-form email   | Your form submission                    |
| GitHub / LinkedIn (outbound links) | External profile pages           | Standard browser request when you click |

## Your rights

You can request deletion of any message you've sent via the contact form by replying to the
acknowledgement email or contacting the maintainer directly.

## Contact

Questions about privacy? Use the [contact form](https://ayushyadav.dev/contact) or email the
address listed there.
