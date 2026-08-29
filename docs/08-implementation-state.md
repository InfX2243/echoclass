# EchoClass — Implementation State

> **Authoritative snapshot:** August 29, 2026 — `feat/echo-mvp`.

## Status Legend
- [x] DONE
- [~] IN PROGRESS
- [ ] NOT STARTED
- [!] BLOCKED

## Current milestone

**Echo MVP is complete and verified.**

The next implementation milestone is **production-style frontend deployment through CloudFront**, so the application has a stable public URL suitable for submission.

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

## Next milestone — Public web application deployment

### Phase 17 — Frontend CloudFront Hosting
- [ ] Build production Vite bundle.
- [ ] Provision a private S3 origin for static web assets.
- [ ] Provision CloudFront distribution for the React application.
- [ ] Configure SPA routing fallback to `index.html`.
- [ ] Configure production environment variables/API base URL.
- [ ] Configure CloudFront cache behavior and HTTPS.
- [ ] Deploy the web bundle.
- [ ] Verify Cognito authentication from the deployed origin.
- [ ] Verify API Gateway, video playback, and Echo CRUD from the deployed URL.
- [ ] Produce the final submission URL.

## Definition of done for the next milestone

The application is considered deployed when a user can open one HTTPS CloudFront URL and successfully:

1. sign in;
2. create or access a class;
3. access a lesson;
4. play authorized media;
5. create and persist an Echo;
6. reload and retrieve that Echo.

## Documentation status

- [x] Current Echo MVP investigation and fixes documented.
- [x] Implementation state reconciled with the working branch.
- [x] Remaining roadmap updated to prioritize public deployment.
- [x] Deployment architecture documented as the next implementation slice.
