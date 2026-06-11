# Triple Challenge — Project Notes

## Workflow: merging changes to `main`

When asked to make changes to this repository, complete the delivery yourself
without waiting for auto-merge or asking the user to merge manually:

1. Commit and push the work to the session's working branch.
2. Open a pull request into `main`.
3. **Merge the pull request directly into `main` yourself** (a plain merge is
   fine). Do not wait for auto-merge and do not ask the user to merge.

Notes:
- This repo has no required status checks, so GitHub treats PRs as immediately
  mergeable — auto-merge is a no-op here, so merge directly instead.
- Pushes from cloud sessions can only go to `claude/*` branches (the GitHub
  proxy blocks direct pushes to `main`), which is why changes reach `main` via
  a PR that is then merged, rather than a direct push.

## Versioning

The version lives in the `APP_VERSION` constant in `js/scripts.js` and is shown
at the bottom of the app screens. Bump it as part of the same change you are
merging, following semantic-style rules:

- **Patch (`1.0.x`)** — bug fixes, small tweaks, single minor changes.
- **Minor (`1.x.0`)** — new features, significant UI changes, or multiple
  related changes. (Reset the patch number to 0, e.g. `v1.0.16` → `v1.1.0`.)
- **Major (`x.0.0`)** — complete rebuilds or breaking changes. (Reset minor and
  patch to 0, e.g. `v1.4.2` → `v2.0.0`.)

Pick the level by the largest-impact change in the merge. The upcoming UI
overhaul should be versioned as **`v1.1.0`**.
