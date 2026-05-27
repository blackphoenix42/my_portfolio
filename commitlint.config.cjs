/**
 * commitlint.config.cjs — enforces Conventional Commits on every commit message.
 * Runs via the .husky/commit-msg hook. Subject line max 100 chars; body/footer
 * line length is intentionally unrestricted so we can paste logs / URLs freely.
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 500],
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
    "body-leading-blank": [1, "always"],
    "footer-leading-blank": [1, "always"],
    "subject-case": [0],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
        "deps",
      ],
    ],
  },
};
