# EchoClass — Requirements Specification

> **Every lesson leaves a trace.**

**Version:** 1.0  
**Status:** V1 Production Requirements  
**Product:** EchoClass  
**Document Type:** Product & System Requirements

---

## 1. Product Overview

EchoClass is a collaborative classroom replay platform that transforms recorded lessons into interactive, timestamped learning timelines.

Students can react to specific moments in a lesson using **Echoes**. These Echoes capture moments of confusion, importance, or insight and become part of a collective learning timeline.

Teachers can use the resulting activity patterns to identify high-activity learning hotspots, understand where students struggled or engaged deeply, and provide contextual responses.

Students can later return to exact moments through their personal Echo history and simple spaced-revisit reminders.

### Core Learning Loop

```text
Watch
  ↓
React
  ↓
Leave an Echo
  ↓
Collective Timeline
  ↓
Identify Hotspots
  ↓
Teacher Response
  ↓
Revisit
  ↓
Understand
```

### Product Principle

> EchoClass should turn a recorded lesson from something students watch once into a persistent learning trace they can return to.

---

# 2. Product Vision

EchoClass should feel like a **digital version of a well-loved academic notebook**:

- calm
- focused
- warm
- reflective
- useful
- quietly empowering

The product should emphasize the feeling of:

> **"I finally understand this."**

The **Echo Timeline** is the visual and functional centerpiece of the application.

---

# 3. V1 Product Goals

The V1 release must allow:

1. Users to securely authenticate.
2. Users to have either a `TEACHER` or `STUDENT` role.
3. Teachers to create and manage private classes.
4. Teachers to generate class invite codes.
5. Students to join classes using invite codes.
6. Students to access only classes they belong to.
7. Teachers to access only classes they own.
8. Teachers to create recorded video lessons.
9. Teachers to upload lesson videos securely.
10. Teachers to publish and unpublish lessons.
11. Students to watch published lessons securely.
12. Students to create timestamped Echoes while watching.
13. Echoes to contain a reaction type and optional note.
14. Students to view their personal Echo history.
15. Students to view collective lesson activity.
16. The system to calculate deterministic learning hotspots.
17. Teachers to inspect lesson hotspots and aggregate feedback.
18. Teachers to attach contextual responses to lesson moments.
19. Students to revisit exact lesson timestamps.
20. The system to create simple spaced-revisit records.
21. Students to mark revisit items as completed or understood.
22. The complete system to be deployable to AWS.
23. Authorization to be enforced server-side.
24. Lesson media to remain private and securely delivered.

---

# 4. V1 Non-Goals

The following are explicitly outside the scope of V1:

- Live video conferencing
- Live classroom communication
- Student-to-student chat
- Full LMS functionality
- Assignments
- Exams
- Quizzes
- Attendance
- Complex grading
- Native mobile applications
- AI tutor/chatbot
- Automatic lecture transcription
- Automatic AI summaries
- Automatic AI-generated hotspots
- Facial recognition
- Emotion recognition
- Advanced recommendation systems
- Machine-learning-based spaced repetition
- Public classrooms
- Marketplace functionality
- Complex school administration
- Advanced notification infrastructure
- Real-time collaborative editing

These may be considered after V1 proves the core learning loop.

---

# 5. Target Users

EchoClass has two application roles.

## 5.1 Teacher

Teachers can:

- create classes
- manage their classes
- generate invite codes
- add/remove students
- create lessons
- upload lesson media
- edit lessons
- publish lessons
- archive lessons
- view lesson activity
- inspect hotspots
- view aggregate student feedback
- create teacher responses attached to lesson moments

## 5.2 Student

Students can:

- view their classes
- join classes with invite codes
- view published lessons
- watch lessons
- create Echoes
- add notes to Echoes
- edit their own Echoes
- delete their own Echoes
- view their Echo history
- view collective lesson activity
- explore hotspots
- jump to exact lesson moments
- receive/view revisit items
- mark revisit moments as understood

---

# 6. Product Terminology

## 6.1 Echo

An **Echo** is a student's reaction to a specific timestamp in a lesson.

An Echo consists of:

- timestamp
- reaction type
- optional note
- student ownership
- lesson association
- class association
- creation timestamp

## 6.2 Echo Types

V1 supports exactly three primary Echo types:

| Type        | Meaning                                     |
| ----------- | ------------------------------------------- |
| `CONFUSED`  | "I don't understand this."                  |
| `IMPORTANT` | "This is important. I want to remember it." |
| `INSIGHT`   | "This helped something click."              |

## 6.3 Echo Timeline

The Echo Timeline is the chronological visualization of lesson activity.

It should display:

- personal Echoes
- collective activity
- activity intensity
- hotspots
- teacher responses

## 6.4 Hotspot

A hotspot is a time region containing unusually high Echo activity.

A hotspot means:

> Significant student interaction occurred around this moment.

It does **not** automatically mean:

> Students were confused.

Hotspots must expose activity breakdown by Echo type.

## 6.5 Revisit

A revisit is a scheduled opportunity for a student to return to a previously marked lesson moment.

## 6.6 Teacher Response

A teacher response is contextual text attached to a lesson timestamp.

---

# 7. User Identity and Authentication Requirements

Authentication must use **Amazon Cognito**.

Cognito is responsible for determining:

> Who is this user?

The application database is responsible for determining:

> What role does this user have?

and:

> What resources can this user access?

## 7.1 Authentication Requirements

The system must support:

- registration
- email verification
- login
- logout
- authenticated sessions
- authentication failure handling

## 7.2 Application User

After successful authentication, the application must maintain a corresponding user record.

Conceptually:

```text
User
├── userId
├── cognitoSub
├── role
├── name
├── email
├── createdAt
└── updatedAt
```

The Cognito `sub` is the stable identity reference.

## 7.3 Roles

V1 supports:

```text
TEACHER
STUDENT
```

A user has one primary application role.

The role must be established securely by the backend.

The frontend must never be trusted to determine authorization.

---

# 8. Authorization Requirements

Authorization is a mandatory server-side responsibility.

Frontend route protection alone is insufficient.

Every protected backend operation must verify:

1. authentication
2. user identity
3. application role
4. resource ownership or membership
5. resource state where applicable

## 8.1 Teacher Authorization

A teacher may access a class only when:

```text
class.teacherId == authenticatedUserId
```

A teacher may access a lesson only when:

```text
lesson.classId
    ↓
class.teacherId == authenticatedUserId
```

## 8.2 Student Authorization

A student may access a class only when an active membership exists:

```text
ClassMembership
classId = requestedClassId
studentId = authenticatedUserId
status = ACTIVE
```

A student may access a lesson only when:

```text
lesson.status == PUBLISHED
AND
student has ACTIVE membership in lesson.classId
```

## 8.3 Echo Authorization

Students may:

- create their own Echoes
- read their own Echoes
- update their own Echoes
- delete their own Echoes

Students must not be able to modify another student's Echo.

Teachers may read appropriate aggregate Echo information for lessons belonging to their classes.

Teachers must not arbitrarily modify or delete student Echoes.

## 8.4 Client-Controlled Identity Fields

The backend must never trust client-provided:

```text
teacherId
studentId
ownerId
userId
role
```

Authenticated identity must be derived from Cognito.

---

# 9. Class Requirements

A class is a private learning group owned by a teacher.

## 9.1 Class Data

A class must contain:

```text
classId
teacherId
name
description
status
createdAt
updatedAt
```

## 9.2 Class Status

V1 supports:

```text
ACTIVE
ARCHIVED
```

Archived classes should not be presented as active classes.

## 9.3 Teacher Class Management

Teachers must be able to:

- create a class
- view their classes
- view a class
- edit class details
- archive a class
- view class students
- generate an invite code

Teachers must not see classes belonging to other teachers.

---

# 10. Class Membership Requirements

Students must be associated with classes through explicit membership records.

Conceptually:

```text
ClassMembership
├── classId
├── studentId
├── status
└── joinedAt
```

## 10.1 Membership Status

V1 supports:

```text
ACTIVE
REMOVED
```

Only `ACTIVE` memberships grant class access.

## 10.2 Student Enrollment

Students join classes through invite codes.

Flow:

```text
Teacher
  ↓
Generate invite code
  ↓
Share code
  ↓
Student enters code
  ↓
Backend validates code
  ↓
Membership created
```

## 10.3 Duplicate Enrollment

If a student attempts to join a class they already belong to:

```text
409 Conflict
```

The API should return a user-friendly message.

## 10.4 Removed Students

A student with:

```text
status = REMOVED
```

must not be able to access the class or its lessons.

---

# 11. Invite Code Requirements

Teachers must be able to generate a unique class invite code.

Example:

```text
ML-7K4P2
```

Invite codes must:

- be unique
- be difficult to guess
- map to exactly one class
- be validated server-side
- not expose internal class IDs
- not grant teacher permissions
- not be accepted after the class is archived

The system should prevent unauthorized users from enumerating valid invite codes.

---

# 12. Lesson Requirements

Lessons represent recorded instructional content.

## 12.1 Lesson Data

A lesson must contain:

```text
lessonId
classId
teacherId
title
description
contentType
mediaKey
durationSeconds
status
createdAt
updatedAt
publishedAt
```

## 12.2 Content Types

V1 should support:

```text
VIDEO
```

The data model should be designed so that future content types such as:

```text
AUDIO
```

can be added without redesigning the lesson domain.

## 12.3 Lesson Status

V1 supports:

```text
DRAFT
PUBLISHED
ARCHIVED
```

## 12.4 Student Visibility

Students may only see:

```text
status = PUBLISHED
```

lessons belonging to classes where they have an active membership.

## 12.5 Teacher Lesson Management

Teachers can:

- create lessons
- edit lesson metadata
- upload lesson media
- publish lessons
- unpublish lessons
- archive lessons

---

# 13. Lesson Media Requirements

Lesson media must be stored in **Amazon S3**.

The S3 bucket must not be publicly readable or writable.

Recommended structure:

```text
lessons/
  {lessonId}/
    video.mp4
```

The database must store the object key rather than video contents.

Example:

```text
mediaKey:
lessons/lesson_123/video.mp4
```

---

# 14. Media Upload Requirements

The upload flow must be secure and must verify teacher authorization.

Flow:

```text
Teacher
   ↓
Create lesson
   ↓
Request upload authorization
   ↓
Backend authenticates teacher
   ↓
Backend verifies class ownership
   ↓
Backend creates secure upload mechanism
   ↓
Browser uploads directly to S3
   ↓
Lesson media metadata is updated
   ↓
Teacher publishes lesson
```

The API must not accept arbitrary S3 keys supplied by an unauthorized client.

The generated object key should be derived from trusted server-side identifiers.

---

# 15. Media Delivery Requirements

Lesson media must be delivered through **Amazon CloudFront**.

Recommended architecture:

```text
Browser
   ↓
CloudFront
   ↓
Private S3
```

The S3 bucket must remain private.

CloudFront should use **Origin Access Control (OAC)**.

Lesson playback access must be authorized based on application permissions.

The implementation may use short-lived signed CloudFront URLs or signed cookies.

The final access mechanism must ensure that a student cannot obtain unrestricted access to another class's lesson media.

---

# 16. Video Player Requirements

The initial V1 player should use the browser's native HTML5 video capabilities.

The player must support:

- play
- pause
- seek
- current playback time
- duration
- volume
- fullscreen where supported

The player must expose the current timestamp to the Echo creation interface.

Example:

```text
31:14
```

must correspond to approximately:

```text
1874 seconds
```

---

# 17. Echo Creation Requirements

Students must be able to create an Echo while watching a lesson.

The primary interaction should be:

```text
😕 Confused
⭐ Important
💡 Insight
```

When the student selects an Echo type:

1. The current playback timestamp is captured.
2. The Echo type is selected.
3. The student may enter an optional note.
4. The student saves the Echo.
5. The backend validates authorization.
6. The Echo is persisted.

## 17.1 Timestamp

The timestamp must be stored in seconds.

Example:

```text
timestampSeconds: 1874
```

The timestamp must be within:

```text
0 <= timestampSeconds <= durationSeconds
```

## 17.2 Echo Note

The note is optional.

Notes should have a reasonable maximum length.

Recommended V1 limit:

```text
2000 characters
```

The backend must validate the limit.

---

# 18. Echo Ownership

Each Echo belongs to exactly one student.

Conceptually:

```text
Echo
├── echoId
├── lessonId
├── classId
├── studentId
├── timestampSeconds
├── type
├── note
└── createdAt
```

The backend must derive `studentId` from the authenticated user.

---

# 19. Echo Editing Requirements

Students may edit their own Echoes.

Students may modify:

- Echo type
- Echo note

Students must not modify:

- student ownership
- lesson ownership
- class ownership

The timestamp should generally remain immutable after creation in V1.

If timestamp editing is introduced later, it must be handled as an explicit product feature.

---

# 20. Echo Deletion Requirements

Students may delete their own Echoes.

Deleting an Echo must not allow deletion of another student's Echo.

The system should use an appropriate authorization check before deletion.

---

# 21. Student Privacy Requirements

EchoClass must avoid making students feel publicly judged.

## 21.1 Personal Notes

Student Echo notes are private by default.

A student's private note must not automatically be displayed to other students.

## 21.2 Aggregate Activity

The system may expose aggregate activity.

Example:

```text
12 students interacted here.
```

The UI may display:

```text
Confused: 8
Important: 3
Insight: 4
```

## 21.3 Student Identity

Student names should not be shown alongside collective Echo activity by default.

If anonymous peer notes are implemented, the author's identity must not be exposed.

---

# 22. Echo Timeline Requirements

The Echo Timeline is the primary V1 product interface.

It must represent lesson activity across time.

Example:

```text
00:00 ─────────────────────────────────────── 60:00
          ⭐             😕
                              🔥🔥🔥
                                    💡
```

The timeline should display:

- personal Echoes
- collective activity
- activity intensity
- hotspots
- teacher responses

---

# 23. Timeline Interaction Requirements

Selecting a timeline marker must:

1. seek the video/audio player to the associated timestamp
2. highlight the selected timeline item
3. display contextual information
4. preserve the user's current lesson context

Example:

```text
31:14

High Activity

12 students interacted here.

Confused: 8
Important: 3
Insight: 4
```

---

# 24. Collective Activity Requirements

The system must calculate lesson-level activity.

At minimum:

```text
Total Echoes
Confused count
Important count
Insight count
Activity by time range
Unique participating students
```

Collective activity must be calculated without exposing private student notes or identities.

---

# 25. Hotspot Requirements

Hotspots must be generated using deterministic logic.

V1 must not require machine learning or AI.

A basic algorithm should:

1. Divide lesson time into fixed buckets.
2. Count Echo activity per bucket.
3. Identify buckets above a configured threshold.
4. Merge adjacent high-activity buckets.
5. Return the resulting hotspot ranges.

Example:

```text
31:00–32:00 → 2 Echoes
32:00–33:00 → 11 Echoes
33:00–34:00 → 14 Echoes
34:00–35:00 → 4 Echoes
```

may produce:

```text
32:00–34:00
```

as a hotspot.

The exact threshold should be configurable and documented.

---

# 26. Hotspot Semantics

A hotspot must be described as:

> A region of significant student interaction.

The system must not label a hotspot as a "confusion point" unless the underlying activity specifically supports that interpretation.

Example:

```text
High Activity

Confused: 8
Important: 4
Insight: 3
```

This allows teachers to distinguish:

- confusion
- importance
- insight

---

# 27. Teacher Analytics Requirements

Teachers must be able to inspect lesson-level activity.

Example:

```text
How Neural Networks Learn

Students interacted: 29 / 37

Echoes:
😕 32
⭐ 21
💡 17

Top Hotspots:

31:14–34:02
42:07–43:15
```

Teachers should be able to:

- view total activity
- view activity by Echo type
- view participating student count
- view hotspots
- inspect hotspot details
- navigate to exact lesson timestamps
- add teacher responses

---

# 28. Teacher Response Requirements

Teachers must be able to attach text responses to specific lesson timestamps.

Example:

```text
31:14

Teacher Response

"The important idea here is that
backpropagation applies the chain rule
to determine how each weight contributed
to the final error."
```

A response should contain:

```text
responseId
lessonId
teacherId
timestampSeconds
content
createdAt
updatedAt
```

Only the teacher who owns the relevant class should be able to create or modify the response.

---

# 29. Student Echo History Requirements

Students must have a personal Echo history.

Example:

```text
My Echoes

😕 Backpropagation
31:14
3 days ago

⭐ Activation Functions
20:18
5 days ago

💡 Gradient Descent
42:07
7 days ago
```

Selecting an Echo must navigate to the associated lesson and seek to its timestamp.

---

# 30. Revisit Requirements

V1 should include a deliberately simple spaced-revisit system.

When a student creates a `CONFUSED` Echo, the system should create revisit opportunities.

Recommended initial schedule:

```text
Initial Echo
    ↓
+1 day
    ↓
+3 days
    ↓
+7 days
```

This schedule should be deterministic.

No machine learning is required.

---

# 31. Revisit Data

A revisit should contain:

```text
revisitId
studentId
echoId
lessonId
scheduledFor
status
createdAt
completedAt
```

## 31.1 Revisit Status

V1 supports:

```text
PENDING
COMPLETED
```

---

# 32. Revisit Experience

When a revisit becomes due:

```text
You marked this moment confusing 3 days ago.

[ Revisit ]
```

Selecting `Revisit` must:

1. open the relevant lesson
2. seek to the original timestamp
3. show the original Echo context

After revisiting:

```text
Do you understand this now?

[ Still confused ]
[ Got it ]
```

V1 may represent "Got it" as a completed revisit.

---

# 33. Echo Learning Journey

The application should support the conceptual learning journey:

```text
31:14
😕 Confused

      ↓

32:30
Teacher Response

      ↓

34:12
💡 Insight

      ↓

Day 3
Revisit

      ↓

Day 3
Got it
```

This should become an important future-facing product concept even if V1 keeps the implementation simple.

---

# 34. Student Navigation

The primary student navigation should contain:

```text
Dashboard
Classes
My Echoes
Revisit
Profile
```

## 34.1 Student Dashboard

The dashboard should display:

- enrolled classes
- recently viewed lessons
- pending revisits
- recent Echoes

The dashboard must not display unrelated classes.

---

# 35. Teacher Navigation

The primary teacher navigation should contain:

```text
Dashboard
My Classes
Create Lesson
Profile
```

The teacher dashboard should focus on:

- classes
- student counts
- lesson counts
- recent activity
- lesson hotspots where appropriate

---

# 36. Authentication Screens

V1 should include:

1. Sign Up
2. Email Verification
3. Sign In
4. Logout
5. Authentication error states

Registration must explicitly request:

```text
Name
Email
Password
Role
```

where role is:

```text
Teacher
Student
```

The backend must securely establish the application role.

---

# 37. Error Handling Requirements

The API must use predictable HTTP status codes.

At minimum:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Frontend error messages must be user-friendly.

The UI must not expose raw infrastructure or database errors.

For example, do not display:

```text
DynamoDB ConditionalCheckFailedException
```

Instead display:

```text
You don't have permission to access this class.
```

---

# 38. API Requirements

The backend should expose versioned HTTP APIs.

Recommended base path:

```text
/api/v1
```

Initial API areas:

```text
/api/v1/me

/api/v1/classes
/api/v1/classes/{classId}

/api/v1/classes/{classId}/members
/api/v1/classes/{classId}/invite

/api/v1/classes/{classId}/lessons
/api/v1/lessons/{lessonId}

/api/v1/lessons/{lessonId}/echoes
/api/v1/lessons/{lessonId}/timeline
/api/v1/lessons/{lessonId}/analytics

/api/v1/echoes/{echoId}

/api/v1/revisits
/api/v1/revisits/{revisitId}
```

Exact endpoint definitions are to be finalized during system architecture design.

---

# 39. Backend Architecture Requirements

The backend should use:

```text
Amazon API Gateway
        ↓
AWS Lambda
        ↓
Amazon DynamoDB
```

Lambda functions should be organized by logical domain rather than creating an unnecessary function for every endpoint.

Recommended logical areas:

```text
users
classes
lessons
echoes
analytics
revisits
```

The backend should remain modular and observable.

---

# 40. Database Requirements

The database must use **Amazon DynamoDB**.

The data model must be designed around actual application access patterns.

Core domain entities:

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

The exact DynamoDB partition keys, sort keys, and GSIs must be finalized before implementation.

The design must support:

- teacher class listing
- student class listing
- membership validation
- class lesson listing
- lesson lookup
- lesson Echo retrieval
- student Echo history
- lesson activity aggregation
- revisit retrieval
- ownership checks

---

# 41. DynamoDB Design Principle

The application must not blindly model DynamoDB as a relational database.

The final schema must begin with documented access patterns.

Example access patterns:

```text
Get teacher's classes
Get student's classes
Get class members
Get class lessons
Get lesson
Get lesson Echoes
Get student's Echoes
Get lesson activity
Get lesson hotspots
Get pending revisits
```

The final key strategy should be optimized for these operations.

---

# 42. Analytics Requirements

V1 must not introduce a separate analytics database.

Initial lesson analytics should be calculated from Echo data.

Required analytics:

```text
Total Echoes
Confused count
Important count
Insight count
Unique participating students
Activity by time range
Hotspots
```

If performance becomes a problem after real usage, precomputed aggregates may be introduced.

Correctness and simplicity have priority in V1.

---

# 43. Frontend Requirements

The frontend should use:

```text
Next.js
React
TypeScript
```

The application should use the Next.js App Router.

The frontend should not contain authoritative business authorization logic.

Frontend route protection may improve UX, but backend authorization remains mandatory.

---

# 44. UI Component Requirements

The UI should use:

```text
Tailwind CSS
shadcn/ui
```

The design should be consistent across:

- buttons
- dialogs
- forms
- cards
- navigation
- tabs
- dropdowns
- notifications
- error states

The Echo Timeline should be implemented as a custom product component rather than relying entirely on a generic timeline visualization library.

---

# 45. Client Data Requirements

Server state should use **TanStack Query**.

Forms should use:

```text
React Hook Form
+
Zod
```

The frontend should avoid introducing Redux unless a concrete V1 requirement appears.

---

# 46. Validation Requirements

All external API inputs must be validated server-side.

Recommended validation library:

```text
Zod
```

Validation should cover:

- request body
- URL parameters
- query parameters
- Echo types
- timestamps
- class names
- lesson metadata
- notes
- teacher responses
- invite codes

---

# 47. API Contract Requirements

The API should have an explicit OpenAPI contract.

The contract should define:

- endpoints
- request schemas
- response schemas
- authentication requirements
- authorization behavior
- error responses

The frontend and backend should implement against the same documented API contract.

---

# 48. Security Requirements

Production V1 must include:

- Amazon Cognito authentication
- server-side authorization
- private S3 bucket
- CloudFront Origin Access Control
- secure upload mechanism
- secure media delivery
- HTTPS
- least-privilege IAM
- input validation
- secure configuration
- restricted CORS
- CloudWatch logging
- no secrets in source code
- no sensitive configuration in frontend bundles
- no client-controlled ownership fields

---

# 49. CORS Requirements

API CORS must be restricted to known application origins.

The backend must not use unrestricted:

```text
Access-Control-Allow-Origin: *
```

for authenticated production API traffic unless explicitly justified.

Production and development origins should be separately configurable.

---

# 50. IAM Requirements

AWS IAM permissions must follow least privilege.

Examples:

```text
Lambda
  ↓
Only required DynamoDB actions

Upload flow
  ↓
Only required S3 object permissions

CloudFront
  ↓
Only required S3 origin access
```

No application component should receive broad:

```text
AdministratorAccess
```

permissions.

---

# 51. Configuration Requirements

Environment-specific configuration must not be hardcoded into source code.

Configuration should be supplied through appropriate deployment configuration mechanisms.

Examples:

```text
AWS region
Cognito user pool ID
Cognito client ID
API URL
CloudFront distribution
S3 bucket
DynamoDB table
environment name
```

Secrets must never be committed to Git.

---

# 52. Observability Requirements

Production V1 must use **Amazon CloudWatch**.

Logs should allow developers to answer:

> Why did this API request fail?

Important operational events should be logged.

Logs should include useful correlation/request information without exposing sensitive student data.

The system should log:

- API errors
- authorization failures
- upload failures
- lesson processing failures
- unexpected Lambda errors
- important application events

---

# 53. Privacy and Data Minimization

EchoClass should collect only information required for V1 functionality.

Student private notes must not appear in aggregate analytics.

Logs must avoid unnecessarily recording:

- passwords
- authentication tokens
- private Echo notes
- unnecessary personal information

The application should treat student learning activity as sensitive educational data.

---

# 54. Deployment Requirements

The complete application must be deployable to AWS.

Target architecture:

```text
                    AWS
                     │
       ┌─────────────┼─────────────┐
       │             │             │
       ▼             ▼             ▼
   Cognito         S3          DynamoDB
       │             │
       │        CloudFront
       │             │
       └──────┐      │
              ▼      ▼
           Frontend
              │
              ▼
         API Gateway
              │
              ▼
           Lambda
```

---

# 55. Infrastructure as Code

AWS infrastructure must be managed using:

```text
AWS CDK
+
TypeScript
```

Infrastructure should define, at minimum:

- Cognito
- API Gateway
- Lambda
- DynamoDB
- S3
- CloudFront
- IAM
- CloudWatch
- required deployment resources

Infrastructure should not depend on manually configured production resources wherever possible.

---

# 56. Environments

V1 should support at least:

```text
development
production
```

Resources should be isolated between environments.

Resource naming should make environment boundaries obvious.

Example:

```text
echoclass-api-dev
echoclass-api-prod

echoclass-data-dev
echoclass-data-prod

echoclass-media-dev
echoclass-media-prod
```

Exact naming conventions will be finalized during infrastructure design.

---

# 57. CI/CD Requirements

The project should use GitHub Actions.

Pull requests should run:

```text
Lint
Typecheck
Unit tests
Build
```

End-to-end tests should run against an appropriate test/development environment.

Production deployment should occur only from the designated production branch or release process.

---

# 58. Testing Requirements

V1 must include automated testing.

## 58.1 Unit Testing

Recommended:

```text
Vitest
```

Unit tests should cover:

- hotspot algorithm
- revisit scheduling
- validation
- authorization helpers
- domain logic
- DynamoDB key generation
- Echo calculations

## 58.2 Component Testing

Recommended:

```text
React Testing Library
```

Important components:

- Echo buttons
- Echo creation dialog
- Echo Timeline
- lesson player controls
- hotspot detail
- revisit UI
- class forms

## 58.3 End-to-End Testing

Recommended:

```text
Playwright
```

The most important E2E flow should validate:

```text
Teacher registration/login
      ↓
Create class
      ↓
Generate invite
      ↓
Create lesson
      ↓
Upload video
      ↓
Publish lesson
      ↓
Student registration/login
      ↓
Join class
      ↓
Open lesson
      ↓
Create Echo
      ↓
Teacher sees activity
      ↓
Hotspot is generated
      ↓
Student revisits timestamp
```

---

# 59. Performance Requirements

The application should feel responsive for normal classroom usage.

Target experience:

- dashboard navigation should feel immediate
- Echo creation should provide fast visual feedback
- timeline interactions should feel responsive
- seeking should occur without unnecessary API requests
- lesson playback should not depend on API availability after media access is authorized

Echo creation should not require uploading or processing large media files.

---

# 60. Echo Creation Performance

Echo creation should be lightweight.

The sequence should be:

```text
Capture timestamp locally
        ↓
Open Echo input
        ↓
Submit small API request
        ↓
Persist Echo
        ↓
Update timeline
```

The video itself must never be sent through the API for Echo creation.

---

# 61. Timeline Performance

The Echo Timeline should avoid excessive network requests.

A lesson view should load enough information to render:

```text
personal Echoes
collective activity
hotspots
teacher responses
```

The frontend may cache lesson analytics and timeline data where appropriate.

---

# 62. Accessibility Requirements

The application should follow modern web accessibility practices.

At minimum:

- keyboard-accessible controls
- visible focus states
- semantic HTML
- accessible form labels
- sufficient color contrast
- screen-reader-friendly buttons
- non-color-only indicators
- accessible video controls where possible

Echo types must not be represented solely through color.

For example:

```text
😕 Confused
⭐ Important
💡 Insight
```

should remain understandable without relying on color.

---

# 63. Responsive Design Requirements

V1 should be responsive for:

- desktop
- laptop
- tablet
- mobile web

A native mobile application is not required.

The lesson player and Echo Timeline must remain usable on smaller screens.

---

# 64. Visual Design System

EchoClass should use the provided visual identity.

## 64.1 Primary Colors

### Deep Ink Navy

```text
#1B2A4A
```

Use for:

- primary navigation
- headings
- primary text
- major structural elements
- important buttons where appropriate

### Warm Amber

```text
#F4A14B
```

Use for:

- important highlights
- active timeline states
- attention indicators
- `IMPORTANT` Echo representation

### Chalk White

```text
#E8F0F7
```

Use for:

- primary light backgrounds
- cards
- content surfaces
- calm learning-space areas

### Understanding Green

```text
#5CB88A
```

Use for:

- successful states
- "Got it"
- completed revisits
- positive learning progress
- `INSIGHT` representation where appropriate

---

# 65. Visual Style

The UI should combine:

```text
Clean academic
        +
Warm analog
        +
Digital notebook
```

The visual language should feel:

- calm
- warm
- focused
- trustworthy
- reflective
- educational
- uncluttered

Avoid:

- overly corporate SaaS styling
- excessive gradients
- excessive animations
- noisy dashboards
- overly bright colors
- gamification-heavy visuals
- unnecessary decorative elements

---

# 66. Echo Visual Language

The three Echo types should be visually distinguishable.

Recommended conceptual mapping:

```text
CONFUSED
😕
Warm/attention-oriented visual treatment

IMPORTANT
⭐
Warm Amber
#F4A14B

INSIGHT
💡
Understanding Green
#5CB88A
```

Deep Ink Navy should remain the primary structural color.

---

# 67. Animation Requirements

Animations should be subtle.

Good examples:

- Echo marker appearing on the timeline
- hotspot expansion
- timeline selection
- smooth video seeking
- revisit completion feedback

Avoid:

- excessive motion
- distracting particle effects
- gamification animations
- animations that interfere with lesson playback

The interface should feel calm rather than energetic.

---

# 68. Recommended V1 Screens

## Authentication

1. Sign Up
2. Sign In
3. Email Verification

## Shared

4. Profile
5. Error/Unauthorized states

## Student

6. Student Dashboard
7. Class Page
8. Lesson Player
9. Echo Creation
10. Echo Timeline
11. Hotspot Detail
12. My Echoes
13. Revisit

## Teacher

14. Teacher Dashboard
15. Class Management
16. Student Management
17. Create/Edit Lesson
18. Lesson Upload
19. Lesson Analytics
20. Hotspot Detail
21. Teacher Response

Screens may be combined where doing so improves usability.

---

# 69. Student Lesson Experience

The primary student lesson screen should combine:

```text
┌──────────────────────────────────────────┐
│ Lesson title                             │
├──────────────────────────────────────────┤
│                                          │
│              Video Player                │
│                                          │
├──────────────────────────────────────────┤
│ 😕      ⭐      💡                        │
│                                          │
│ Echo Timeline                            │
│ ────────●──────🔥🔥──────●────────────── │
│                                          │
│ Selected moment details                  │
└──────────────────────────────────────────┘
```

The student should not need to navigate away from the lesson to create an Echo.

---

# 70. Teacher Lesson Experience

The teacher analytics screen should prioritize:

```text
Lesson
  ↓
Activity
  ↓
Hotspots
  ↓
Investigation
  ↓
Response
```

Example:

```text
How Neural Networks Learn

Students: 37
Participated: 29

Echoes
──────────────
😕 32
⭐ 21
💡 17

Timeline
──────────────────────────────

🔥 Hotspot
31:14 – 34:02

Confused: 8
Important: 4
Insight: 3

[ Inspect ]
[ Add Teacher Response ]
```

---

# 71. Core "Wow" Moment

The V1 demo must strongly support this sequence:

```text
Student watches lesson
        ↓
Student marks 😕
        ↓
Several students mark same region
        ↓
Timeline develops hotspot
        ↓
Teacher sees hotspot
        ↓
Teacher investigates activity
        ↓
Teacher adds explanation
        ↓
Student revisits exact timestamp
        ↓
Student marks "Got it"
```

This sequence should be treated as the primary product demonstration.

---

# 72. Primary User Journey — Teacher

```text
Sign Up
   ↓
Verify Email
   ↓
Sign In
   ↓
Teacher Dashboard
   ↓
Create Class
   ↓
Generate Invite Code
   ↓
Students Join
   ↓
Create Lesson
   ↓
Upload Video
   ↓
Publish Lesson
   ↓
Students Watch
   ↓
Echoes Accumulate
   ↓
View Timeline
   ↓
Inspect Hotspots
   ↓
Add Teacher Response
```

---

# 73. Primary User Journey — Student

```text
Sign Up
   ↓
Verify Email
   ↓
Sign In
   ↓
Join Class
   ↓
Open Class
   ↓
Open Published Lesson
   ↓
Watch Video
   ↓
Create Echo
   ↓
Add Optional Note
   ↓
Continue Watching
   ↓
Review Timeline
   ↓
Receive Revisit
   ↓
Return to Timestamp
   ↓
Mark Understanding
```

---

# 74. Data Ownership Rules

The following ownership model must always hold:

```text
Teacher
  ↓
owns
  ↓
Class
  ↓
contains
  ↓
Lessons
```

and:

```text
Student
  ↓
belongs to
  ↓
Class
  ↓
creates
  ↓
Echo
```

Therefore:

```text
Teacher → Class → Lesson
Student → Membership → Class → Lesson
Student → Echo → Lesson
```

All backend authorization must follow these relationships.

---

# 75. Required Domain Entities

The V1 domain model must contain:

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

Potential future entities:

```text
Attachment
AudioLesson
Notification
Transcript
Summary
Assignment
```

must not complicate the V1 schema unnecessarily.

---

# 76. API Authorization Matrix

| Resource              | Teacher            | Student             |
| --------------------- | ------------------ | ------------------- |
| Own profile           | Read/Update        | Read/Update         |
| Own classes           | CRUD               | Read enrolled       |
| Other teacher classes | Deny               | Deny                |
| Class membership      | Manage own classes | Read own membership |
| Invite code           | Create/View own    | Redeem              |
| Own lessons           | CRUD               | Read published      |
| Other teacher lessons | Deny               | Deny                |
| Own Echoes            | N/A                | CRUD                |
| Other student Echoes  | Aggregate Read     | Private by default  |
| Teacher responses     | CRUD own class     | Read relevant       |
| Analytics             | Read own lessons   | Limited aggregate   |
| Revisit records       | N/A                | Read/Update own     |

---

# 77. V1 Feature Priorities

## P0 — Required

- Cognito authentication
- Email verification
- Teacher/student roles
- Class creation
- Class membership
- Invite codes
- Server-side authorization
- Lesson creation
- Secure video upload
- Video playback
- Lesson publishing
- Echo creation
- Timestamp capture
- Echo persistence
- Personal Echo history
- Collective timeline
- Basic hotspot calculation
- Teacher analytics
- AWS deployment
- Private media storage
- Secure media delivery

## P1 — Important

- Teacher responses
- Revisit scheduling
- Revisit completion
- Better timeline visualization
- Improved upload UX

## P2 — Future

- AI summaries
- AI misconception detection
- AI-generated revision
- Voice notes
- Uploaded diagrams
- PDF/slides
- Automatic transcription
- Notifications
- Live lessons
- Real-time Echoes
- Native mobile applications

---

# 78. Future Feature Compatibility

The V1 architecture should leave room for:

```text
V1
Recorded Lessons
+
Echo Timeline
+
Hotspots
+
Revisit
        ↓
V2
AI Summaries
+
Misconception Detection
+
Revision Generation
        ↓
V3
Live Lessons
+
Real-Time Echoes
        ↓
V4
Adaptive Learning
+
Personalized Learning Paths
```

However, future compatibility must not become a reason to over-engineer V1.

---

# 79. Technical Stack Requirements

The recommended production V1 stack is:

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
TanStack Query
React Hook Form
Zod
```

## Backend

```text
Amazon API Gateway HTTP API
AWS Lambda
TypeScript
Zod
```

## Authentication

```text
Amazon Cognito
```

## Database

```text
Amazon DynamoDB
```

## Media

```text
Amazon S3
Amazon CloudFront
CloudFront Origin Access Control
```

## Infrastructure

```text
AWS CDK
TypeScript
```

## Testing

```text
Vitest
React Testing Library
Playwright
```

## Tooling

```text
pnpm
ESLint
Prettier
GitHub Actions
```

## Observability

```text
Amazon CloudWatch
```

---

# 80. Explicit Technology Exclusions for V1

The following should not be introduced without a concrete requirement:

```text
Kubernetes
Redis
Kafka
GraphQL
Microservices
PostgreSQL
Dedicated analytics warehouse
AI/ML infrastructure
Complex message queues
Complex event buses
Native mobile applications
```

The architecture should prioritize:

```text
Simple
Reliable
Secure
Observable
Deployable
Maintainable
```

---

# 81. Production Definition of Done

EchoClass V1 is complete when all of the following are true.

## Authentication

- [ ] A new user can register.
- [ ] Email verification works.
- [ ] A user can log in.
- [ ] A user can log out.
- [ ] Application role is established securely.
- [ ] Protected routes require authentication.

## Teacher

- [ ] Teacher can create a class.
- [ ] Teacher can view only their own classes.
- [ ] Teacher can edit a class.
- [ ] Teacher can archive a class.
- [ ] Teacher can generate an invite code.
- [ ] Teacher can view students.
- [ ] Teacher can remove students.
- [ ] Teacher can create lessons.
- [ ] Teacher can upload video.
- [ ] Teacher can publish lessons.
- [ ] Teacher can archive lessons.
- [ ] Teacher can see lesson activity.
- [ ] Teacher can inspect hotspots.
- [ ] Teacher can create teacher responses.

## Student

- [ ] Student can join a class using an invite code.
- [ ] Student can view only enrolled classes.
- [ ] Student can view only published lessons.
- [ ] Student can securely watch lessons.
- [ ] Student can create timestamped Echoes.
- [ ] Student can add Echo notes.
- [ ] Student can edit their Echoes.
- [ ] Student can delete their Echoes.
- [ ] Student can view their Echo history.
- [ ] Student can navigate to Echo timestamps.
- [ ] Student can view collective activity.
- [ ] Student can view hotspots.
- [ ] Student can revisit moments.
- [ ] Student can mark a revisit as completed.

## Echo System

- [ ] Echoes persist correctly.
- [ ] Echoes contain exact timestamps.
- [ ] Echo types are supported.
- [ ] Personal Echoes are private.
- [ ] Collective activity is aggregated.
- [ ] Hotspots are calculated deterministically.
- [ ] Hotspots expose Echo-type breakdowns.
- [ ] Timeline markers seek the player correctly.

## Security

- [ ] Authentication is server-enforced.
- [ ] Authorization is server-enforced.
- [ ] Students cannot access unrelated classes.
- [ ] Teachers cannot access unrelated classes.
- [ ] Students cannot access unpublished lessons.
- [ ] Students cannot modify another student's Echo.
- [ ] Client-provided ownership IDs are ignored.
- [ ] S3 is private.
- [ ] CloudFront securely accesses S3.
- [ ] Media access is authorized.
- [ ] IAM follows least privilege.
- [ ] Secrets are not stored in source code.
- [ ] Production API uses HTTPS.
- [ ] CORS is appropriately restricted.

## Deployment

- [ ] Frontend is deployed.
- [ ] API Gateway is deployed.
- [ ] Lambda functions are deployed.
- [ ] Cognito is configured.
- [ ] DynamoDB is deployed.
- [ ] S3 media storage is deployed.
- [ ] CloudFront is configured.
- [ ] Infrastructure is defined using CDK.
- [ ] Production environment is isolated from development.
- [ ] CloudWatch logging works.

## Testing

- [ ] Core domain logic has unit tests.
- [ ] Authorization logic has tests.
- [ ] Hotspot calculation has tests.
- [ ] Revisit scheduling has tests.
- [ ] Critical UI components have tests.
- [ ] Critical end-to-end flows have Playwright coverage.

---

# 82. Product Success Criteria

V1 should be considered successful if a teacher can understand the value of EchoClass within a single lesson.

The critical experience is:

```text
"I can see where my students interacted with my lesson."
```

And the student's critical experience is:

```text
"I can return to the exact moment where I struggled."
```

The product's strongest differentiator is:

```text
A lesson is no longer just a video.

It becomes a learning trace.
```

---

# 83. Final Product Definition

EchoClass V1 is:

> **A secure classroom platform where teachers create private classes and publish recorded video lessons. Students join only the classes they are enrolled in and watch lessons through an interactive player. At any moment, students can leave a timestamped Echo — Confused, Important, or Insight — optionally with a note. These Echoes form a collective timeline that reveals high-activity learning hotspots. Teachers can inspect those hotspots and respond to difficult concepts. Students can later return to their own Echoes and receive simple spaced-revisit prompts, turning moments of confusion into a measurable learning journey.**

The core loop is:

```text
Watch
  ↓
Echo
  ↓
Timeline
  ↓
Hotspot
  ↓
Teacher Response
  ↓
Revisit
  ↓
Understand
```

And the core principle remains:

> **Every lesson leaves a trace.**
