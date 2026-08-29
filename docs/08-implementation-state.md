# EchoClass — Implementation State

> This document is the execution ledger for `docs/07-implementation-plan.md`.

## Status Legend
- [ ] NOT STARTED
- [~] IN PROGRESS
- [x] DONE
- [!] BLOCKED

## Current Milestone

**Current phase:** Phase 16 — Student Lesson Experience

**Documented exception:** Account controls and settings were added as an explicit product-quality slice in `docs/10-account-settings-plan.md` before continuing Phase 16. This addresses an existing shell/auth gap without introducing backend contracts.

## Completed Foundation / Product Work

### Phase 12 — Frontend Foundation
- [x] EC-120 — Frontend application foundation established.
- [x] EC-121 — Application providers established.
- [x] EC-121A — Theme system implemented and visually aligned with the visual prototype.
- [~] EC-122 — Shared API client: foundation exists, but the full planned contract/error/auth behavior is not yet complete.
- [~] EC-123 — Shared application shell: routing/navigation foundation exists; account controls and settings slice added.
- [ ] EC-124 — Global loading/empty/error/unauthorized/not-found states.

### Phase 13 — Authentication Frontend
- [~] EC-130 — Authentication page/flow foundation exists; verify against the full sign-up requirements before marking done.
- [ ] EC-131 — Verify-email page.
- [~] EC-132 — Sign-in flow foundation exists; demo session state added for shell controls.
- [~] EC-133 — Logout foundation added for development-only demo sessions; production logout remains dependent on real auth.
- [ ] EC-134 — Authenticated `/me` bootstrap.

### Phase 14 — Class Frontend
- [x] EC-140 through EC-144 — Existing class UI foundations implemented.
- [ ] EC-145 — Student management page.

### Phase 15 — Lesson Management Frontend
- [x] EC-150 and EC-151 — Teacher lesson management list and route implemented.
- [ ] EC-152 through EC-154 — Remaining lesson management work.

## Current Development Position

### Phase 16 — Student Lesson Experience
- [ ] EC-160 — Authorized lesson loader.
- [ ] EC-161 — HTML5 video player.
- [ ] EC-162 — Timestamp URL state.
- [ ] EC-163 — Echo reaction bar.
- [ ] EC-164 — Echo composer.
- [ ] EC-165 — Echo edit/delete.

## Account Controls and Settings Exception
- [x] Dedicated account/settings scope documented in `docs/10-account-settings-plan.md`.
- [x] Shared top-bar avatar/account menu implemented.
- [x] Development demo-session logout implemented.
- [x] Settings route implemented.
- [x] Light, dark, and system preferences exposed through the existing persisted theme provider.

## Execution Rules
1. Docs first: update or verify relevant requirements before implementation.
2. Small slices: implement one coherent feature slice per PR.
3. Build safety: run applicable lint, typecheck, test, format-check, and build commands before merge where runtime access is available.
4. No premature backend coupling: explicit typed fixtures are acceptable; undocumented API contracts are not.
5. State accuracy: only mark work done when its documented completion condition is satisfied.


## Echoes and Playback Reliability Fix — 2026-08-29
- [x] Echo creation route aligned with the lesson-scoped backend contract.
- [x] Lesson Echo query behavior stabilized.
- [x] Window-focus refetch disabled for authorized lesson playback to prevent video source replacement and restart.
- [x] Investigation and verification checklist documented in `docs/20-echoes-and-playback-focus-fix.md`.
