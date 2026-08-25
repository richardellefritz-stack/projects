# Source Material (Controlled Copies)

This directory holds **controlled copies** of the two source ebooks for SMARTER Acuity.

## Process
1. Copy the current version of each ebook into the corresponding subdirectory under `ebooks/`.
2. Update `manifest.json` in the same commit with the originating commit SHA (or equivalent provenance identifier) and the copy timestamp.
3. All generated assets (web pages, social posts, video scripts, living ebook drafts) must reference the relevant entry in the manifest.

Do not reach outside this project for source material once the controlled copies exist. This prevents stale-source failure modes.

When the source ebooks are updated upstream, repeat the controlled-copy + manifest update process as a deliberate change.
