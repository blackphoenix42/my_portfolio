# Changelog

All notable changes to this project are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project follows
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Email field with inline domain autocomplete (Tab / → to accept) on the contact form.
- `.github/` scaffolding: CI / CodeQL / Security / Stale / E2E workflows, issue & PR templates,
  Dependabot, CODEOWNERS, FUNDING.
- `docs/` folder: Architecture, Contributing, Code of Conduct, Privacy, Terms, Roadmap, Design Guide, ADRs.
- Vitest unit tests for `src/lib/*` (validation, utils, email subject/body, rate-limit).
- `sharp` installed for production image optimization.

### Changed

- Contact form: redundant "opportunity" checkbox removed; role moved to a pill-style picker;
  added live char counter and improved focus/hover affordances.

### Fixed

- Build failure in `roadmap-diagram.tsx` due to `noUncheckedIndexedAccess` arithmetic.

### Performance

- Hero SVG and project demo thumbs now pause animations when scrolled off-screen.
- Marquee gets explicit GPU promotion (`will-change: transform`, `translateZ(0)`).
- Removed `unoptimized` on certificate images so Next/sharp can shrink them.
- Dropped redundant `backdrop-blur` from project card badges.
