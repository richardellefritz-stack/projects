# AGENTS.md — P007 SMARTER Acuity

Website + content pipeline deriving social posts, video assets, and dual living ebooks from a tiered source corpus and claims ledger. Nested rules here win for files under this directory. See root AGENTS.md for repo-wide rules.

## Orientation
- Webpage-first dual-write: maintain working webpages → derive social posts (X + Instagram) and video assets (image + voiceover + text overlays) → simultaneously advance the two living ebook manuscripts.
- Public system only. High-agency coaching layer is out of scope.
- This is the first production use of the full multi-agent control plane (issues → draft PRs → CI + GATE vs CONVENTION).
- No invented facts. Every claim must trace to a Tier 1 or Tier 2 corpus source via the claims ledger, or be marked `TODO: SOURCE`.
- Brand: SMARTER Acuity (display / products) / @SMARTER_Acuity (handle). Underscore only in the handle.

## Provenance

Run `node tools/validate-provenance.mjs` before opening a PR. It refuses on ten rules; the table in `source/PROVENANCE.md` §6 says which are GATE, which are CONVENTION, and which stay with the operator.

Common refusals and what they mean:

| Code | Meaning |
|---|---|
| `R1` | A claim cited something that is not a corpus source. |
| `R2` | A corpus entry points at project output — circular. |
| `R4` | A load-bearing claim rests on Tier 3 alone. |
| `R5` | An interpretive claim does not name and answer its counter-position. |
| `TIER2` | A Tier 2 entry has no nameable credential. Re-tier it to 3. |
| `SNAP` | Null, stale, or expired snapshot under a publishable artifact. |
| `VOICE` | Forbidden "X is not Y, it's Z" construction. |
| `CORPUS` | The shared corpus moved since this project stamped it. |

**`/corpus/` is read-only to agents.** Writing to it needs operator GO. The integrity gate does not prevent an edit — it makes one visible, by refusing any build whose `corpus_ref.sha256` no longer matches the file. When that fires, re-verify the affected claims and re-stamp under operator GO. Do not simply update the hash to make it green.

Publishing, merging to `main`, and any posting stay with the operator.

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
