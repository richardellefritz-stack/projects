# projects

Private monorepo for multiple independent projects.

## Layout

```
projects/
├── README.md              # This file
├── .gitignore             # Shared ignore rules
├── apps/                  # Deployable applications
│   └── <app-name>/
├── libs/                  # Shared libraries / packages
│   └── <lib-name>/
└── docs/                  # Cross-project notes (optional)
    └── ...
```

## Adding a new project

1. Create a folder under `apps/` (or `libs/` for shared code).
2. Add a project-level `README.md` describing purpose, setup, and how to run.
3. Keep project-specific secrets out of git (use env files listed in `.gitignore`).

## Conventions

- One top-level folder per project under `apps/` or `libs/`.
- Prefer self-contained projects that can be opened and built independently.
- Shared tooling and ignore rules live at the repo root.

## Clone

```bash
git clone https://github.com/richardellefritz-stack/projects.git
cd projects
```
