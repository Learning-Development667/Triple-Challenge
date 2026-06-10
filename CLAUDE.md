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
