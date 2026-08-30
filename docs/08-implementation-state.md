# EchoClass — Implementation State

> **Authoritative snapshot:** August 30, 2026 — `feat/cloudfront-web-deployment`.

## Status Legend
- [x] DONE
- [~] IN PROGRESS
- [ ] NOT STARTED
- [!] BLOCKED

## Current milestone

**Frontend CloudFront deployment and private CloudFront media playback are implemented.** The remaining work is the final production deployment/acceptance verification and any later hardening such as a custom domain, CI/CD, WAF, and key-rotation automation.

## Completed product and backend

### Authentication and identity
- [x] Cognito authentication boundary.
- [x] Access-token verification in Lambda.
- [x] Application-user bootstrap.
- [x] Teacher/student role-aware authorization.

### Classes and memberships
- [x] Class creation and management.
- [x] Stable invite-code generation.
- [x] Student join flow.
- [x] Membership listing and management.

### Lessons and media
- [x] Lesson creation, editing, and lifecycle.
- [x] Private S3 media storage.
- [x] Direct multipart browser-to-S3 upload.
- [x] Student-authorized playback.
- [x] Playback position preserved when switching browser tabs.
- [x] Private media CloudFront distribution via OAC.
- [x] Short-lived CloudFront signed playback URLs.
- [x] CloudFront signature encoding corrected to the required URL-safe Base64 mapping.
- [x] Progressive browser playback using HTTP byte-range requests; full-video download is not required before playback.

### Echo MVP
- [x] Create Echo.
- [x] List Echoes.
- [x] Update Echo.
- [x] Delete Echo.
- [x] Lesson-scoped Echo API routing.
- [x] DynamoDB persistence.
- [x] CloudWatch diagnostic logging for Echo failures.
- [x] Echo creation timestamp validation corrected.
- [x] Echo creation `createdAt`/`updatedAt` initialization corrected.
- [x] End-to-end Echo persistence verified.

## AWS foundation

- [x] DynamoDB application table.
- [x] Private S3 media bucket.
- [x] API Gateway HTTP API.
- [x] Application Lambda.
- [x] Dedicated Echo Lambda.
- [x] Cognito User Pool integration.
- [x] CloudFront distribution for private media delivery via OAC.
- [x] CloudFront signed URL viewer authorization for private media.
- [x] Dedicated private S3 bucket for the React production bundle.
- [x] Dedicated CloudFront distribution for the React web application.
- [x] Web bucket protected by CloudFront OAC.
- [x] HTTPS redirect and SPA 403/404 fallback to `index.html`.
- [x] CDK deployment of `apps/web/dist` with CloudFront invalidation.
- [x] API CORS accepts a configurable deployed web origin while retaining localhost support.

## Phase 17 — Frontend CloudFront Hosting

### Infrastructure implementation
- [x] Provision a private S3 origin for static web assets.
- [x] Provision CloudFront distribution for the React application.
- [x] Configure SPA routing fallback to `index.html`.
- [x] Configure production environment variable template/API base URL.
- [x] Configure CloudFront cache behavior and HTTPS.
- [x] Add CDK asset deployment from `apps/web/dist`.
- [x] Add stack outputs for web bucket, distribution, and public domain.

### Deployment verification
- [ ] Build production Vite bundle with real API/Cognito configuration.
- [ ] Deploy the CDK stack to AWS.
- [ ] Set API CORS to the resulting CloudFront origin.
- [ ] Verify Cognito authentication from the deployed origin.
- [ ] Verify API Gateway, video playback, and Echo CRUD from the deployed URL.
- [ ] Verify direct S3 access remains denied.
- [ ] Produce the final submission URL.

## Definition of done for the current milestone

The application is considered publicly deployed when a user can open one HTTPS CloudFront URL and successfully:

1. sign in;
2. create or access a class;
3. access a lesson;
4. play authorized media through the existing media CloudFront distribution;
5. create and persist an Echo;
6. reload and retrieve that Echo.

## Documentation status

- [x] Current Echo MVP investigation and fixes documented.
- [x] Implementation state reconciled with the working branch.
- [x] Remaining roadmap updated to prioritize public deployment.
- [x] CloudFront web deployment architecture and runbook added in `docs/15-cloudfront-web-deployment.md`.
- [x] Private media delivery documented in `docs/16-private-media-delivery.md`.
- [x] CloudFront media playback implementation and troubleshooting documented in `docs/22-cloudfront-media-playback-implementation.md`.
- [x] Progressive video buffering/range-request behavior documented.
- [x] Production environment template added at `apps/web/.env.production.example`.
