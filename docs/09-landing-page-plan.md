# EchoClass — Landing Page Plan

> This document records the explicit product-scope expansion for the public EchoClass landing page. It supplements the existing architecture and implementation plan without replacing or truncating prior documentation.

## Scope

The public route `/` becomes the professional landing experience for EchoClass. Existing authenticated routes remain unchanged.

The landing page will include:

- a compact public header with product anchors and authentication CTAs;
- a clear hero explaining the core EchoClass value;
- a value strip focused on capturing, seeing, and revisiting meaningful moments;
- a three-step learning loop: Watch → Echo → Revisit;
- product feature cards for timestamped Echoes, learning timelines, focused revisits, and classroom insight;
- a native UI-based product preview rather than stock imagery;
- dedicated student and teacher value messaging;
- a final account-creation CTA and minimal footer;
- responsive desktop, tablet, and mobile layouts.

## Visual Direction

The page should extend the existing EchoClass visual system rather than introduce a separate marketing identity:

- deep ink typography and structure;
- paper/chalk surfaces;
- warm amber for attention and emphasis;
- supportive green for progress and understanding;
- restrained borders, rounded surfaces, and generous spacing;
- product-oriented UI composition over generic stock visuals.

## Implementation Plan

### LP-001 — Documentation and route definition

- [x] Define the public landing-page scope and sections.
- [x] Preserve the existing authenticated route responsibilities.
- [x] Document the execution exception before implementation.
- **Done when:** this document is the source of truth for the landing-page slice.

### LP-002 — Landing page structure

- [ ] Build header and public navigation.
- [ ] Build hero and product preview.
- [ ] Build value strip and learning loop.
- [ ] Build feature grid.
- [ ] Build student/teacher value section.
- [ ] Build final CTA and footer.
- **Done when:** all documented sections render coherently on `/`.

### LP-003 — Responsive and interaction behavior

- [ ] Ensure layouts scale from desktop to mobile.
- [ ] Keep anchor navigation and CTAs keyboard accessible.
- [ ] Route `Sign in` to `/login`.
- [ ] Route account CTAs to `/register`.
- **Done when:** public navigation and responsive layouts work without changing authenticated flows.

### LP-004 — Build safety and review

- [ ] Run lint, typecheck, tests where available, format check, and production build.
- [ ] Inspect the final diff for route regressions and unintended documentation changes.
- **Done when:** applicable checks pass and the slice is ready for review.

## Boundary

This slice is presentation and routing work only. It must not add backend APIs, alter authorization behavior, or duplicate the production lesson/video implementation.

## After this slice

After the landing-page slice is merged, execution returns to the first unfinished item in Phase 16 unless another explicit product decision updates the plan.
