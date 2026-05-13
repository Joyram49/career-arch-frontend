// commitlint.config.js
// Enforces Conventional Commits format on every git commit message.
// Installed via: npm install -D @commitlint/cli @commitlint/config-conventional
// Hook wired in: .husky/commit-msg → npx --no -- commitlint --edit "$1"

/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // ── Type ────────────────────────────────────────────────────────────────
    // Must be one of the allowed types below (level 2 = error)
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature for the user
        'fix', // Bug fix for the user
        'docs', // Documentation only changes
        'style', // Formatting, missing semi-colons — no logic change
        'refactor', // Code change that is neither a fix nor a feature
        'perf', // Code change that improves performance
        'test', // Adding or correcting tests
        'build', // Build system or external dependency changes (npm, etc.)
        'ci', // CI configuration changes (GitHub Actions, etc.)
        'chore', // Maintenance tasks (husky, lint, env config)
        'revert', // Reverts a previous commit
      ],
    ],
    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Type must not be empty
    'type-empty': [2, 'never'],

    // ── Scope ───────────────────────────────────────────────────────────────
    // Scope is optional, but must be lowercase if provided
    // Examples: (auth), (jobs), (dashboard), (org), (admin)
    'scope-case': [2, 'always', 'lower-case'],

    // ── Subject ─────────────────────────────────────────────────────────────
    // Subject must not be empty
    'subject-empty': [2, 'never'],
    // Subject must not end with a period
    'subject-full-stop': [2, 'never', '.'],
    // Subject must start lowercase (not PascalCase, not UPPER_CASE)
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],

    // ── Header (type + scope + subject combined) ─────────────────────────────
    // Full first line must not exceed 100 characters
    'header-max-length': [2, 'always', 100],

    // ── Body & Footer ────────────────────────────────────────────────────────
    // Body (if present) must be preceded by a blank line
    'body-leading-blank': [1, 'always'],
    // Footer (if present) must be preceded by a blank line
    'footer-leading-blank': [1, 'always'],
  },
};
