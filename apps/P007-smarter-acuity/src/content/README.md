# Content vocabulary & tagging schema

This directory holds the machine-readable mirror of the Controlled Vocabulary and the Zod schema that enforces Dual-Pair Tagging Rule v2.1.

| File | Purpose |
|------|--------|
| `vocabulary.ts` | Canonical 12 root + 7 pair slugs (enums) |
| `tagging-schema.ts` | Zod schema: required root + primary pair; optional secondary only with namedSpan |
| `weekday-map.ts` | Standing weekday → pair map and A/B weave labels |

**Authority**
- Drive Controlled Vocabulary remains the human-readable source of truth for tag strings.
- Master Context + `source/DECISION_2026-08-26_Weekday_Map_Fallback.md` govern which pair a given weekday carries.
- This mirror is the build-time source of truth for enums and validation.
- When the Drive vocabulary version changes, regenerate `vocabulary.ts` / `tagging-schema.ts` and update `DRIVE_POINTERS.md`.
- When the weekday map changes, update `weekday-map.ts` in the same commit as the decision file.

**Next step**
Once the Astro project is scaffolded, import `pageTagSchema` into `src/content/config.ts` (or equivalent) so every content collection entry is validated at build time.
