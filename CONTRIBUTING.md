# Contributing

Thanks for your interest in this project.

## Workflow

1. Create a branch from `main` (`feat/...`, `fix/...`, `chore/...`).
2. Make your change. Keep it focused.
3. Run the checks locally:
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```
4. Open a pull request. CI (lint, typecheck, build) must pass and the code owner
   must approve before merge. `main` is protected: no direct pushes, no force
   pushes, squash-merge only.

## Conventions

- TypeScript strict. Server Components by default; `'use client'` only on
  interactive leaves.
- All Supabase access stays server-side. Never import the service-role client
  into a client component.
- Match the existing style (Tailwind utility classes, the design tokens in
  `globals.css`). No em dashes in user-facing copy.
