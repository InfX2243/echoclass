# EchoClass — MVP Domain Contracts

This document freezes the minimum typed domain/API shapes required by MVP-002. These contracts are intentionally small and are not a commitment to the eventual production schema.

## Entities

- **User** — EchoClass application identity resolved from Cognito `sub`; role is `STUDENT` or `TEACHER`.
- **Class** — teacher-owned class container.
- **Membership** — user/class relationship with an active/removed status.
- **Lesson** — class content with draft/published/archived lifecycle and optional media metadata.
- **Echo** — student-owned timestamped observation attached to a lesson.
- **Revisit** — deterministic follow-up generated from an eligible Echo.
- **UploadAuthorization** — short-lived authorization for direct browser-to-S3 upload.
- **PlaybackAuthorization** — short-lived authorization for private CloudFront playback.

## API contract conventions

- JSON request/response bodies use camelCase.
- Backend authorization derives user identity and role from the verified Cognito token and application-user record.
- Client-supplied owner IDs and roles are not authorization inputs.
- Timestamps are ISO 8601 strings in UTC.
- Authorization artifacts are short-lived and must never contain AWS IAM credentials.
- API failures use a stable `{ code, message, details? }` shape.

## Initial endpoint response shapes

- `GET /api/v1/me` → `{ user }`
- Class endpoints → `{ class }` or `{ classes }`
- Lesson endpoints → `{ lesson }` or `{ lessons }`
- Echo endpoints → `{ echo }` or `{ echoes }`
- Upload authorization → `{ authorization }` with an `UploadAuthorization`
- Playback authorization → `{ authorization }` with a `PlaybackAuthorization`

The source TypeScript contracts live in `types/domain.ts` and `types/api.ts`. Backend and frontend implementations should consume these shapes rather than independently redefining MVP entities.
