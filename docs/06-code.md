# EchoClass — Code Architecture

## 1. Repository Structure

Use a pnpm workspace monorepo:

```text
echoclass/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── contracts/
│   ├── domain/
│   ├── config/
│   └── test-utils/
├── infrastructure/
│   └── cdk/
├── docs/
├── package.json
└── pnpm-workspace.yaml
```

## 2. Frontend

```text
apps/web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── providers/
│   └── types/
├── public/
└── tests/
```

Use:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod

## 3. API

```text
apps/api/
├── src/
│   ├── handlers/
│   ├── domains/
│   ├── auth/
│   ├── db/
│   ├── media/
│   ├── validation/
│   ├── errors/
│   └── shared/
├── tests/
└── package.json
```

Use:

- API Gateway HTTP API
- AWS Lambda
- TypeScript
- Zod
- AWS SDK v3

Organize Lambda entry points by logical domain, not one function per endpoint.

## 4. API Contract

Base path:

```text
/api/v1
```

Core areas:

```text
/me
/classes
/classes/{classId}
/classes/{classId}/members
/classes/{classId}/invite
/classes/{classId}/lessons
/lessons/{lessonId}
/lessons/{lessonId}/echoes
/lessons/{lessonId}/timeline
/lessons/{lessonId}/analytics
/echoes/{echoId}
/revisits
/revisits/{revisitId}
```

Maintain explicit OpenAPI schemas and shared TypeScript/Zod contracts where practical.

## 5. Domain Types

Core entities:

```text
User
Class
ClassMembership
InviteCode
Lesson
Echo
TeacherResponse
Revisit
```

Key enums:

```ts
type UserRole = 'TEACHER' | 'STUDENT';
type ClassStatus = 'ACTIVE' | 'ARCHIVED';
type MembershipStatus = 'ACTIVE' | 'REMOVED';
type LessonStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
type ContentType = 'VIDEO';
type EchoType = 'CONFUSED' | 'IMPORTANT' | 'INSIGHT';
type RevisitStatus = 'PENDING' | 'COMPLETED' | 'UNDERSTOOD';
```

## 6. DynamoDB Strategy

Finalize the table design from documented access patterns before coding repositories.

Required access patterns include:

- get application user by Cognito sub
- list teacher classes
- list student classes
- validate membership
- list class members
- resolve invite code
- list class lessons
- get lesson
- get lesson Echoes
- get student Echo history
- calculate lesson activity
- list revisits
- perform ownership checks

The implementation must not mimic a relational schema without considering DynamoDB query patterns.

## 7. Authorization Pattern

Every protected request follows:

```text
Request
  ↓
Authenticate Cognito token
  ↓
Resolve application user
  ↓
Validate role
  ↓
Validate resource ownership/membership
  ↓
Validate resource state
  ↓
Execute domain operation
```

Never trust client-provided:

- userId
- teacherId
- studentId
- ownerId
- role

## 8. Media Flow

```text
Teacher creates lesson
  ↓
Backend verifies class ownership
  ↓
Backend generates trusted object key + upload authorization
  ↓
Browser uploads directly to private S3
  ↓
Lesson metadata updated
  ↓
Teacher publishes
  ↓
Authorized viewer requests playback access
  ↓
Backend verifies access
  ↓
Short-lived CloudFront access is returned
```

Use:

- Private S3
- CloudFront
- Origin Access Control
- Signed URL/cookie strategy finalized during implementation

## 9. Hotspot Algorithm

V1 algorithm must be deterministic:

```text
Echoes
  ↓
Bucket by fixed time window
  ↓
Count Echoes and type breakdown
  ↓
Compare activity against threshold
  ↓
Mark high-activity windows
  ↓
Merge adjacent windows
  ↓
Return hotspot ranges
```

Keep the algorithm in a pure, unit-tested module.

## 10. Revisit Rules

Start with a simple deterministic scheduler.

Suggested implementation boundary:

- Echo event creates or updates revisit candidates where applicable.
- Revisit stores lesson + timestamp + due date + status.
- Student can open exact lesson moment.
- Student can mark completed/understood.

Keep scheduling policy configurable and tested.

## 11. Error Model

Return predictable HTTP status codes:

- 400 validation
- 401 authentication required/invalid
- 403 forbidden
- 404 unavailable/not found
- 409 conflict
- 500 unexpected error

Use a consistent API envelope, for example:

```ts
type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};
```

Never expose DynamoDB, Lambda, IAM, or raw stack traces to users.

## 12. Infrastructure

AWS CDK + TypeScript should provision:

- Cognito
- DynamoDB
- S3
- CloudFront + OAC
- API Gateway
- Lambda
- IAM roles/policies
- CloudWatch log groups
- environment configuration

At minimum, keep development and production configuration separable.

## 13. Testing

```text
Vitest
React Testing Library
Playwright
```

Required coverage:

- authorization helpers
- validation
- hotspot calculation
- invite code conflict behavior
- Echo ownership
- lesson visibility
- class isolation
- primary teacher journey
- primary student journey

## 14. CI

GitHub Actions pipeline:

```text
install
→ lint
→ typecheck
→ unit tests
→ build
→ integration/E2E where configured
```

Deployment should be a separate explicit workflow/environment step.

## 15. Code Standards

- TypeScript strict mode
- No `any` unless unavoidable and documented
- Zod validation at boundaries
- Small focused modules
- Domain errors mapped centrally
- Environment variables validated at startup
- No secrets committed
- Formatting and linting enforced
