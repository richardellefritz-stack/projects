# AGENTS.md

Private monorepo for a multi-project digital product pipeline. Projects are
independent; each lives under its own PROJECT_CODE directory (P001, P007, ...)
and has its own AGENTS.md with build, test, and run instructions.

## Orientation
- Read the AGENTS.md nearest the files you are editing. It wins over this file.
- Read anywhere in the repo. Write only inside the project directory you were
  asked to work in, unless the task says otherwise.
- The project registry and cross-project governance live in Notion, not here.
  Do not treat anything in this repo as the authority on scope or priority.

## Workflow
- Work on a branch. Open a **draft** PR. Do not merge.
- Leave required checks green. If a check fails and you cannot fix it, say so
  in the PR description rather than disabling, skipping, or weakening the check.
- The PR description states what changed, what you verified, and what you did
  not verify. Coverage limits are stated explicitly, not implied.
- Small, verifiable increments over large parallel generation.

## Non-negotiables
- No secrets in the repo. If you find a credential, key, or token committed,
  stop and report it in the PR. Do not "fix" it by rewriting history.
- No published or externally-visible side effects: no posting, sending,
  deploying, or purchasing. Write the code; the operator runs it.
- No invented facts. Any statistic, quotation, citation, or claim must trace to
  a source in the repo. If a source is missing, mark it `TODO: SOURCE` rather
  than filling the gap. Identifying gaps is in scope; filling them is not.
- Anything touching payments, license keys, or entitlements gets flagged for
  review in the PR description, however small the change.

## Style
- Prefer editing existing files to creating new ones.
- Match the conventions already present in the project you are editing.
- Do not add dependencies. If one is genuinely needed, stop and ask rather
  than adding it.
