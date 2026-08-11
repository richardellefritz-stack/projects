# projects

**High-volume digital product factory, run on a multi-AI workflow.**

This monorepo is the production base for a portfolio of digital products, built and shipped through a coordinated multi-agent pipeline rather than a single-author process. The goal is repeatable throughput: identify a viable opportunity, research and architect it, generate the product in parallel across agents, gate it for quality, package it for sale, and feed results back into the next cycle.

## Structure

- `apps/` — individual shippable products (each product gets its own subfolder once it moves past the opportunity stage)
- `libs/` — shared code, templates, prompts, and tooling reused across products
- `docs/` — process documentation and per-product planning docs, including `docs/opportunities/` for candidate products before they're greenlit

## Workflow

See [`docs/workflow.md`](docs/workflow.md) for the full production graph: Opportunity Sensing → Research → Architecture → Parallel Generation → Quality Gate → Productize → Feedback.

## Team

The pipeline is run by a multi-AI team:

- **Grok / Super Grok Heavy** — lead AI and orchestrator; Grok Heavy's agents (Harper, Benjamin, Lucas) are the head team directing execution
- **Gemini** — gatekeeper; decides whether execution loops continue, revise, escalate, or terminate
- **Claude** — executes tasks at the team's direction, including technical inspection, refinement, and code/document review
- **NotebookLM** — knowledge management; produces briefs, documents, slide decks, and podcasts from approved deliverables

Human checkpoints occur at kickoff, stuck-loop/terminate escalation, and final deliverable approval. Otherwise the loop runs autonomously.
