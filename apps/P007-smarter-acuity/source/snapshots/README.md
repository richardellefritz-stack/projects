# source/snapshots/

Replaces the retired `source/ebooks/`.

## What lives here

Versioned, SHA-stamped captures of the two living manuscripts:

- `triumph/` — *The Triumph of Western Civilization* (14 chapters, monthly-root calendar)
- `why-it-works/` — *Why Western Civilization Works* (Introduction + the seven permanent dual-pair chapters + Conclusion)

## What a snapshot is, and is not

A snapshot is a **record**, so a published page can state which manuscript version it corresponded to at the time.

A snapshot is **not a source.** Nothing cites it. The manuscripts are derived outputs built from claims, exactly like a social post — they sit downstream of the provenance floor, not underneath it.

A claim that cites anything in this directory is refused by rule R1. A corpus entry whose `local_path` resolves here is refused by rule R2.

## Snapshot lifecycle

Registered in `source/manifest.json` under `snapshots[]`, carrying `commit_sha`, `taken_at`, `freeze_until`, and `resync_state`.

`stale` blocks publishing, not reading. `expired` blocks both. Re-taking a snapshot is an operator action.

See `source/PROVENANCE.md` for the full model.
