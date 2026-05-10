# Contributing to job-tracker

Thank you for taking the time to contribute!

## Development Setup

```bash
git clone https://github.com/KrupeshVachhani/job-tracker.git
cd job-tracker
npm install
npm run dev
```

Before committing, always run:

```bash
npm run build   # must pass with zero errors
npm run lint    # must pass with zero warnings
```

## Commit Conventions

Format: `<type>(<scope>): <description>`

| Type | When to use |
|------|-------------|
| `feat` | New feature or user-facing capability |
| `fix` | Bug fix |
| `chore` | Tooling, config, dependencies |
| `docs` | Documentation only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Formatting, CSS, UI polish — no logic changes |

**Scope** is optional but encouraged (e.g. `phase-2`, `storage`, `modal`).

Examples:
```
feat(modal): add keyboard trap for accessibility
fix(storage): handle concurrent writes without data loss
docs(readme): add screenshot of dashboard
```

One logical change per commit. Do not squash unrelated changes into one commit.

## Pull Request Process

1. Fork the repository and create a feature branch from `main`.
2. Make your changes with one commit per logical unit of work.
3. Ensure `npm run build` and `npm run lint` both pass.
4. Open a PR against `main` with a clear description of what changed and why.
5. Keep PRs focused — one feature or fix per PR.

## Code Style

- TypeScript strict mode — no `any`, no type assertions unless unavoidable.
- No comments that restate what the code does — only explain *why* when non-obvious.
- No unused imports, variables, or dead code.
- Prefer explicit types over inference where it aids readability.

## Local Data

The `data/` directory is git-ignored. `data/applications.json` is created automatically on first API call. To reset, delete the file. To test resume upload, drop a PDF at `data/resumes/starter.pdf`.

## Reporting Issues

Open an issue at [https://github.com/KrupeshVachhani/job-tracker/issues](https://github.com/KrupeshVachhani/job-tracker/issues) with steps to reproduce, expected behaviour, and actual behaviour.
