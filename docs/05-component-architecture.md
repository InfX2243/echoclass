# EchoClass — Component Architecture

## 1. Architecture Principles

Organize the frontend by **feature/domain**, not by one giant global components folder.

Recommended layers:

```text
src/
├── app/
├── components/
│   ├── ui/
│   └── shared/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── classes/
│   ├── lessons/
│   ├── echoes/
│   ├── analytics/
│   ├── revisits/
│   └── profile/
├── lib/
├── hooks/
├── types/
└── providers/
```

`components/ui` contains reusable shadcn-based primitives. `components/shared` contains cross-feature application components. Domain logic belongs in `features`.

## 2. Shared Components

### Application shell

- `AppShell`
- `AppHeader`
- `AppSidebar`
- `MobileNavigation`
- `RoleAwareNavigation`
- `PageHeader`
- `Breadcrumbs`

### Feedback

- `LoadingState`
- `EmptyState`
- `ErrorState`
- `UnauthorizedState`
- `ConfirmDialog`
- `ToastProvider`

### Data display

- `StatCard`
- `StatusBadge`
- `Timestamp`
- `Avatar`
- `MetadataList`

## 3. Feature Modules

### Auth

```text
features/auth/
├── api/
├── components/
│   ├── SignInForm
│   ├── SignUpForm
│   ├── VerifyEmailForm
│   └── AuthLayout
├── hooks/
├── schemas/
└── types/
```

### Classes

```text
features/classes/
├── api/
├── components/
│   ├── ClassCard
│   ├── ClassList
│   ├── ClassForm
│   ├── InviteCodeCard
│   ├── JoinClassForm
│   └── StudentMemberList
├── hooks/
├── schemas/
└── types/
```

### Lessons

```text
features/lessons/
├── api/
├── components/
│   ├── LessonCard
│   ├── LessonForm
│   ├── LessonUpload
│   ├── LessonStatusControl
│   ├── VideoPlayer
│   └── LessonViewer
├── hooks/
└── types/
```

### Echoes and Timeline

```text
features/echoes/
├── api/
├── components/
│   ├── EchoReactionBar
│   ├── EchoComposer
│   ├── EchoMarker
│   ├── EchoTimeline
│   ├── TimelineActivityLayer
│   ├── HotspotRange
│   ├── MomentDetailsPanel
│   ├── EchoEditDialog
│   └── EchoHistoryList
├── hooks/
└── types/
```

### Analytics

```text
features/analytics/
├── api/
├── components/
│   ├── AnalyticsSummary
│   ├── ActivityBreakdown
│   ├── HotspotList
│   ├── HotspotDetail
│   └── TeacherResponseEditor
└── types/
```

### Revisits

```text
features/revisits/
├── api/
├── components/
│   ├── RevisitCard
│   ├── RevisitList
│   └── RevisitCompletionDialog
└── types/
```

## 4. Critical Component Contracts

### `VideoPlayer`

Owns browser media integration and exposes controlled callbacks:

```ts
type VideoPlayerProps = {
  src: string;
  initialTime?: number;
  onTimeUpdate?: (seconds: number) => void;
  onSeek?: (seconds: number) => void;
  onReady?: (durationSeconds: number) => void;
};
```

### `EchoReactionBar`

Receives the current timestamp and emits the selected type. It does not own persistence.

```ts
type EchoReactionBarProps = {
  timestampSeconds: number;
  disabled?: boolean;
  onSelect: (type: EchoType) => void;
};
```

### `EchoTimeline`

Receives normalized timeline data and emits selection events.

```ts
type EchoTimelineProps = {
  durationSeconds: number;
  personalEchoes: Echo[];
  activity: TimelineActivityBucket[];
  hotspots: Hotspot[];
  teacherResponses: TeacherResponse[];
  selectedTimestamp?: number;
  onSelectTimestamp: (seconds: number) => void;
};
```

### `MomentDetailsPanel`

Pure contextual display for selected Echo/hotspot/response state.

## 5. State Boundaries

### Server state — TanStack Query

Use for:

- classes
- lessons
- memberships
- Echoes
- timeline
- analytics
- revisits
- current application user

### Form state — React Hook Form + Zod

Use for:

- sign-in/sign-up
- class form
- lesson metadata
- Echo notes
- teacher response

### Local UI state

Use React state for:

- selected timestamp
- open dialogs
- temporary player state
- active tab
- expanded hotspot

Do not introduce Redux for V1 without a demonstrated need.

## 6. Backend Domain Modules

Recommended Lambda/domain structure:

```text
backend/src/
├── handlers/
├── domains/
│   ├── users/
│   ├── classes/
│   ├── lessons/
│   ├── echoes/
│   ├── analytics/
│   └── revisits/
├── auth/
├── validation/
├── db/
├── media/
├── errors/
└── shared/
```

Each domain should separate:

- HTTP handler
- input validation
- authorization
- service/business logic
- repository/data access
- response mapping

## 7. Dependency Rules

- Pages compose feature components.
- Feature components do not directly know infrastructure details.
- API clients are the boundary between UI and backend.
- Authorization is never delegated to frontend visibility checks.
- Timeline visualization remains a custom component because it is core product IP/UX.
- Shared UI primitives must remain domain-agnostic.

## 8. Testing Boundaries

- Unit: utilities, hotspot algorithm, validation, authorization helpers.
- Component: forms, timeline interaction, reaction controls.
- Integration: API/domain workflows.
- E2E: teacher and student complete journeys.

## 9. Acceptance Criteria

A developer should be able to add or modify a feature without:

- placing domain logic inside generic UI components,
- duplicating API calls across pages,
- coupling timeline logic to unrelated screens,
- trusting client-controlled ownership fields,
- bypassing feature-level tests.
