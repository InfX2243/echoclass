# EchoClass — Implementation State

> This document is the execution ledger for `docs/07-implementation-plan.md`.
>
> **Rule:** implementation must follow the plan in order unless a dependency or explicit product decision requires a documented exception. Before each development step, re-check this file and the corresponding plan section. After a step is merged, update this file so it remains the source of truth for project progress.

## Status Legend

- [ ] NOT STARTED
- [~] IN PROGRESS
- [x] DONE
- [!] BLOCKED

## Current Milestone

**Current phase:** Phase 16 — Student Lesson Experience

**Next planned work after the current stopping point:** EC-162 — Timestamp URL state.

## Completed Foundation / Product Work

### Phase 0 — Repository and Engineering Foundation

- [x] EC-001 — Monorepo/workspace foundation established.
- [x] EC-002 — Shared TypeScript configuration established.
- [x] EC-003 — ESLint/Prettier tooling established.
- [x] EC-005 — Base test tooling/application test foundation established.
- [ ] EC-004 — Environment validation remains to be completed.

### Phase 12 — Frontend Foundation

- [x] EC-120 — Frontend application foundation established.
- [x] EC-121 — Application providers established.
- [x] EC-121A — Theme system implemented and visually aligned with the visual prototype.
- [~] EC-122 — Shared API client: foundation exists, but the full planned contract/error/auth behavior is not yet complete.
- [~] EC-123 — Shared application shell: routing/navigation foundation exists; continue against the documented shell requirements.
- [ ] EC-124 — Global loading/empty/error/unauthorized/not-found states.

### Phase 13 — Authentication Frontend

- [~] EC-130 — Authentication page/flow foundation exists; verify against the full sign-up requirements before marking done.
- [ ] EC-131 — Verify-email page.
- [~] EC-132 — Sign-in flow foundation exists; verify against the full planned behavior.
- [ ] EC-133 — Logout completion.
- [ ] EC-134 — Authenticated `/me` bootstrap.

### Phase 14 — Class Frontend

- [x] EC-140 — Classes index foundation implemented.
- [x] EC-141 — Teacher create/edit class UI implemented.
- [x] EC-142 — Join-class UI implemented.
- [x] EC-143 — Student class page implemented.
- [x] EC-144 — Teacher class management page implemented.
- [ ] EC-145 — Student management page.

### Phase 15 — Lesson Management Frontend

- [x] EC-150 — Teacher lesson management list implemented.
- [x] EC-151 — Teacher lesson-management route wired into the application.
- [ ] EC-152 — Edit lesson page.
- [ ] EC-153 — Upload page/component.
- [ ] EC-154 — Publish controls.

## Current Development Position

### Phase 16 — Student Lesson Experience

- [x] EC-160 — Authorized lesson loader implemented.
- [x] EC-161 — HTML5 video player implemented.
- [ ] EC-162 — Timestamp URL state.
- [ ] EC-163 — Echo reaction bar.
- [ ] EC-164 — Echo composer.
- [ ] EC-165 — Echo edit/delete.

### Phase 17 — Echo Timeline Frontend

- [ ] EC-170 — Timeline view model.
- [ ] Remaining Phase 17 tasks — not started.

## Later Planned Work

Phases 18 onward remain governed by `docs/07-implementation-plan.md` and are intentionally not started until their dependencies are complete. In particular, backend media authorization, Echo persistence, analytics, teacher responses, revisits, and later frontend workflows must not be implemented opportunistically ahead of the plan.

## Recent Implementation Record

- Teacher dashboard was implemented and routed.
- Teacher class management was implemented and routed.
- Teacher lesson management list was implemented and routed.
- Theme implementation was refined to align with the visual prototype.
- EC-160 authorized lesson loading was implemented.
- EC-161 HTML5 video playback was implemented with a reusable player component, seek control, play/pause, volume control, duration display, and URL-backed current position integration.
- The implementation work remains isolated in a draft PR for review.

## Execution Rules

1. **Docs first:** read the relevant requirements, architecture, component, code, implementation-plan, and implementation-state sections before coding.
2. **Small slices:** implement one coherent EC task (or a tightly coupled sub-slice) per PR.
3. **Plan fidelity:** do not invent a competing architecture or bypass documented domain boundaries.
4. **Build safety:** before opening a PR, run the repository's applicable lint, typecheck, test, format-check, and build commands and inspect CI where available.
5. **Review safety:** PRs should be draft until the implementation is checked; update the implementation state in the same documentation change when a milestone is actually complete.
6. **No premature backend coupling:** frontend visual/route work may use explicit typed fixtures or existing abstractions, but must not silently introduce undocumented API contracts.
7. **Security boundaries are mandatory:** authentication, ownership, membership, lesson state, and media access must follow the authorization sequence documented in `docs/06-code.md`.
8. **State accuracy:** only mark `[x]` when the task's documented "Done when" condition is satisfied. Use `[~]` when partially implemented.

## Source of Truth Order

When documents disagree, use this order:

1. `docs/01-requirements.md` — product requirements
2. `docs/02-page-architecture.md` — page/route architecture
3. `docs/03-wireframes.md` — structural UI intent
4. `docs/04-visual-prototype.md` — visual direction
5. `docs/05-component-architecture.md` — frontend component boundaries
6. `docs/06-code.md` — technical architecture and security boundaries
7. `docs/07-implementation-plan.md` — execution sequence
8. `docs/08-implementation-state.md` — current execution status

If implementation reveals a genuine contradiction, stop and update the relevant design document before proceeding rather than silently diverging.
