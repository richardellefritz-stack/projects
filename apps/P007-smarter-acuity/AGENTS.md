# AGENTS.md — P007 SMARTER Acuity

Website + content pipeline deriving social posts, video assets, and dual living ebooks from controlled source material. Nested rules here win for files under this directory. See root AGENTS.md for repo-wide rules.

## Orientation
- Webpage-first dual-write: maintain working webpages → derive social posts (X + Instagram) and video assets (image + voiceover + text overlays) → simultaneously advance the two living ebook manuscripts.
- Public system only. High-agency coaching layer is out of scope.
- This is the first production use of the full multi-agent control plane (issues → draft PRs → CI + GATE vs CONVENTION).
- No invented facts. Every claim must trace to a source inside this project directory or be marked `TODO: SOURCE`.
- Brand: SMARTER Acuity (display / products) / @SMARTER_Acuity (handle). Underscore only in the handle.

## Source Provenance (Convention)
- Controlled copies of the two source ebooks live under `source/ebooks/`.
- `source/manifest.json` records the originating commit SHA (or equivalent) + copy timestamp for each ebook.
- Every generated asset must reference the relevant manifest entry.
- Updating a source copy requires updating the manifest in the same change.
- Do not reach outside this project for source material once the controlled copies exist.

## Build / test / run
Stack is not yet locked. Do not invent framework, static-site generator, video pipeline, or posting commands.
```
# Placeholder only — replace after operator locks the stack
# build: TBD
# test: TBD
# run / dev: TBD
```

## Notes
- Prefer editing existing files over creating new ones.
- Expand this file only when a demonstrated failure shows the current text is insufficient. Prefer deletion of unused rules.
- Production GO (merge to main, any external posting or deployment) remains with the human operator.
- Leave required checks green. All work proceeds via draft PRs.
