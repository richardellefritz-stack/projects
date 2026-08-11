# Production Workflow

This document describes the gated production graph used for every product built in this monorepo.

## The Graph

1. **Opportunity Sensing**
   Identify a candidate product: a market gap, an underserved niche, or a repeatable format with demonstrated demand. Output: a short opportunity doc under `docs/opportunities/`.

2. **Research**
   Validate and deepen the opportunity — audience, positioning, competitive landscape, source material. Primarily NotebookLM-driven, with Claude/Grok support as needed.

3. **Architecture**
   Define the concrete shape of the product: format, components, tech/tooling choices, deliverable structure, and the spec each generation agent will work from.

4. **Parallel Generation**
   Execution agents (Grok Heavy's Harper, Benjamin, Lucas) produce the product's components in parallel against the architecture spec.

5. **Quality Gate**
   Gemini reviews generated output against the spec and rubric, and decides: continue, revise, escalate, or terminate. Escalations (stuck loops or deep technical review) route to Claude.

6. **Productize**
   Approved output is packaged into a sellable deliverable — formatting, assets, listing copy, distribution packaging.

7. **Feedback**
   Post-launch signal (sales, conversion, reviews) feeds back into Opportunity Sensing for the next cycle.

## Roles by Stage

| Stage | Primary Owner |
|---|---|
| Opportunity Sensing | Grok (lead) |
| Research | NotebookLM |
| Architecture | Grok Heavy team |
| Parallel Generation | Grok Heavy team (Harper, Benjamin, Lucas) |
| Quality Gate | Gemini |
| Escalation (stuck loop / technical review) | Claude |
| Productize | Grok Heavy team |
| Feedback | Grok (lead), informing next Opportunity Sensing pass |

## Human Checkpoints

Human review occurs at three points only: kickoff, any stuck-loop/terminate escalation, and final deliverable approval. All other stages run autonomously within the loop.
