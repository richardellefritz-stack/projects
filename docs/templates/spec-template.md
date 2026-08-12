# Product Spec — [NNN: Product]

Stage: Architecture. Complete before Parallel Generation begins.

## 1. Name and positioning

## 2. Target audience

Include who this is explicitly *not* for. Honest disqualification reduces refunds and sharpens copy.

## 3. Components

What is being built. Mirror into [`deliverables-manifest.md`](deliverables-manifest.md).

## 4. Frozen interface contract

*Required when more than one workstream shares data (Agreement E).*

The authoritative source for any value, formula, terminology, or boundary used by more than one component. Written and frozen here **before** generation. Both sides build against this; it is not reconciled afterward.

| Shared item | Authoritative source | Frozen at |
|---|---|---|
| | | |

If a frozen value must change, it changes here first and every dependent component is re-checked.

## 5. Entitlement design

*Required for any product with a paid tier (Agreement D). Reviewed before generation.*

- **Free tier:** exactly what an unauthenticated visitor can do.
- **Paid tier:** exactly what unlocking adds.
- **Gate mechanism:** what enforces the boundary, and where it runs (client, server, function).
- **Verification:** how entitlement is checked. What the check depends on (keys, env vars, third-party availability).
- **Failure behaviour:** what happens when verification fails or is unavailable. Fail-closed by default — and if fail-closed, note that selling cannot begin until verification is live.
- **Known bypass surface:** dev flags, client-side state, CSS-only hiding, query params, anything a determined visitor could exploit. Each with its mitigation.

## 6. Success / quality criteria

What must be true for the Quality Gate to pass. Written so they can be checked against a built artifact, not only against source.

## 7. Pricing and packaging

## 8. Open questions and risks
