# EchoClass — Granular Implementation Plan

> **Purpose:** This plan is intentionally granular. Each task is designed to be independently implementable and reviewable by an LLM or developer.

## Status Legend

- [ ] NOT STARTED
- [~] IN PROGRESS
- [x] DONE
- [!] BLOCKED

---

# Phase 0 — Repository and Engineering Foundation

## EC-001 — Initialize monorepo
- [ ] Create pnpm workspace.
- [ ] Create `apps/web`.
- [ ] Create `apps/api`.
- [ ] Create `packages/contracts`.
- [ ] Create `packages/domain`.
- [ ] Create `packages/config`.
- [ ] Add root scripts for install, lint, typecheck, test, and build.
- **Done when:** all workspaces resolve and root commands execute.

## EC-002 — Configure shared TypeScript
- [ ] Create base TypeScript configuration.
- [ ] Enable strict mode.
- [ ] Configure frontend aliases.
- [ ] Configure backend aliases where useful.
- **Done when:** every workspace typechecks.

## EC-003 — Configure formatting and linting
- [ ] Add ESLint.
- [ ] Add Prettier.
- [ ] Add ignore files.
- [ ] Add `lint` and `format:check`.
- **Done when:** intentionally invalid code is detected.

## EC-004 — Configure environment validation
- [ ] Define frontend environment schema.
- [ ] Define backend environment schema.
- [ ] Fail fast for missing required values.
- [ ] Document `.env.example` files.
- **Done when:** invalid configuration fails with a clear message.

## EC-005 — Establish test tooling
- [ ] Configure Vitest.
- [ ] Configure React Testing Library.
- [ ] Add Playwright skeleton.
- [ ] Add one smoke test per application.
- **Done when:** all test commands run locally.

---

# Phase 1 — Shared Contracts and Domain Model

## EC-010 — Define shared primitives
- [ ] Define ID types.
- [ ] Define ISO timestamp conventions.
- [ ] Define pagination/query primitives if needed.
- [ ] Define standard API error shape.
- **Done when:** both frontend and backend can import shared primitives.

## EC-011 — Define user contracts
- [ ] Define `UserRole`.
- [ ] Define application user schema.
- [ ] Define `/me` response schema.
- **Done when:** schemas compile and have validation tests.

## EC-012 — Define class contracts
- [ ] Define class entity.
- [ ] Define create/update schemas.
- [ ] Define class status.
- [ ] Define membership schema/status.
- [ ] Define invite-code schemas.
- **Done when:** invalid inputs are rejected.

## EC-013 — Define lesson contracts
- [ ] Define lesson entity.
- [ ] Define lesson status/content type.
- [ ] Define create/update/publish schemas.
- [ ] Define upload/playback response schemas.
- **Done when:** contracts are shared and tested.

## EC-014 — Define Echo contracts
- [ ] Define Echo type enum.
- [ ] Define Echo entity.
- [ ] Define create/update schemas.
- [ ] Validate timestamp bounds at schema/domain boundary where applicable.
- **Done when:** only supported Echo types validate.

## EC-015 — Define analytics contracts
- [ ] Define activity bucket.
- [ ] Define hotspot.
- [ ] Define type breakdown.
- [ ] Define lesson analytics response.
- **Done when:** frontend can render analytics without backend-specific types.

## EC-016 — Define revisit contracts
- [ ] Define revisit entity.
- [ ] Define revisit status.
- [ ] Define completion/understood mutation schema.
- **Done when:** state transitions are explicit.

---

# Phase 2 — Infrastructure Foundation

## EC-020 — Initialize AWS CDK project
- [ ] Create CDK TypeScript project.
- [ ] Define environment configuration.
- [ ] Add synth command.
- **Done when:** CDK synth succeeds.

## EC-021 — Provision Cognito
- [ ] Create user pool.
- [ ] Configure email verification.
- [ ] Configure app client.
- [ ] Export required identifiers.
- **Done when:** test user registration is possible.

## EC-022 — Provision DynamoDB
- [ ] Document access patterns before key design.
- [ ] Define table key strategy.
- [ ] Define required GSIs.
- [ ] Enable suitable backups/encryption defaults.
- **Done when:** every required access pattern has a documented query.

## EC-023 — Provision private media bucket
- [ ] Create S3 bucket.
- [ ] Block public access.
- [ ] Configure encryption.
- [ ] Define lifecycle policy if appropriate.
- **Done when:** anonymous object access fails.

## EC-024 — Provision CloudFront
- [ ] Create distribution.
- [ ] Configure S3 origin.
- [ ] Configure Origin Access Control.
- [ ] Prevent direct public bucket access.
- **Done when:** CloudFront can access private origin.

## EC-025 — Provision API and Lambdas
- [ ] Create API Gateway HTTP API.
- [ ] Create domain-oriented Lambda entry points.
- [ ] Configure routes.
- [ ] Configure CORS deliberately.
- [ ] Grant least-privilege IAM.
- **Done when:** authenticated health/smoke endpoint works.

## EC-026 — Provision observability
- [ ] Configure CloudWatch logs.
- [ ] Define structured log format.
- [ ] Ensure request failures are traceable.
- **Done when:** test failure can be located through logs.

---

# Phase 3 — Backend Foundation and Authentication

## EC-030 — Create backend HTTP foundation
- [ ] Parse requests.
- [ ] Add centralized response helpers.
- [ ] Add centralized error mapping.
- [ ] Add request IDs/log context.
- **Done when:** validation/domain/unexpected errors return predictable responses.

## EC-031 — Implement Cognito authentication middleware
- [ ] Read bearer token.
- [ ] Validate token.
- [ ] Extract Cognito `sub`.
- [ ] Reject missing/invalid tokens.
- **Done when:** protected test endpoint distinguishes 401 from success.

## EC-032 — Implement application-user resolution
- [ ] Resolve user by Cognito sub.
- [ ] Define behavior for missing application user.
- [ ] Attach application user to request context.
- **Done when:** backend can securely determine role.

## EC-033 — Implement secure application-user creation flow
- [ ] Decide trusted registration/bootstrap flow.
- [ ] Persist name, email, Cognito sub, and role.
- [ ] Ensure role establishment is backend-controlled.
- **Done when:** user exists in both identity and application layers.

## EC-034 — Implement `/api/v1/me`
- [ ] Require authentication.
- [ ] Return application user.
- [ ] Add contract tests.
- **Done when:** frontend can load identity and role.

---

# Phase 4 — Class Domain

## EC-040 — Implement DynamoDB class repository
- [ ] Create class item mapping.
- [ ] Implement create.
- [ ] Implement get by ID.
- [ ] Implement list by teacher.
- [ ] Implement update.
- [ ] Implement archive.
- **Done when:** repository tests cover all operations.

## EC-041 — Implement teacher class authorization
- [ ] Verify authenticated role.
- [ ] Verify class ownership.
- [ ] Reuse helper across class/lesson operations.
- **Done when:** changing class ID cannot expose another teacher's class.

## EC-042 — Implement create class API
- [ ] Validate body.
- [ ] Require teacher.
- [ ] Derive teacher identity server-side.
- [ ] Persist class.
- **Done when:** teacherId cannot be overridden by request body.

## EC-043 — Implement teacher class list API
- [ ] Require teacher.
- [ ] Query only authenticated teacher's classes.
- **Done when:** another teacher's classes never appear.

## EC-044 — Implement class detail/update/archive APIs
- [ ] Validate class ID.
- [ ] Enforce ownership.
- [ ] Validate state transitions.
- **Done when:** archived state behaves consistently.

---

# Phase 5 — Membership and Invite Codes

## EC-050 — Design membership storage/access pattern
- [ ] Support list student classes.
- [ ] Support membership validation.
- [ ] Support list class members.
- [ ] Support remove/reactivate semantics if required.
- **Done when:** each operation uses a documented DynamoDB query.

## EC-051 — Implement invite-code generation
- [ ] Generate non-sequential, difficult-to-guess code.
- [ ] Ensure uniqueness.
- [ ] Map to exactly one class.
- [ ] Reject archived classes.
- **Done when:** collision handling is tested.

## EC-052 — Implement student join API
- [ ] Require student role.
- [ ] Validate invite code.
- [ ] Resolve active class.
- [ ] Prevent duplicate enrollment with 409.
- [ ] Create ACTIVE membership.
- **Done when:** repeat join returns user-friendly conflict.

## EC-053 — Implement student class authorization
- [ ] Resolve ACTIVE membership.
- [ ] Reject REMOVED/no membership.
- **Done when:** guessed class IDs do not expose data.

## EC-054 — Implement member management APIs
- [ ] List members for class owner.
- [ ] Remove student membership.
- [ ] Prevent unauthorized teacher access.
- **Done when:** removed student immediately loses protected access.

---

# Phase 6 — Lesson Domain

## EC-060 — Implement lesson repository
- [ ] Create draft.
- [ ] Get lesson.
- [ ] List class lessons.
- [ ] Update metadata.
- [ ] Publish/unpublish/archive.
- **Done when:** state transitions are tested.

## EC-061 — Implement teacher lesson APIs
- [ ] Require teacher ownership through class.
- [ ] Create lesson.
- [ ] Update lesson.
- [ ] Publish lesson.
- [ ] Unpublish lesson.
- [ ] Archive lesson.
- **Done when:** teacher cannot mutate another teacher's lesson.

## EC-062 — Implement student lesson visibility
- [ ] Verify ACTIVE membership.
- [ ] Verify `PUBLISHED` status.
- [ ] Return 403/404 according to chosen policy.
- **Done when:** drafts/unpublished lessons are inaccessible to students.

## EC-063 — Implement class lesson listing
- [ ] Teacher sees manageable lesson set.
- [ ] Student sees published lessons only.
- **Done when:** same route/domain respects role and authorization.

---

# Phase 7 — Secure Media Upload and Delivery

## EC-070 — Implement trusted upload authorization
- [ ] Require teacher authentication.
- [ ] Verify class ownership via lesson.
- [ ] Derive S3 key server-side.
- [ ] Generate short-lived upload authorization.
- [ ] Restrict content type/size policy as defined.
- **Done when:** arbitrary object keys cannot be supplied by client.

## EC-071 — Implement direct browser upload
- [ ] Request upload authorization.
- [ ] Upload directly to S3.
- [ ] Track pending/uploading/success/error.
- [ ] Confirm upload completion with backend.
- **Done when:** API does not proxy video bytes.

## EC-072 — Implement secure playback authorization
- [ ] Verify teacher ownership OR student membership + published status.
- [ ] Generate short-lived CloudFront access.
- [ ] Avoid exposing unrestricted media URLs.
- **Done when:** unrelated users cannot play lesson media.

---

# Phase 8 — Echo Domain

## EC-080 — Implement Echo repository
- [ ] Create Echo.
- [ ] Get Echo by ID.
- [ ] List personal Echoes.
- [ ] List lesson Echoes/aggregate source data.
- [ ] Update owned Echo.
- [ ] Delete owned Echo.
- **Done when:** ownership checks are supported efficiently.

## EC-081 — Implement create Echo API
- [ ] Require student role.
- [ ] Verify lesson access.
- [ ] Derive student identity server-side.
- [ ] Validate timestamp and type.
- [ ] Persist optional note.
- **Done when:** studentId in request body is ignored/rejected.

## EC-082 — Implement update/delete Echo APIs
- [ ] Verify authenticated student owns Echo.
- [ ] Validate update.
- [ ] Return forbidden for another student's Echo.
- **Done when:** cross-user modification tests fail correctly.

## EC-083 — Implement personal Echo history API
- [ ] Query current student's Echoes.
- [ ] Support ordering/filtering as required.
- [ ] Include lesson/class context needed for navigation.
- **Done when:** student can open exact lesson moment from history.

---

# Phase 9 — Timeline and Hotspot Analytics

## EC-090 — Define deterministic hotspot configuration
- [ ] Define window size.
- [ ] Define activity threshold.
- [ ] Define adjacent-window merge behavior.
- [ ] Document configuration.
- **Done when:** algorithm behavior is predictable.

## EC-091 — Implement activity bucketing
- [ ] Group Echoes by time window.
- [ ] Count total activity.
- [ ] Count by Echo type.
- **Done when:** fixture data produces exact expected buckets.

## EC-092 — Implement hotspot detection
- [ ] Identify high-activity windows.
- [ ] Merge adjacent windows.
- [ ] Return start/end/count/breakdown.
- **Done when:** unit tests cover isolated, adjacent, and no-hotspot cases.

## EC-093 — Implement lesson timeline API
- [ ] Authorize lesson access.
- [ ] Return personal Echoes only for requesting student.
- [ ] Return collective aggregate activity.
- [ ] Return hotspots.
- [ ] Return teacher responses.
- **Done when:** privacy boundaries are preserved.

## EC-094 — Implement teacher analytics API
- [ ] Require lesson ownership.
- [ ] Return totals.
- [ ] Return type counts.
- [ ] Return unique participant count.
- [ ] Return activity ranges and hotspots.
- **Done when:** analytics do not expose unauthorized class data.

---

# Phase 10 — Teacher Responses

## EC-100 — Implement teacher response persistence
- [ ] Define response entity.
- [ ] Associate with lesson and timestamp/range.
- [ ] Implement create/update/delete.
- **Done when:** responses can be retrieved with timeline context.

## EC-101 — Implement teacher response authorization
- [ ] Require teacher.
- [ ] Verify lesson ownership.
- **Done when:** teacher cannot respond to another teacher's lesson.

## EC-102 — Include responses in student lesson context
- [ ] Return contextual responses only when lesson access is valid.
- [ ] Render response near selected timestamp/hotspot.
- **Done when:** student can see teacher explanation at relevant moment.

---

# Phase 11 — Revisit Domain

## EC-110 — Define revisit scheduling policy
- [ ] Document simple V1 rules.
- [ ] Define which Echo types generate revisits.
- [ ] Define due-date calculation.
- [ ] Define duplicate handling.
- **Done when:** policy is deterministic and testable.

## EC-111 — Implement revisit creation/update
- [ ] Create revisit from eligible Echo/moment.
- [ ] Store lesson, timestamp, due date, status.
- **Done when:** repeated qualifying actions do not create unintended duplicates.

## EC-112 — Implement revisit list API
- [ ] Require student.
- [ ] Return current student's revisits only.
- [ ] Separate pending/completed as needed.
- **Done when:** no cross-user revisit data is visible.

## EC-113 — Implement revisit completion API
- [ ] Verify ownership.
- [ ] Mark completed/understood.
- [ ] Persist completion timestamp if defined.
- **Done when:** UI can reflect successful completion.

---

# Phase 12 — Frontend Foundation

## EC-120 — Initialize Next.js application
- [ ] Configure App Router.
- [ ] Configure Tailwind.
- [ ] Configure shadcn/ui.
- [ ] Configure strict TypeScript.
- **Done when:** production build succeeds.

## EC-121 — Configure providers
- [ ] QueryClient provider.
- [ ] Toast provider.
- [ ] Authentication/session provider as chosen.
- **Done when:** app-wide providers initialize once.

## EC-122 — Build shared API client
- [ ] Attach auth token.
- [ ] Parse standard responses.
- [ ] Normalize errors.
- **Done when:** features do not duplicate fetch boilerplate.

## EC-123 — Build shared application shell
- [ ] Header.
- [ ] Desktop sidebar.
- [ ] Mobile navigation.
- [ ] Role-aware navigation.
- **Done when:** teacher/student nav differs correctly.

## EC-124 — Build global states
- [ ] Loading state.
- [ ] Empty state.
- [ ] Error state.
- [ ] Unauthorized state.
- [ ] Not-found state.
- **Done when:** pages can reuse consistent feedback components.

---

# Phase 13 — Authentication Frontend

## EC-130 — Implement sign-up page
- [ ] Name/email/password/role fields.
- [ ] Zod validation.
- [ ] Submit/loading/error states.
- [ ] Redirect to verification.
- **Done when:** new user can start registration flow.

## EC-131 — Implement verify-email page
- [ ] Verification code input.
- [ ] Verify action.
- [ ] Resend action.
- [ ] Error states.
- **Done when:** verified user can proceed to sign in.

## EC-132 — Implement sign-in page
- [ ] Email/password form.
- [ ] Invalid credential state.
- [ ] Unverified state.
- [ ] Successful session handling.
- **Done when:** successful sign-in reaches dashboard.

## EC-133 — Implement logout
- [ ] Clear/terminate session.
- [ ] Clear sensitive cached state.
- [ ] Redirect to sign-in.
- **Done when:** protected UI is inaccessible after logout.

## EC-134 — Implement authenticated bootstrap
- [ ] Load `/me`.
- [ ] Determine role.
- [ ] Handle missing/invalid application user.
- **Done when:** dashboard renders correct role experience.

---

# Phase 14 — Class Frontend

## EC-140 — Implement classes index
- [ ] Load role-appropriate classes.
- [ ] Student: Join Class action.
- [ ] Teacher: Create Class action.
- [ ] Loading/empty/error states.
- **Done when:** unrelated classes never appear.

## EC-141 — Implement create/edit class UI
- [ ] Form validation.
- [ ] Create mutation.
- [ ] Edit mutation.
- [ ] Success/error feedback.
- **Done when:** teacher can manage own class.

## EC-142 — Implement join-class UI
- [ ] Invite code form.
- [ ] Invalid code state.
- [ ] Already enrolled state.
- [ ] Network error state.
- [ ] Redirect to joined class.
- **Done when:** successful enrollment updates class list.

## EC-143 — Implement student class page
- [ ] Class header.
- [ ] Published lesson list.
- [ ] Recent/contextual activity if required.
- **Done when:** student sees only accessible published content.

## EC-144 — Implement teacher class page
- [ ] Class header.
- [ ] Lessons.
- [ ] Invite code.
- [ ] Student management link.
- [ ] Create lesson action.
- [ ] Edit/archive actions.
- **Done when:** class becomes teacher's management hub.

## EC-145 — Implement student management page
- [ ] Member list.
- [ ] Remove action with confirmation.
- [ ] Loading/error states.
- **Done when:** teacher can remove only students in owned class.

---

# Phase 15 — Lesson Management Frontend

## EC-150 — Implement lesson list
- [ ] Teacher-only management list.
- [ ] Draft/published/archived state display.
- [ ] Create/edit/upload/analytics actions.
- **Done when:** lesson lifecycle is understandable.

## EC-151 — Implement create lesson page
- [ ] Metadata form.
- [ ] Draft creation.
- [ ] Redirect to upload/manage flow.
- **Done when:** lesson exists before media upload.

## EC-152 — Implement edit lesson page
- [ ] Load lesson.
- [ ] Edit metadata.
- [ ] Handle unavailable/forbidden state.
- **Done when:** teacher can update owned lesson.

## EC-153 — Implement upload page/component
- [ ] Select file.
- [ ] Validate client-side constraints.
- [ ] Request upload authorization.
- [ ] Upload with progress.
- [ ] Handle failure/retry.
- [ ] Confirm completion.
- **Done when:** uploaded media is ready for publishing.

## EC-154 — Implement publish controls
- [ ] Publish confirmation/state.
- [ ] Unpublish action.
- [ ] Archive action.
- [ ] Disable invalid transitions.
- **Done when:** lesson visibility changes correctly.

---

# Phase 16 — Student Lesson Experience

## EC-160 — Implement authorized lesson loader
- [ ] Load lesson metadata.
- [ ] Request playback access.
- [ ] Load timeline context.
- [ ] Handle loading/error/forbidden.
- **Done when:** student lesson page has all required data.

## EC-161 — Implement HTML5 video player
- [ ] Play/pause.
- [ ] Seek.
- [ ] Current time tracking.
- [ ] Duration tracking.
- [ ] Volume.
- [ ] Fullscreen where supported.
- **Done when:** current timestamp is exposed to child controls.

## EC-162 — Implement timestamp URL state
- [ ] Read timestamp query parameter.
- [ ] Seek on initial load.
- [ ] Update selection/navigation without excessive history writes.
- **Done when:** My Echoes/Revisit can open exact moment.

## EC-163 — Implement Echo reaction bar
- [ ] Confused.
- [ ] Important.
- [ ] Insight.
- [ ] Capture current timestamp.
- [ ] Accessible labels.
- **Done when:** reaction can open Echo composer.

## EC-164 — Implement Echo composer
- [ ] Show selected type/timestamp.
- [ ] Optional note.
- [ ] Save mutation.
- [ ] Cancel.
- [ ] Error/retry state.
- **Done when:** successful Echo updates local/server state.

## EC-165 — Implement Echo edit/delete
- [ ] Open own Echo.
- [ ] Edit note/type if allowed.
- [ ] Confirm delete.
- [ ] Update query cache.
- **Done when:** UI cannot offer edit/delete for non-owned Echoes.

---

# Phase 17 — Echo Timeline Frontend

## EC-170 — Define timeline view model
- [ ] Normalize API data.
- [ ] Convert seconds to visual positions.
- [ ] Handle zero/unknown duration.
- **Done when:** timeline logic is unit-tested.

## EC-171 — Render personal Echo markers
- [ ] Position by timestamp.
- [ ] Distinguish Echo types.
- [ ] Provide keyboard-accessible selection.
- **Done when:** selecting marker seeks player.

## EC-172 — Render collective activity
- [ ] Render activity intensity by bucket.
- [ ] Avoid exposing private notes/identity.
- **Done when:** collective signal is understandable at a glance.

## EC-173 — Render hotspots
- [ ] Show hotspot range.
- [ ] Show selected state.
- [ ] Show aggregate breakdown.
- **Done when:** hotspot meaning is “high interaction,” not automatically “confusion.”

## EC-174 — Implement moment details panel
- [ ] Selected timestamp.
- [ ] Total activity.
- [ ] Echo-type counts.
- [ ] Teacher response.
- [ ] Navigation to exact moment.
- **Done when:** timeline context is understandable without leaving lesson.

---

# Phase 18 — Dashboards and History

## EC-180 — Implement student dashboard
- [ ] Active classes.
- [ ] Pending revisits.
- [ ] Recent lessons.
- [ ] Recent Echoes.
- **Done when:** every primary item navigates to relevant context.

## EC-181 — Implement teacher dashboard
- [ ] Owned classes.
- [ ] Student/lesson counts.
- [ ] Recent activity.
- [ ] Recent hotspots.
- **Done when:** metrics are learning signals, not generic vanity metrics.

## EC-182 — Implement My Echoes
- [ ] List current user's Echoes.
- [ ] Include lesson/class context.
- [ ] Navigate to exact timestamp.
- **Done when:** student can recover past learning moments.

---

# Phase 19 — Analytics and Teacher Responses Frontend

## EC-190 — Implement lesson analytics page
- [ ] Summary totals.
- [ ] Echo-type breakdown.
- [ ] Participant count.
- [ ] Activity visualization.
- [ ] Hotspot list.
- **Done when:** teacher can inspect learning activity.

## EC-191 — Implement hotspot detail interaction
- [ ] Select hotspot.
- [ ] Show time range.
- [ ] Show breakdown.
- [ ] Jump to lesson context if supported.
- **Done when:** teacher can investigate before responding.

## EC-192 — Implement teacher response editor
- [ ] Create response.
- [ ] Edit response.
- [ ] Delete response.
- [ ] Associate with selected timestamp/range.
- **Done when:** response appears in student lesson context.

---

# Phase 20 — Revisits Frontend

## EC-200 — Implement revisit list
- [ ] Pending section.
- [ ] Completed section if desired.
- [ ] Due date/status.
- **Done when:** only current student's revisits appear.

## EC-201 — Implement revisit detail/navigation
- [ ] Open lesson at exact timestamp.
- [ ] Preserve revisit context.
- **Done when:** revisit action lands at intended moment.

## EC-202 — Implement completion flow
- [ ] Mark completed.
- [ ] Mark understood.
- [ ] Success feedback.
- [ ] Refresh/update dashboard counts.
- **Done when:** state persists after reload.

---

# Phase 21 — Profile and Global UX

## EC-210 — Implement profile page
- [ ] Show application user information.
- [ ] Show role.
- [ ] Add editable fields only where backend supports them.
- **Done when:** page does not invent unsupported account features.

## EC-211 — Implement route protection UX
- [ ] Redirect unauthenticated users appropriately.
- [ ] Show unauthorized page where applicable.
- [ ] Do not treat frontend checks as authorization.
- **Done when:** UX is clear while backend remains authoritative.

## EC-212 — Implement loading UX
- [ ] Route loading states.
- [ ] Data skeletons where useful.
- [ ] Mutation pending states.
- **Done when:** major waits have clear feedback.

## EC-213 — Implement empty states
- [ ] No classes.
- [ ] No lessons.
- [ ] No Echoes.
- [ ] No revisits.
- [ ] No hotspots.
- **Done when:** every empty state has useful guidance.

## EC-214 — Implement error UX
- [ ] Retry where appropriate.
- [ ] User-friendly messages.
- [ ] No raw infrastructure errors.
- **Done when:** representative 400/401/403/404/409/500 cases are tested.

---

# Phase 22 — Accessibility and Responsive QA

## EC-220 — Keyboard audit
- [ ] Tab order.
- [ ] Dialog focus.
- [ ] Timeline marker interaction.
- [ ] Video/reaction controls.
- **Done when:** primary flow works without mouse.

## EC-221 — Screen-reader audit
- [ ] Form labels.
- [ ] Icon/button labels.
- [ ] Status announcements.
- [ ] Timeline semantics.
- **Done when:** Echo type meaning is not color-only.

## EC-222 — Reduced-motion support
- [ ] Respect system preference.
- [ ] Disable nonessential motion.
- **Done when:** lesson experience remains clear with reduced motion.

## EC-223 — Responsive audit
- [ ] Desktop.
- [ ] Laptop.
- [ ] Tablet.
- [ ] Mobile web.
- **Done when:** player and timeline remain usable at all target sizes.

---

# Phase 23 — Testing and Security Verification

## EC-230 — Unit-test hotspot algorithm
- [ ] Empty.
- [ ] Single window.
- [ ] Threshold boundary.
- [ ] Adjacent merge.
- [ ] Type breakdown.
- **Done when:** deterministic fixtures pass.

## EC-231 — Unit-test authorization helpers
- [ ] Teacher ownership.
- [ ] Student membership.
- [ ] Removed membership.
- [ ] Lesson publication.
- [ ] Echo ownership.
- **Done when:** all denial paths are covered.

## EC-232 — API integration tests
- [ ] Authenticated teacher class workflow.
- [ ] Student join workflow.
- [ ] Lesson visibility.
- [ ] Echo lifecycle.
- [ ] Revisit lifecycle.
- **Done when:** representative domain APIs pass against test infrastructure.

## EC-233 — E2E teacher journey
- [ ] Sign up/verify/sign in.
- [ ] Create class.
- [ ] Generate invite.
- [ ] Create lesson.
- [ ] Upload.
- [ ] Publish.
- [ ] Inspect analytics.
- [ ] Add response.
- **Done when:** complete journey passes.

## EC-234 — E2E student journey
- [ ] Sign up/verify/sign in.
- [ ] Join class.
- [ ] Open published lesson.
- [ ] Create Echo.
- [ ] View timeline.
- [ ] Open Echo history.
- [ ] Revisit timestamp.
- [ ] Mark understood.
- **Done when:** complete journey passes.

## EC-235 — Security regression suite
- [ ] Student guesses another class ID.
- [ ] Teacher guesses another teacher's class ID.
- [ ] Student accesses unpublished lesson.
- [ ] Student edits another student's Echo.
- [ ] Client supplies forged ownership ID.
- [ ] Anonymous media access attempt.
- **Done when:** every attack attempt is rejected.

---

# Phase 24 — CI/CD and Production Readiness

## EC-240 — Configure CI
- [ ] Install dependencies.
- [ ] Lint.
- [ ] Typecheck.
- [ ] Unit tests.
- [ ] Build.
- **Done when:** pull-request checks are reproducible.

## EC-241 — Configure deployment workflow
- [ ] Define development deployment.
- [ ] Define production deployment.
- [ ] Protect production credentials.
- [ ] Document rollback strategy.
- **Done when:** deployment does not require undocumented manual steps.

## EC-242 — Production configuration audit
- [ ] Verify CORS.
- [ ] Verify IAM least privilege.
- [ ] Verify S3 privacy.
- [ ] Verify CloudFront access.
- [ ] Verify secrets/configuration.
- [ ] Verify logging.
- **Done when:** checklist is signed off.

## EC-243 — Final V1 acceptance
- [ ] Run complete teacher journey.
- [ ] Run complete student journey.
- [ ] Verify core Wow Moment.
- [ ] Verify security regression suite.
- [ ] Verify production deployment.
- **Done when:** EchoClass V1 satisfies the documented end-to-end learning loop.

---

# Recommended Execution Order

```text
Foundation
→ Contracts
→ Infrastructure
→ Auth
→ Classes + Membership
→ Lessons
→ Media
→ Echoes
→ Timeline + Hotspots
→ Frontend Shell + Auth
→ Class/Lesson UI
→ Student Lesson Experience
→ Dashboards
→ Analytics + Teacher Responses
→ Revisits
→ Accessibility/Responsive QA
→ Tests/Security
→ CI/CD
→ Production Acceptance
```

# LLM Task Prompt Template

Use the following template when assigning any single task:

```text
You are implementing EchoClass V1.

Task ID: EC-XXX
Task: <copy one task section exactly>

Before coding:
1. Inspect the existing repository.
2. Identify files that already implement adjacent functionality.
3. Do not rewrite unrelated code.
4. Preserve the established architecture and conventions.
5. Implement only this task and its directly required dependencies.

Requirements:
- TypeScript strict mode.
- Validate external inputs.
- Preserve server-side authorization boundaries.
- Add or update tests relevant to this task.
- Do not introduce V2 features.
- Do not use placeholder implementations unless explicitly unavoidable.

After implementation:
1. List files changed.
2. Explain the implementation briefly.
3. Run relevant lint/typecheck/test/build commands.
4. Fix all errors caused by your changes.
5. Report the exact verification results.
6. Do not mark the task complete if verification fails.
```
