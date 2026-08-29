# EchoClass — Echoes and Playback Focus Fix

## Scope

This document records the investigation and fix applied on `feat/echo-mvp` for:

1. `Unable to save this Echo. Please try again.`
2. `Unable to load Echoes.`
3. Lesson video restarting from the beginning after switching browser tabs.

## Findings

### 1. Echo creation used the wrong API route

The frontend sent Echo creation requests to:

```text
POST /api/echoes
```

The deployed API route exists, but the Echo Lambda handler only supports creation when the lesson is part of the route:

```text
POST /api/lessons/{lessonId}/echoes
```

The Lambda needs the lesson ID from the path in order to authorize student access and validate the timestamp against the lesson duration. As a result, the frontend request reached a route that could not be processed as a valid Echo creation request.

### 2. Echo loading errors were caused by the same route/contract area being inconsistent

The lesson-specific Echo read route is:

```text
GET /api/lessons/{lessonId}/echoes
```

The client already targeted that route, while creation targeted a different contract. The implementation is now normalized so all lesson-bound Echo mutations and reads consistently use the lesson-scoped API contract.

### 3. Video reset was caused by focus-driven data refetching

The authorized lesson query contains the playback authorization, including the video URL. TanStack Query refetches stale queries when the browser window regains focus by default.

When the lesson query refetched after returning to the tab, a new playback URL could be produced. React then received a changed `src` for the HTML5 video element, causing the media element to reload and restart from the beginning.

## Fix Applied

### Frontend Echo API

Echo creation now sends:

```text
POST /api/lessons/{lessonId}/echoes
```

The request body contains only the Echo payload:

```json
{
  "timestampSeconds": 123.45,
  "type": "QUESTION",
  "note": "Optional note"
}
```

### Query focus behavior

The following queries now explicitly disable refetching on browser window focus:

- authorized lesson query
- current student's Echo list
- lesson-specific Echo list

This preserves the current HTML5 video element and its playback position while the user switches away from and back to the browser tab.

## Expected Behavior After the Fix

```mermaid
sequenceDiagram
  participant S as Student
  participant UI as React UI
  participant API as HTTP API
  participant E as Echo Lambda
  participant DB as DynamoDB

  S->>UI: Save Echo at current timestamp
  UI->>API: POST /lessons/{lessonId}/echoes
  API->>E: Invoke Echo handler
  E->>E: Verify token and lesson access
  E->>DB: Persist Echo
  DB-->>E: Echo
  E-->>UI: 201 { echo }
  UI->>UI: Invalidate Echo queries
  UI-->>S: Echo appears in list
```

For playback:

```mermaid
sequenceDiagram
  participant B as Browser
  participant Q as Lesson Query
  participant V as Video Element

  B->>Q: Initial lesson load
  Q-->>V: Stable playback URL
  V->>V: Play lesson
  B->>B: Switch to another tab
  B->>B: Return to lesson tab
  Note over Q: No focus refetch
  Note over V: src is unchanged
  V->>V: Continue from current position
```

## Verification Checklist

- [ ] Load a published lesson as a student.
- [ ] Save each Echo type.
- [ ] Confirm the new Echo appears without a page reload.
- [ ] Reload the lesson and confirm saved Echoes load.
- [ ] Start video playback, switch to another browser tab, then return.
- [ ] Confirm playback position is preserved and the video does not restart at zero.
- [ ] Confirm existing lesson/class functionality remains unchanged.

## Follow-up

The current playback implementation uses short-lived S3 presigned URLs. The infrastructure already contains a private CloudFront distribution, and a future media-delivery slice should complete the migration to CloudFront-based playback. That work is separate from this focus-reset fix.
