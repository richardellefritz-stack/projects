# Content vocabulary & tagging schema

This directory holds the machine-readable mirror of the Controlled Vocabulary and the Zod schema that enforces Dual-Pair Tagging Rule v2.1.

| File | Purpose |
|------|--------|
| `vocabulary.ts` | Canonical 12 root + 7 pair slugs (enums) |
| `tagging-schema.ts` | Zod schema: required root + primary pair; optional secondary only with namedSpan |

**Authority**
- Drive Controlled Vocabulary remains the human-readable source of truth.
- This mirror is the build-time source of truth for enums and validation.
- When the Drive vocabulary version changes, regenerate these files and update `DRIVE_POINTERS.md`.

**Next step**
Once the Astro project is scaffolded, import `pageTagSchema` into `src/content/config.ts` (or equivalent) so every content collection entry is validated at build time.
