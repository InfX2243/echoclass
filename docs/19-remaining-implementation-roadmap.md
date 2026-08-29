# EchoClass — Remaining Implementation Roadmap

> **Current snapshot:** August 29, 2026. The Echo MVP on `feat/echo-mvp` is complete.

## Current position

The core MVP now supports:

- Cognito authentication and server-side identity.
- Teacher/student authorization.
- Classes, memberships, and stable invite codes.
- Lesson lifecycle management.
- Private S3 video uploads.
- Authorized lesson playback.
- Timestamped Echo CRUD backed by DynamoDB.
- Playback continuity across browser tab changes.
- CloudFront private-media infrastructure.

The immediate priority is no longer another product feature.

# Priority 1 — Deploy the web application

The submission requires a publicly accessible application URL.

## Target architecture

```mermaid
flowchart LR
  U[User Browser] --> CF[CloudFront
Public HTTPS URL]
  CF --> S3WEB[(Private S3
React/Vite build)]
  U --> COG[Cognito]
  U --> API[API Gateway]
  API --> L[Lambda]
  L --> DB[(DynamoDB)]
  U -->|Authorized playback| MEDIA[Media CloudFront]
  MEDIA --> S3MEDIA[(Private Media S3)]
```

## Deployment flow

```mermaid
sequenceDiagram
  participant Dev as Developer/CI
  participant Build as Vite Build
  participant S3 as Web Assets S3
  participant CF as CloudFront
  participant User as Browser

  Dev->>Build: pnpm --filter web build
  Build-->>Dev: dist/
  Dev->>S3: Upload immutable assets
  Dev->>CF: Invalidate/index deployment
  User->>CF: HTTPS request
  CF->>S3: Fetch static assets
  CF-->>User: EchoClass SPA
```

## Required implementation work

1. Create a dedicated private S3 bucket for the frontend.
2. Create CloudFront OAC and distribution.
3. Configure default root object and SPA fallback/error behavior.
4. Configure cache policies:
   - immutable hashed assets cached aggressively;
   - `index.html` short/no-cache.
5. Provide production frontend environment configuration.
6. Ensure API Gateway CORS allows the deployed CloudFront origin.
7. Ensure Cognito app-client callback/sign-out URLs allow the deployed origin.
8. Deploy and smoke-test the complete MVP.
9. Record the final CloudFront URL in the README/deployment documentation.

## Acceptance checklist

- [ ] Public HTTPS URL loads the React app.
- [ ] Refreshing a nested route works.
- [ ] Cognito login works.
- [ ] API calls work from CloudFront origin.
- [ ] Video playback works.
- [ ] Echo CRUD works and persists.
- [ ] No browser secrets/AWS credentials are exposed.

# Priority 2 — Production hardening

After the submission deployment:

- automated frontend tests for critical lesson/Echo flows;
- backend tests for authorization and ownership;
- CI for lint, typecheck, tests, build, and CDK synth;
- CloudWatch alarms and operational dashboards;
- custom domain and ACM certificate if required;
- separate staging/production configuration.

# Future product roadmap

```mermaid
flowchart LR
  A[Deployed MVP] --> B[Timestamp Timeline]
  B --> C[Revisit Queue]
  C --> D[Learning Analytics]
  D --> E[Production Hardening]
```

Potential future work:

- richer timeline navigation and Echo markers;
- Revisit MVP based on saved Echoes;
- learning progress and analytics;
- notifications;
- broader test coverage.

## Recommended next branch

`feat/cloudfront-web-deployment`
