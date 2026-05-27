# Security Policy

I take the security of this site and the people who use it seriously. Thanks for taking the time
to report responsibly.

## Reporting a vulnerability

**Please do not open a public issue** for security reports.

Preferred channels (in order):

1. **GitHub Security Advisory** — open a private report at
   <https://github.com/blackphoenix42/portfolio/security/advisories/new>.
2. **Email** the maintainer via the address on the [contact page](https://ayushyadav.dev/contact).
   Use the subject line `SECURITY: <short description>`.

When reporting, please include:

- Affected component / page / URL.
- A short proof-of-concept or steps to reproduce.
- Impact assessment in your own words (what an attacker could do).
- Your contact information for follow-up.

## What to expect

| Stage                | Target                 |
| -------------------- | ---------------------- |
| Acknowledgement      | within 3 business days |
| Initial triage       | within 7 days          |
| Fix target (default) | within 90 days         |

Disclosure is coordinated: I'll keep you informed, agree an embargo where appropriate, and credit
you in the release notes if you wish.

## Scope

### In scope

- The deployed site at <https://ayushyadav.dev> (and previews).
- This repository (build, CI, and supply-chain configurations).

### Out of scope

- Volumetric DoS / DDoS testing.
- Automated scanning that creates excessive traffic.
- Issues in third-party services (Vercel, Resend, GitHub, LinkedIn, etc.) — please report those
  to the respective vendors.
- Self-XSS or social-engineering of the site maintainer.
- Vulnerabilities only reproducible on unsupported browser versions.

### Rules of engagement

- Use test accounts and test data. No real PII.
- Don't disrupt the service (e.g. rate-limit your testing).
- Respect the contact-form rate limit — submit at most a handful of test messages.

## Severity guidance

I follow CVSS v3.1 as a rough rubric:

| Severity | Range    | Typical examples                               |
| -------- | -------- | ---------------------------------------------- |
| Critical | 9.0–10.0 | Remote code execution, full data leak          |
| High     | 7.0–8.9  | Stored XSS, server-side template injection     |
| Medium   | 4.0–6.9  | Reflected XSS, CSRF on sensitive action        |
| Low      | 0.1–3.9  | Hardening gaps, info disclosure with no impact |

## Hardening practices

- HTTP security headers configured at the framework layer (see `next.config.mjs`):
  `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Contact API protected by zod validation, honeypot field, and an in-memory IP rate limit.
- No `dangerouslySetInnerHTML`. No `eval`. No remote-script tags in production.
- Secrets in `.env.local` only — never committed; `.env.example` documents the keys.
- CI runs `npm audit` (production deps, moderate+) and CodeQL on a schedule.
- Dependabot manages weekly dependency updates.

## Hall of thanks

If you'd like to be credited for a valid report, mention it in the report and I'll add you to the
release notes.
