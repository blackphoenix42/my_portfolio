# Endpoints and alternate paths

Canonical routes used by nav, sitemap, and internal links — plus the
**permanent redirects** that accept typos, synonyms, and short forms.

Source of truth for redirects: `src/lib/route-aliases.mjs` (wired in
`next.config.mjs`). Locale prefixes are never used
(`localePrefix: "never"`).

Generated: 2026-10-09 · **565** redirect rules.

---

## Canonical pages

| Canonical                  | Alternates (redirect here)                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/about`                   | `/me`, `/bio`, `/profile`, `/about-me`, `/aboutme`                                                                                               |
| `/work`                    | `/projects`, `/project`, `/portfolio`, `/case-studies`, `/casestudies`, `/works`                                                                 |
| `/skills`                  | `/skill`, `/stack`, `/tech`, `/technology`, `/technologies`, `/arsenal`                                                                          |
| `/experience`              | `/exp`, `/career`, `/jobs`, `/timeline`, `/work-history`, `/workhistory`                                                                         |
| `/now`                     | `/currently`, `/atm`, `/today`, `/status`, `/doing`                                                                                              |
| `/competitive-programming` | `/cp`, `/competitive`, `/coding`, `/leetcode`, `/codeforces`, `/practice`, `/plans`, `/practice-and-plans`, `/practiceandplans`, `/craft`        |
| `/system-design`           | `/sysdesign`, `/systemdesign`, `/system_design`, `/sys-design`, `/sys_design`, `/sd`, `/design`, `/architecture`, `/hld`, `/lld`, `/whiteboards` |
| `/feeds`                   | `/feed`, `/rss`, `/atom`, `/activity`, `/updates`, `/blog-feed`                                                                                  |
| `/contact`                 | `/hire`, `/email`, `/reach`, `/get-in-touch`, `/getintouch`, `/connect`                                                                          |
| `/privacy`                 | `/policy`, `/privacy-policy`, `/privacypolicy`, `/legal`                                                                                         |
| `/secret`                  | `/secrets`, `/trophy`, `/trophies`, `/easter-eggs`, `/eastereggs`                                                                                |
| `/credits`                 | `/credit`, `/thanks`, `/acknowledgements`, `/acknowledgments`                                                                                    |
| `/phoenix`                 | `/bird`, `/mascot`                                                                                                                               |

### Also canonical (few or no public aliases)

| Path                 | Notes                                            |
| -------------------- | ------------------------------------------------ |
| `/`                  | Home                                             |
| `/lab`               | Redirects to `/competitive-programming` (legacy) |
| `/humans.txt`        | Content-negotiated humans.txt                    |
| `/robots.txt`        | Always plain text                                |
| `/sitemap.xml`       | Sitemap                                          |
| `/feeds/medium.xml`  | Same-origin Medium RSS proxy                     |
| `/feeds/youtube.xml` | Same-origin YouTube Atom proxy                   |
| `/feeds/github.atom` | Same-origin GitHub Atom proxy                    |
| `/api/contact`       | Contact form POST                                |
| `/api/chat`          | Ask Ayush server stream (off unless enabled)     |
| `/api/commits`       | Commit-rain messages by time window              |

---

## Dynamic slug aliases

### Work (`/work/:slug`)

| Canonical       | Alternates                                      |
| --------------- | ----------------------------------------------- |
| `/work/maestro` | `/work/xmai`, `/work/maestero`, `/work/mastero` |

### System design (`/system-design/:slug`)

Alternates also work under page aliases (e.g. `/sysdesign/shortener` →
`/system-design/url-shortener`).

| Canonical                                 | Slug alternates                                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `/system-design/url-shortener`            | `urlshortener`, `shortener`, `url-short`, `bitly`, `short-url`, `shorturl`          |
| `/system-design/rate-limiter`             | `ratelimiter`, `rate-limit`, `ratelimit`, `throttle`, `throttling`                  |
| `/system-design/job-scheduler`            | `jobscheduler`, `job-queue`, `jobqueue`, `scheduler`, `task-queue`, `taskqueue`     |
| `/system-design/log-analytics`            | `loganalytics`, `logs`, `log-pipeline`, `observability-logs`, `elk`                 |
| `/system-design/sim-regression-dashboard` | `sim-regression`, `simregression`, `regression-dashboard`, `regression`, `sim-dash` |
| `/system-design/waveform-compression`     | `waveform`, `waveforms`, `waveformcompression`, `vcd`, `fsdb`, `wave-compress`      |

---

## Full redirect list

| From                                      | To                                        |
| ----------------------------------------- | ----------------------------------------- |
| `/me`                                     | `/about`                                  |
| `/bio`                                    | `/about`                                  |
| `/profile`                                | `/about`                                  |
| `/about-me`                               | `/about`                                  |
| `/aboutme`                                | `/about`                                  |
| `/projects`                               | `/work`                                   |
| `/project`                                | `/work`                                   |
| `/portfolio`                              | `/work`                                   |
| `/case-studies`                           | `/work`                                   |
| `/casestudies`                            | `/work`                                   |
| `/works`                                  | `/work`                                   |
| `/skill`                                  | `/skills`                                 |
| `/stack`                                  | `/skills`                                 |
| `/tech`                                   | `/skills`                                 |
| `/technology`                             | `/skills`                                 |
| `/technologies`                           | `/skills`                                 |
| `/arsenal`                                | `/skills`                                 |
| `/exp`                                    | `/experience`                             |
| `/career`                                 | `/experience`                             |
| `/jobs`                                   | `/experience`                             |
| `/timeline`                               | `/experience`                             |
| `/work-history`                           | `/experience`                             |
| `/workhistory`                            | `/experience`                             |
| `/currently`                              | `/now`                                    |
| `/atm`                                    | `/now`                                    |
| `/today`                                  | `/now`                                    |
| `/status`                                 | `/now`                                    |
| `/doing`                                  | `/now`                                    |
| `/cp`                                     | `/competitive-programming`                |
| `/competitive`                            | `/competitive-programming`                |
| `/coding`                                 | `/competitive-programming`                |
| `/leetcode`                               | `/competitive-programming`                |
| `/codeforces`                             | `/competitive-programming`                |
| `/practice`                               | `/competitive-programming`                |
| `/plans`                                  | `/competitive-programming`                |
| `/practice-and-plans`                     | `/competitive-programming`                |
| `/practiceandplans`                       | `/competitive-programming`                |
| `/craft`                                  | `/competitive-programming`                |
| `/sysdesign`                              | `/system-design`                          |
| `/systemdesign`                           | `/system-design`                          |
| `/system_design`                          | `/system-design`                          |
| `/sys-design`                             | `/system-design`                          |
| `/sys_design`                             | `/system-design`                          |
| `/sd`                                     | `/system-design`                          |
| `/design`                                 | `/system-design`                          |
| `/architecture`                           | `/system-design`                          |
| `/hld`                                    | `/system-design`                          |
| `/lld`                                    | `/system-design`                          |
| `/whiteboards`                            | `/system-design`                          |
| `/feed`                                   | `/feeds`                                  |
| `/rss`                                    | `/feeds`                                  |
| `/atom`                                   | `/feeds`                                  |
| `/activity`                               | `/feeds`                                  |
| `/updates`                                | `/feeds`                                  |
| `/blog-feed`                              | `/feeds`                                  |
| `/hire`                                   | `/contact`                                |
| `/email`                                  | `/contact`                                |
| `/reach`                                  | `/contact`                                |
| `/get-in-touch`                           | `/contact`                                |
| `/getintouch`                             | `/contact`                                |
| `/connect`                                | `/contact`                                |
| `/policy`                                 | `/privacy`                                |
| `/privacy-policy`                         | `/privacy`                                |
| `/privacypolicy`                          | `/privacy`                                |
| `/legal`                                  | `/privacy`                                |
| `/secrets`                                | `/secret`                                 |
| `/trophy`                                 | `/secret`                                 |
| `/trophies`                               | `/secret`                                 |
| `/easter-eggs`                            | `/secret`                                 |
| `/eastereggs`                             | `/secret`                                 |
| `/credit`                                 | `/credits`                                |
| `/thanks`                                 | `/credits`                                |
| `/acknowledgements`                       | `/credits`                                |
| `/acknowledgments`                        | `/credits`                                |
| `/bird`                                   | `/phoenix`                                |
| `/mascot`                                 | `/phoenix`                                |
| `/work/xmai`                              | `/work/maestro`                           |
| `/projects/xmai`                          | `/work/maestro`                           |
| `/projects/maestro`                       | `/work/maestro`                           |
| `/project/xmai`                           | `/work/maestro`                           |
| `/project/maestro`                        | `/work/maestro`                           |
| `/portfolio/xmai`                         | `/work/maestro`                           |
| `/portfolio/maestro`                      | `/work/maestro`                           |
| `/case-studies/xmai`                      | `/work/maestro`                           |
| `/case-studies/maestro`                   | `/work/maestro`                           |
| `/casestudies/xmai`                       | `/work/maestro`                           |
| `/casestudies/maestro`                    | `/work/maestro`                           |
| `/works/xmai`                             | `/work/maestro`                           |
| `/works/maestro`                          | `/work/maestro`                           |
| `/work/maestero`                          | `/work/maestro`                           |
| `/projects/maestero`                      | `/work/maestro`                           |
| `/project/maestero`                       | `/work/maestro`                           |
| `/portfolio/maestero`                     | `/work/maestro`                           |
| `/case-studies/maestero`                  | `/work/maestro`                           |
| `/casestudies/maestero`                   | `/work/maestro`                           |
| `/works/maestero`                         | `/work/maestro`                           |
| `/work/mastero`                           | `/work/maestro`                           |
| `/projects/mastero`                       | `/work/maestro`                           |
| `/project/mastero`                        | `/work/maestro`                           |
| `/portfolio/mastero`                      | `/work/maestro`                           |
| `/case-studies/mastero`                   | `/work/maestro`                           |
| `/casestudies/mastero`                    | `/work/maestro`                           |
| `/works/mastero`                          | `/work/maestro`                           |
| `/system-design/urlshortener`             | `/system-design/url-shortener`            |
| `/sysdesign/urlshortener`                 | `/system-design/url-shortener`            |
| `/sysdesign/url-shortener`                | `/system-design/url-shortener`            |
| `/systemdesign/urlshortener`              | `/system-design/url-shortener`            |
| `/systemdesign/url-shortener`             | `/system-design/url-shortener`            |
| `/system_design/urlshortener`             | `/system-design/url-shortener`            |
| `/system_design/url-shortener`            | `/system-design/url-shortener`            |
| `/sys-design/urlshortener`                | `/system-design/url-shortener`            |
| `/sys-design/url-shortener`               | `/system-design/url-shortener`            |
| `/sys_design/urlshortener`                | `/system-design/url-shortener`            |
| `/sys_design/url-shortener`               | `/system-design/url-shortener`            |
| `/sd/urlshortener`                        | `/system-design/url-shortener`            |
| `/sd/url-shortener`                       | `/system-design/url-shortener`            |
| `/design/urlshortener`                    | `/system-design/url-shortener`            |
| `/design/url-shortener`                   | `/system-design/url-shortener`            |
| `/architecture/urlshortener`              | `/system-design/url-shortener`            |
| `/architecture/url-shortener`             | `/system-design/url-shortener`            |
| `/hld/urlshortener`                       | `/system-design/url-shortener`            |
| `/hld/url-shortener`                      | `/system-design/url-shortener`            |
| `/lld/urlshortener`                       | `/system-design/url-shortener`            |
| `/lld/url-shortener`                      | `/system-design/url-shortener`            |
| `/whiteboards/urlshortener`               | `/system-design/url-shortener`            |
| `/whiteboards/url-shortener`              | `/system-design/url-shortener`            |
| `/system-design/shortener`                | `/system-design/url-shortener`            |
| `/sysdesign/shortener`                    | `/system-design/url-shortener`            |
| `/systemdesign/shortener`                 | `/system-design/url-shortener`            |
| `/system_design/shortener`                | `/system-design/url-shortener`            |
| `/sys-design/shortener`                   | `/system-design/url-shortener`            |
| `/sys_design/shortener`                   | `/system-design/url-shortener`            |
| `/sd/shortener`                           | `/system-design/url-shortener`            |
| `/design/shortener`                       | `/system-design/url-shortener`            |
| `/architecture/shortener`                 | `/system-design/url-shortener`            |
| `/hld/shortener`                          | `/system-design/url-shortener`            |
| `/lld/shortener`                          | `/system-design/url-shortener`            |
| `/whiteboards/shortener`                  | `/system-design/url-shortener`            |
| `/system-design/url-short`                | `/system-design/url-shortener`            |
| `/sysdesign/url-short`                    | `/system-design/url-shortener`            |
| `/systemdesign/url-short`                 | `/system-design/url-shortener`            |
| `/system_design/url-short`                | `/system-design/url-shortener`            |
| `/sys-design/url-short`                   | `/system-design/url-shortener`            |
| `/sys_design/url-short`                   | `/system-design/url-shortener`            |
| `/sd/url-short`                           | `/system-design/url-shortener`            |
| `/design/url-short`                       | `/system-design/url-shortener`            |
| `/architecture/url-short`                 | `/system-design/url-shortener`            |
| `/hld/url-short`                          | `/system-design/url-shortener`            |
| `/lld/url-short`                          | `/system-design/url-shortener`            |
| `/whiteboards/url-short`                  | `/system-design/url-shortener`            |
| `/system-design/bitly`                    | `/system-design/url-shortener`            |
| `/sysdesign/bitly`                        | `/system-design/url-shortener`            |
| `/systemdesign/bitly`                     | `/system-design/url-shortener`            |
| `/system_design/bitly`                    | `/system-design/url-shortener`            |
| `/sys-design/bitly`                       | `/system-design/url-shortener`            |
| `/sys_design/bitly`                       | `/system-design/url-shortener`            |
| `/sd/bitly`                               | `/system-design/url-shortener`            |
| `/design/bitly`                           | `/system-design/url-shortener`            |
| `/architecture/bitly`                     | `/system-design/url-shortener`            |
| `/hld/bitly`                              | `/system-design/url-shortener`            |
| `/lld/bitly`                              | `/system-design/url-shortener`            |
| `/whiteboards/bitly`                      | `/system-design/url-shortener`            |
| `/system-design/short-url`                | `/system-design/url-shortener`            |
| `/sysdesign/short-url`                    | `/system-design/url-shortener`            |
| `/systemdesign/short-url`                 | `/system-design/url-shortener`            |
| `/system_design/short-url`                | `/system-design/url-shortener`            |
| `/sys-design/short-url`                   | `/system-design/url-shortener`            |
| `/sys_design/short-url`                   | `/system-design/url-shortener`            |
| `/sd/short-url`                           | `/system-design/url-shortener`            |
| `/design/short-url`                       | `/system-design/url-shortener`            |
| `/architecture/short-url`                 | `/system-design/url-shortener`            |
| `/hld/short-url`                          | `/system-design/url-shortener`            |
| `/lld/short-url`                          | `/system-design/url-shortener`            |
| `/whiteboards/short-url`                  | `/system-design/url-shortener`            |
| `/system-design/shorturl`                 | `/system-design/url-shortener`            |
| `/sysdesign/shorturl`                     | `/system-design/url-shortener`            |
| `/systemdesign/shorturl`                  | `/system-design/url-shortener`            |
| `/system_design/shorturl`                 | `/system-design/url-shortener`            |
| `/sys-design/shorturl`                    | `/system-design/url-shortener`            |
| `/sys_design/shorturl`                    | `/system-design/url-shortener`            |
| `/sd/shorturl`                            | `/system-design/url-shortener`            |
| `/design/shorturl`                        | `/system-design/url-shortener`            |
| `/architecture/shorturl`                  | `/system-design/url-shortener`            |
| `/hld/shorturl`                           | `/system-design/url-shortener`            |
| `/lld/shorturl`                           | `/system-design/url-shortener`            |
| `/whiteboards/shorturl`                   | `/system-design/url-shortener`            |
| `/system-design/ratelimiter`              | `/system-design/rate-limiter`             |
| `/sysdesign/ratelimiter`                  | `/system-design/rate-limiter`             |
| `/sysdesign/rate-limiter`                 | `/system-design/rate-limiter`             |
| `/systemdesign/ratelimiter`               | `/system-design/rate-limiter`             |
| `/systemdesign/rate-limiter`              | `/system-design/rate-limiter`             |
| `/system_design/ratelimiter`              | `/system-design/rate-limiter`             |
| `/system_design/rate-limiter`             | `/system-design/rate-limiter`             |
| `/sys-design/ratelimiter`                 | `/system-design/rate-limiter`             |
| `/sys-design/rate-limiter`                | `/system-design/rate-limiter`             |
| `/sys_design/ratelimiter`                 | `/system-design/rate-limiter`             |
| `/sys_design/rate-limiter`                | `/system-design/rate-limiter`             |
| `/sd/ratelimiter`                         | `/system-design/rate-limiter`             |
| `/sd/rate-limiter`                        | `/system-design/rate-limiter`             |
| `/design/ratelimiter`                     | `/system-design/rate-limiter`             |
| `/design/rate-limiter`                    | `/system-design/rate-limiter`             |
| `/architecture/ratelimiter`               | `/system-design/rate-limiter`             |
| `/architecture/rate-limiter`              | `/system-design/rate-limiter`             |
| `/hld/ratelimiter`                        | `/system-design/rate-limiter`             |
| `/hld/rate-limiter`                       | `/system-design/rate-limiter`             |
| `/lld/ratelimiter`                        | `/system-design/rate-limiter`             |
| `/lld/rate-limiter`                       | `/system-design/rate-limiter`             |
| `/whiteboards/ratelimiter`                | `/system-design/rate-limiter`             |
| `/whiteboards/rate-limiter`               | `/system-design/rate-limiter`             |
| `/system-design/rate-limit`               | `/system-design/rate-limiter`             |
| `/sysdesign/rate-limit`                   | `/system-design/rate-limiter`             |
| `/systemdesign/rate-limit`                | `/system-design/rate-limiter`             |
| `/system_design/rate-limit`               | `/system-design/rate-limiter`             |
| `/sys-design/rate-limit`                  | `/system-design/rate-limiter`             |
| `/sys_design/rate-limit`                  | `/system-design/rate-limiter`             |
| `/sd/rate-limit`                          | `/system-design/rate-limiter`             |
| `/design/rate-limit`                      | `/system-design/rate-limiter`             |
| `/architecture/rate-limit`                | `/system-design/rate-limiter`             |
| `/hld/rate-limit`                         | `/system-design/rate-limiter`             |
| `/lld/rate-limit`                         | `/system-design/rate-limiter`             |
| `/whiteboards/rate-limit`                 | `/system-design/rate-limiter`             |
| `/system-design/ratelimit`                | `/system-design/rate-limiter`             |
| `/sysdesign/ratelimit`                    | `/system-design/rate-limiter`             |
| `/systemdesign/ratelimit`                 | `/system-design/rate-limiter`             |
| `/system_design/ratelimit`                | `/system-design/rate-limiter`             |
| `/sys-design/ratelimit`                   | `/system-design/rate-limiter`             |
| `/sys_design/ratelimit`                   | `/system-design/rate-limiter`             |
| `/sd/ratelimit`                           | `/system-design/rate-limiter`             |
| `/design/ratelimit`                       | `/system-design/rate-limiter`             |
| `/architecture/ratelimit`                 | `/system-design/rate-limiter`             |
| `/hld/ratelimit`                          | `/system-design/rate-limiter`             |
| `/lld/ratelimit`                          | `/system-design/rate-limiter`             |
| `/whiteboards/ratelimit`                  | `/system-design/rate-limiter`             |
| `/system-design/throttle`                 | `/system-design/rate-limiter`             |
| `/sysdesign/throttle`                     | `/system-design/rate-limiter`             |
| `/systemdesign/throttle`                  | `/system-design/rate-limiter`             |
| `/system_design/throttle`                 | `/system-design/rate-limiter`             |
| `/sys-design/throttle`                    | `/system-design/rate-limiter`             |
| `/sys_design/throttle`                    | `/system-design/rate-limiter`             |
| `/sd/throttle`                            | `/system-design/rate-limiter`             |
| `/design/throttle`                        | `/system-design/rate-limiter`             |
| `/architecture/throttle`                  | `/system-design/rate-limiter`             |
| `/hld/throttle`                           | `/system-design/rate-limiter`             |
| `/lld/throttle`                           | `/system-design/rate-limiter`             |
| `/whiteboards/throttle`                   | `/system-design/rate-limiter`             |
| `/system-design/throttling`               | `/system-design/rate-limiter`             |
| `/sysdesign/throttling`                   | `/system-design/rate-limiter`             |
| `/systemdesign/throttling`                | `/system-design/rate-limiter`             |
| `/system_design/throttling`               | `/system-design/rate-limiter`             |
| `/sys-design/throttling`                  | `/system-design/rate-limiter`             |
| `/sys_design/throttling`                  | `/system-design/rate-limiter`             |
| `/sd/throttling`                          | `/system-design/rate-limiter`             |
| `/design/throttling`                      | `/system-design/rate-limiter`             |
| `/architecture/throttling`                | `/system-design/rate-limiter`             |
| `/hld/throttling`                         | `/system-design/rate-limiter`             |
| `/lld/throttling`                         | `/system-design/rate-limiter`             |
| `/whiteboards/throttling`                 | `/system-design/rate-limiter`             |
| `/system-design/jobscheduler`             | `/system-design/job-scheduler`            |
| `/sysdesign/jobscheduler`                 | `/system-design/job-scheduler`            |
| `/sysdesign/job-scheduler`                | `/system-design/job-scheduler`            |
| `/systemdesign/jobscheduler`              | `/system-design/job-scheduler`            |
| `/systemdesign/job-scheduler`             | `/system-design/job-scheduler`            |
| `/system_design/jobscheduler`             | `/system-design/job-scheduler`            |
| `/system_design/job-scheduler`            | `/system-design/job-scheduler`            |
| `/sys-design/jobscheduler`                | `/system-design/job-scheduler`            |
| `/sys-design/job-scheduler`               | `/system-design/job-scheduler`            |
| `/sys_design/jobscheduler`                | `/system-design/job-scheduler`            |
| `/sys_design/job-scheduler`               | `/system-design/job-scheduler`            |
| `/sd/jobscheduler`                        | `/system-design/job-scheduler`            |
| `/sd/job-scheduler`                       | `/system-design/job-scheduler`            |
| `/design/jobscheduler`                    | `/system-design/job-scheduler`            |
| `/design/job-scheduler`                   | `/system-design/job-scheduler`            |
| `/architecture/jobscheduler`              | `/system-design/job-scheduler`            |
| `/architecture/job-scheduler`             | `/system-design/job-scheduler`            |
| `/hld/jobscheduler`                       | `/system-design/job-scheduler`            |
| `/hld/job-scheduler`                      | `/system-design/job-scheduler`            |
| `/lld/jobscheduler`                       | `/system-design/job-scheduler`            |
| `/lld/job-scheduler`                      | `/system-design/job-scheduler`            |
| `/whiteboards/jobscheduler`               | `/system-design/job-scheduler`            |
| `/whiteboards/job-scheduler`              | `/system-design/job-scheduler`            |
| `/system-design/job-queue`                | `/system-design/job-scheduler`            |
| `/sysdesign/job-queue`                    | `/system-design/job-scheduler`            |
| `/systemdesign/job-queue`                 | `/system-design/job-scheduler`            |
| `/system_design/job-queue`                | `/system-design/job-scheduler`            |
| `/sys-design/job-queue`                   | `/system-design/job-scheduler`            |
| `/sys_design/job-queue`                   | `/system-design/job-scheduler`            |
| `/sd/job-queue`                           | `/system-design/job-scheduler`            |
| `/design/job-queue`                       | `/system-design/job-scheduler`            |
| `/architecture/job-queue`                 | `/system-design/job-scheduler`            |
| `/hld/job-queue`                          | `/system-design/job-scheduler`            |
| `/lld/job-queue`                          | `/system-design/job-scheduler`            |
| `/whiteboards/job-queue`                  | `/system-design/job-scheduler`            |
| `/system-design/jobqueue`                 | `/system-design/job-scheduler`            |
| `/sysdesign/jobqueue`                     | `/system-design/job-scheduler`            |
| `/systemdesign/jobqueue`                  | `/system-design/job-scheduler`            |
| `/system_design/jobqueue`                 | `/system-design/job-scheduler`            |
| `/sys-design/jobqueue`                    | `/system-design/job-scheduler`            |
| `/sys_design/jobqueue`                    | `/system-design/job-scheduler`            |
| `/sd/jobqueue`                            | `/system-design/job-scheduler`            |
| `/design/jobqueue`                        | `/system-design/job-scheduler`            |
| `/architecture/jobqueue`                  | `/system-design/job-scheduler`            |
| `/hld/jobqueue`                           | `/system-design/job-scheduler`            |
| `/lld/jobqueue`                           | `/system-design/job-scheduler`            |
| `/whiteboards/jobqueue`                   | `/system-design/job-scheduler`            |
| `/system-design/scheduler`                | `/system-design/job-scheduler`            |
| `/sysdesign/scheduler`                    | `/system-design/job-scheduler`            |
| `/systemdesign/scheduler`                 | `/system-design/job-scheduler`            |
| `/system_design/scheduler`                | `/system-design/job-scheduler`            |
| `/sys-design/scheduler`                   | `/system-design/job-scheduler`            |
| `/sys_design/scheduler`                   | `/system-design/job-scheduler`            |
| `/sd/scheduler`                           | `/system-design/job-scheduler`            |
| `/design/scheduler`                       | `/system-design/job-scheduler`            |
| `/architecture/scheduler`                 | `/system-design/job-scheduler`            |
| `/hld/scheduler`                          | `/system-design/job-scheduler`            |
| `/lld/scheduler`                          | `/system-design/job-scheduler`            |
| `/whiteboards/scheduler`                  | `/system-design/job-scheduler`            |
| `/system-design/task-queue`               | `/system-design/job-scheduler`            |
| `/sysdesign/task-queue`                   | `/system-design/job-scheduler`            |
| `/systemdesign/task-queue`                | `/system-design/job-scheduler`            |
| `/system_design/task-queue`               | `/system-design/job-scheduler`            |
| `/sys-design/task-queue`                  | `/system-design/job-scheduler`            |
| `/sys_design/task-queue`                  | `/system-design/job-scheduler`            |
| `/sd/task-queue`                          | `/system-design/job-scheduler`            |
| `/design/task-queue`                      | `/system-design/job-scheduler`            |
| `/architecture/task-queue`                | `/system-design/job-scheduler`            |
| `/hld/task-queue`                         | `/system-design/job-scheduler`            |
| `/lld/task-queue`                         | `/system-design/job-scheduler`            |
| `/whiteboards/task-queue`                 | `/system-design/job-scheduler`            |
| `/system-design/taskqueue`                | `/system-design/job-scheduler`            |
| `/sysdesign/taskqueue`                    | `/system-design/job-scheduler`            |
| `/systemdesign/taskqueue`                 | `/system-design/job-scheduler`            |
| `/system_design/taskqueue`                | `/system-design/job-scheduler`            |
| `/sys-design/taskqueue`                   | `/system-design/job-scheduler`            |
| `/sys_design/taskqueue`                   | `/system-design/job-scheduler`            |
| `/sd/taskqueue`                           | `/system-design/job-scheduler`            |
| `/design/taskqueue`                       | `/system-design/job-scheduler`            |
| `/architecture/taskqueue`                 | `/system-design/job-scheduler`            |
| `/hld/taskqueue`                          | `/system-design/job-scheduler`            |
| `/lld/taskqueue`                          | `/system-design/job-scheduler`            |
| `/whiteboards/taskqueue`                  | `/system-design/job-scheduler`            |
| `/system-design/loganalytics`             | `/system-design/log-analytics`            |
| `/sysdesign/loganalytics`                 | `/system-design/log-analytics`            |
| `/sysdesign/log-analytics`                | `/system-design/log-analytics`            |
| `/systemdesign/loganalytics`              | `/system-design/log-analytics`            |
| `/systemdesign/log-analytics`             | `/system-design/log-analytics`            |
| `/system_design/loganalytics`             | `/system-design/log-analytics`            |
| `/system_design/log-analytics`            | `/system-design/log-analytics`            |
| `/sys-design/loganalytics`                | `/system-design/log-analytics`            |
| `/sys-design/log-analytics`               | `/system-design/log-analytics`            |
| `/sys_design/loganalytics`                | `/system-design/log-analytics`            |
| `/sys_design/log-analytics`               | `/system-design/log-analytics`            |
| `/sd/loganalytics`                        | `/system-design/log-analytics`            |
| `/sd/log-analytics`                       | `/system-design/log-analytics`            |
| `/design/loganalytics`                    | `/system-design/log-analytics`            |
| `/design/log-analytics`                   | `/system-design/log-analytics`            |
| `/architecture/loganalytics`              | `/system-design/log-analytics`            |
| `/architecture/log-analytics`             | `/system-design/log-analytics`            |
| `/hld/loganalytics`                       | `/system-design/log-analytics`            |
| `/hld/log-analytics`                      | `/system-design/log-analytics`            |
| `/lld/loganalytics`                       | `/system-design/log-analytics`            |
| `/lld/log-analytics`                      | `/system-design/log-analytics`            |
| `/whiteboards/loganalytics`               | `/system-design/log-analytics`            |
| `/whiteboards/log-analytics`              | `/system-design/log-analytics`            |
| `/system-design/logs`                     | `/system-design/log-analytics`            |
| `/sysdesign/logs`                         | `/system-design/log-analytics`            |
| `/systemdesign/logs`                      | `/system-design/log-analytics`            |
| `/system_design/logs`                     | `/system-design/log-analytics`            |
| `/sys-design/logs`                        | `/system-design/log-analytics`            |
| `/sys_design/logs`                        | `/system-design/log-analytics`            |
| `/sd/logs`                                | `/system-design/log-analytics`            |
| `/design/logs`                            | `/system-design/log-analytics`            |
| `/architecture/logs`                      | `/system-design/log-analytics`            |
| `/hld/logs`                               | `/system-design/log-analytics`            |
| `/lld/logs`                               | `/system-design/log-analytics`            |
| `/whiteboards/logs`                       | `/system-design/log-analytics`            |
| `/system-design/log-pipeline`             | `/system-design/log-analytics`            |
| `/sysdesign/log-pipeline`                 | `/system-design/log-analytics`            |
| `/systemdesign/log-pipeline`              | `/system-design/log-analytics`            |
| `/system_design/log-pipeline`             | `/system-design/log-analytics`            |
| `/sys-design/log-pipeline`                | `/system-design/log-analytics`            |
| `/sys_design/log-pipeline`                | `/system-design/log-analytics`            |
| `/sd/log-pipeline`                        | `/system-design/log-analytics`            |
| `/design/log-pipeline`                    | `/system-design/log-analytics`            |
| `/architecture/log-pipeline`              | `/system-design/log-analytics`            |
| `/hld/log-pipeline`                       | `/system-design/log-analytics`            |
| `/lld/log-pipeline`                       | `/system-design/log-analytics`            |
| `/whiteboards/log-pipeline`               | `/system-design/log-analytics`            |
| `/system-design/observability-logs`       | `/system-design/log-analytics`            |
| `/sysdesign/observability-logs`           | `/system-design/log-analytics`            |
| `/systemdesign/observability-logs`        | `/system-design/log-analytics`            |
| `/system_design/observability-logs`       | `/system-design/log-analytics`            |
| `/sys-design/observability-logs`          | `/system-design/log-analytics`            |
| `/sys_design/observability-logs`          | `/system-design/log-analytics`            |
| `/sd/observability-logs`                  | `/system-design/log-analytics`            |
| `/design/observability-logs`              | `/system-design/log-analytics`            |
| `/architecture/observability-logs`        | `/system-design/log-analytics`            |
| `/hld/observability-logs`                 | `/system-design/log-analytics`            |
| `/lld/observability-logs`                 | `/system-design/log-analytics`            |
| `/whiteboards/observability-logs`         | `/system-design/log-analytics`            |
| `/system-design/elk`                      | `/system-design/log-analytics`            |
| `/sysdesign/elk`                          | `/system-design/log-analytics`            |
| `/systemdesign/elk`                       | `/system-design/log-analytics`            |
| `/system_design/elk`                      | `/system-design/log-analytics`            |
| `/sys-design/elk`                         | `/system-design/log-analytics`            |
| `/sys_design/elk`                         | `/system-design/log-analytics`            |
| `/sd/elk`                                 | `/system-design/log-analytics`            |
| `/design/elk`                             | `/system-design/log-analytics`            |
| `/architecture/elk`                       | `/system-design/log-analytics`            |
| `/hld/elk`                                | `/system-design/log-analytics`            |
| `/lld/elk`                                | `/system-design/log-analytics`            |
| `/whiteboards/elk`                        | `/system-design/log-analytics`            |
| `/system-design/sim-regression`           | `/system-design/sim-regression-dashboard` |
| `/sysdesign/sim-regression`               | `/system-design/sim-regression-dashboard` |
| `/sysdesign/sim-regression-dashboard`     | `/system-design/sim-regression-dashboard` |
| `/systemdesign/sim-regression`            | `/system-design/sim-regression-dashboard` |
| `/systemdesign/sim-regression-dashboard`  | `/system-design/sim-regression-dashboard` |
| `/system_design/sim-regression`           | `/system-design/sim-regression-dashboard` |
| `/system_design/sim-regression-dashboard` | `/system-design/sim-regression-dashboard` |
| `/sys-design/sim-regression`              | `/system-design/sim-regression-dashboard` |
| `/sys-design/sim-regression-dashboard`    | `/system-design/sim-regression-dashboard` |
| `/sys_design/sim-regression`              | `/system-design/sim-regression-dashboard` |
| `/sys_design/sim-regression-dashboard`    | `/system-design/sim-regression-dashboard` |
| `/sd/sim-regression`                      | `/system-design/sim-regression-dashboard` |
| `/sd/sim-regression-dashboard`            | `/system-design/sim-regression-dashboard` |
| `/design/sim-regression`                  | `/system-design/sim-regression-dashboard` |
| `/design/sim-regression-dashboard`        | `/system-design/sim-regression-dashboard` |
| `/architecture/sim-regression`            | `/system-design/sim-regression-dashboard` |
| `/architecture/sim-regression-dashboard`  | `/system-design/sim-regression-dashboard` |
| `/hld/sim-regression`                     | `/system-design/sim-regression-dashboard` |
| `/hld/sim-regression-dashboard`           | `/system-design/sim-regression-dashboard` |
| `/lld/sim-regression`                     | `/system-design/sim-regression-dashboard` |
| `/lld/sim-regression-dashboard`           | `/system-design/sim-regression-dashboard` |
| `/whiteboards/sim-regression`             | `/system-design/sim-regression-dashboard` |
| `/whiteboards/sim-regression-dashboard`   | `/system-design/sim-regression-dashboard` |
| `/system-design/simregression`            | `/system-design/sim-regression-dashboard` |
| `/sysdesign/simregression`                | `/system-design/sim-regression-dashboard` |
| `/systemdesign/simregression`             | `/system-design/sim-regression-dashboard` |
| `/system_design/simregression`            | `/system-design/sim-regression-dashboard` |
| `/sys-design/simregression`               | `/system-design/sim-regression-dashboard` |
| `/sys_design/simregression`               | `/system-design/sim-regression-dashboard` |
| `/sd/simregression`                       | `/system-design/sim-regression-dashboard` |
| `/design/simregression`                   | `/system-design/sim-regression-dashboard` |
| `/architecture/simregression`             | `/system-design/sim-regression-dashboard` |
| `/hld/simregression`                      | `/system-design/sim-regression-dashboard` |
| `/lld/simregression`                      | `/system-design/sim-regression-dashboard` |
| `/whiteboards/simregression`              | `/system-design/sim-regression-dashboard` |
| `/system-design/regression-dashboard`     | `/system-design/sim-regression-dashboard` |
| `/sysdesign/regression-dashboard`         | `/system-design/sim-regression-dashboard` |
| `/systemdesign/regression-dashboard`      | `/system-design/sim-regression-dashboard` |
| `/system_design/regression-dashboard`     | `/system-design/sim-regression-dashboard` |
| `/sys-design/regression-dashboard`        | `/system-design/sim-regression-dashboard` |
| `/sys_design/regression-dashboard`        | `/system-design/sim-regression-dashboard` |
| `/sd/regression-dashboard`                | `/system-design/sim-regression-dashboard` |
| `/design/regression-dashboard`            | `/system-design/sim-regression-dashboard` |
| `/architecture/regression-dashboard`      | `/system-design/sim-regression-dashboard` |
| `/hld/regression-dashboard`               | `/system-design/sim-regression-dashboard` |
| `/lld/regression-dashboard`               | `/system-design/sim-regression-dashboard` |
| `/whiteboards/regression-dashboard`       | `/system-design/sim-regression-dashboard` |
| `/system-design/regression`               | `/system-design/sim-regression-dashboard` |
| `/sysdesign/regression`                   | `/system-design/sim-regression-dashboard` |
| `/systemdesign/regression`                | `/system-design/sim-regression-dashboard` |
| `/system_design/regression`               | `/system-design/sim-regression-dashboard` |
| `/sys-design/regression`                  | `/system-design/sim-regression-dashboard` |
| `/sys_design/regression`                  | `/system-design/sim-regression-dashboard` |
| `/sd/regression`                          | `/system-design/sim-regression-dashboard` |
| `/design/regression`                      | `/system-design/sim-regression-dashboard` |
| `/architecture/regression`                | `/system-design/sim-regression-dashboard` |
| `/hld/regression`                         | `/system-design/sim-regression-dashboard` |
| `/lld/regression`                         | `/system-design/sim-regression-dashboard` |
| `/whiteboards/regression`                 | `/system-design/sim-regression-dashboard` |
| `/system-design/sim-dash`                 | `/system-design/sim-regression-dashboard` |
| `/sysdesign/sim-dash`                     | `/system-design/sim-regression-dashboard` |
| `/systemdesign/sim-dash`                  | `/system-design/sim-regression-dashboard` |
| `/system_design/sim-dash`                 | `/system-design/sim-regression-dashboard` |
| `/sys-design/sim-dash`                    | `/system-design/sim-regression-dashboard` |
| `/sys_design/sim-dash`                    | `/system-design/sim-regression-dashboard` |
| `/sd/sim-dash`                            | `/system-design/sim-regression-dashboard` |
| `/design/sim-dash`                        | `/system-design/sim-regression-dashboard` |
| `/architecture/sim-dash`                  | `/system-design/sim-regression-dashboard` |
| `/hld/sim-dash`                           | `/system-design/sim-regression-dashboard` |
| `/lld/sim-dash`                           | `/system-design/sim-regression-dashboard` |
| `/whiteboards/sim-dash`                   | `/system-design/sim-regression-dashboard` |
| `/system-design/waveform`                 | `/system-design/waveform-compression`     |
| `/sysdesign/waveform`                     | `/system-design/waveform-compression`     |
| `/sysdesign/waveform-compression`         | `/system-design/waveform-compression`     |
| `/systemdesign/waveform`                  | `/system-design/waveform-compression`     |
| `/systemdesign/waveform-compression`      | `/system-design/waveform-compression`     |
| `/system_design/waveform`                 | `/system-design/waveform-compression`     |
| `/system_design/waveform-compression`     | `/system-design/waveform-compression`     |
| `/sys-design/waveform`                    | `/system-design/waveform-compression`     |
| `/sys-design/waveform-compression`        | `/system-design/waveform-compression`     |
| `/sys_design/waveform`                    | `/system-design/waveform-compression`     |
| `/sys_design/waveform-compression`        | `/system-design/waveform-compression`     |
| `/sd/waveform`                            | `/system-design/waveform-compression`     |
| `/sd/waveform-compression`                | `/system-design/waveform-compression`     |
| `/design/waveform`                        | `/system-design/waveform-compression`     |
| `/design/waveform-compression`            | `/system-design/waveform-compression`     |
| `/architecture/waveform`                  | `/system-design/waveform-compression`     |
| `/architecture/waveform-compression`      | `/system-design/waveform-compression`     |
| `/hld/waveform`                           | `/system-design/waveform-compression`     |
| `/hld/waveform-compression`               | `/system-design/waveform-compression`     |
| `/lld/waveform`                           | `/system-design/waveform-compression`     |
| `/lld/waveform-compression`               | `/system-design/waveform-compression`     |
| `/whiteboards/waveform`                   | `/system-design/waveform-compression`     |
| `/whiteboards/waveform-compression`       | `/system-design/waveform-compression`     |
| `/system-design/waveforms`                | `/system-design/waveform-compression`     |
| `/sysdesign/waveforms`                    | `/system-design/waveform-compression`     |
| `/systemdesign/waveforms`                 | `/system-design/waveform-compression`     |
| `/system_design/waveforms`                | `/system-design/waveform-compression`     |
| `/sys-design/waveforms`                   | `/system-design/waveform-compression`     |
| `/sys_design/waveforms`                   | `/system-design/waveform-compression`     |
| `/sd/waveforms`                           | `/system-design/waveform-compression`     |
| `/design/waveforms`                       | `/system-design/waveform-compression`     |
| `/architecture/waveforms`                 | `/system-design/waveform-compression`     |
| `/hld/waveforms`                          | `/system-design/waveform-compression`     |
| `/lld/waveforms`                          | `/system-design/waveform-compression`     |
| `/whiteboards/waveforms`                  | `/system-design/waveform-compression`     |
| `/system-design/waveformcompression`      | `/system-design/waveform-compression`     |
| `/sysdesign/waveformcompression`          | `/system-design/waveform-compression`     |
| `/systemdesign/waveformcompression`       | `/system-design/waveform-compression`     |
| `/system_design/waveformcompression`      | `/system-design/waveform-compression`     |
| `/sys-design/waveformcompression`         | `/system-design/waveform-compression`     |
| `/sys_design/waveformcompression`         | `/system-design/waveform-compression`     |
| `/sd/waveformcompression`                 | `/system-design/waveform-compression`     |
| `/design/waveformcompression`             | `/system-design/waveform-compression`     |
| `/architecture/waveformcompression`       | `/system-design/waveform-compression`     |
| `/hld/waveformcompression`                | `/system-design/waveform-compression`     |
| `/lld/waveformcompression`                | `/system-design/waveform-compression`     |
| `/whiteboards/waveformcompression`        | `/system-design/waveform-compression`     |
| `/system-design/vcd`                      | `/system-design/waveform-compression`     |
| `/sysdesign/vcd`                          | `/system-design/waveform-compression`     |
| `/systemdesign/vcd`                       | `/system-design/waveform-compression`     |
| `/system_design/vcd`                      | `/system-design/waveform-compression`     |
| `/sys-design/vcd`                         | `/system-design/waveform-compression`     |
| `/sys_design/vcd`                         | `/system-design/waveform-compression`     |
| `/sd/vcd`                                 | `/system-design/waveform-compression`     |
| `/design/vcd`                             | `/system-design/waveform-compression`     |
| `/architecture/vcd`                       | `/system-design/waveform-compression`     |
| `/hld/vcd`                                | `/system-design/waveform-compression`     |
| `/lld/vcd`                                | `/system-design/waveform-compression`     |
| `/whiteboards/vcd`                        | `/system-design/waveform-compression`     |
| `/system-design/fsdb`                     | `/system-design/waveform-compression`     |
| `/sysdesign/fsdb`                         | `/system-design/waveform-compression`     |
| `/systemdesign/fsdb`                      | `/system-design/waveform-compression`     |
| `/system_design/fsdb`                     | `/system-design/waveform-compression`     |
| `/sys-design/fsdb`                        | `/system-design/waveform-compression`     |
| `/sys_design/fsdb`                        | `/system-design/waveform-compression`     |
| `/sd/fsdb`                                | `/system-design/waveform-compression`     |
| `/design/fsdb`                            | `/system-design/waveform-compression`     |
| `/architecture/fsdb`                      | `/system-design/waveform-compression`     |
| `/hld/fsdb`                               | `/system-design/waveform-compression`     |
| `/lld/fsdb`                               | `/system-design/waveform-compression`     |
| `/whiteboards/fsdb`                       | `/system-design/waveform-compression`     |
| `/system-design/wave-compress`            | `/system-design/waveform-compression`     |
| `/sysdesign/wave-compress`                | `/system-design/waveform-compression`     |
| `/systemdesign/wave-compress`             | `/system-design/waveform-compression`     |
| `/system_design/wave-compress`            | `/system-design/waveform-compression`     |
| `/sys-design/wave-compress`               | `/system-design/waveform-compression`     |
| `/sys_design/wave-compress`               | `/system-design/waveform-compression`     |
| `/sd/wave-compress`                       | `/system-design/waveform-compression`     |
| `/design/wave-compress`                   | `/system-design/waveform-compression`     |
| `/architecture/wave-compress`             | `/system-design/waveform-compression`     |
| `/hld/wave-compress`                      | `/system-design/waveform-compression`     |
| `/lld/wave-compress`                      | `/system-design/waveform-compression`     |
| `/whiteboards/wave-compress`              | `/system-design/waveform-compression`     |

---

## Maintenance

1. Edit `src/lib/route-aliases.mjs` (`PAGE_ALIASES` / `SLUG_ALIASES`).
2. Rebuild so `next.config.mjs` picks up redirects.
3. Regenerate this doc:

```sh
node scripts/generate-endpoints-doc.mjs
```

Do **not** list aliases in the sitemap — only canonical URLs.
