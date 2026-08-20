# EchoClass — Page Architecture

> **Every lesson leaves a trace.**

**Version:** 1.0  
**Status:** V1 Production Page Architecture  
**Product:** EchoClass

---

## 1. Purpose

This document defines the page architecture, route structure, page responsibilities, navigation hierarchy, and primary user flows for EchoClass V1.

The architecture is derived from `requirements.md` and is intended to provide a clear implementation blueprint for the Next.js App Router frontend.

The page architecture must support the two primary application roles:

```text
TEACHER
STUDENT
```

while keeping authorization enforced by the backend.

---

# 2. Architecture Principles

The page architecture should follow these principles:

### 2.1 Role-aware

Teacher and student experiences should have distinct navigation and dashboards.

### 2.2 Lesson-centric

The student lesson page is the primary product experience.

The Echo Timeline should remain visually and functionally close to the video player.

### 2.3 Context-preserving

When a user navigates to a lesson moment, the application should preserve:

- lesson context
- timestamp
- selected Echo/hotspot
- timeline state
- player state where appropriate

### 2.4 Permission-aware

The frontend may hide inaccessible pages for UX purposes, but must never be responsible for authoritative authorization.

Backend APIs determine whether the requested resource is accessible.

### 2.5 Calm navigation

Navigation should remain intentionally small.

The application should avoid deeply nested navigation and unnecessary dashboards.

### 2.6 Progressive disclosure

The interface should reveal detailed information when needed rather than presenting all analytics simultaneously.

---

# 3. Application Route Tree

The proposed Next.js App Router structure is:

```text
/
├── (auth)/
│   ├── sign-in/
│   │   └── page.tsx
│   ├── sign-up/
│   │   └── page.tsx
│   └── verify-email/
│       └── page.tsx
│
├── (app)/
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── classes/
│   │   ├── page.tsx
│   │   ├── join/
│   │   │   └── page.tsx
│   │   └── [classId]/
│   │       ├── page.tsx
│   │       ├── students/
│   │       │   └── page.tsx
│   │       ├── lessons/
│   │       │   ├── page.tsx
│   │       │   ├── new/
│   │       │   │   └── page.tsx
│   │       │   └── [lessonId]/
│   │       │       ├── page.tsx
│   │       │       ├── edit/
│   │       │       │   └── page.tsx
│   │       │       ├── analytics/
│   │       │       │   └── page.tsx
│   │       │       └── upload/
│   │       │           └── page.tsx
│   │       │
│   │       └── settings/
│   │           └── page.tsx
│   │
│   ├── lessons/
│   │   └── [lessonId]/
│   │       └── page.tsx
│   │
│   ├── echoes/
│   │   ├── page.tsx
│   │   └── [echoId]/
│   │       └── page.tsx
│   │
│   ├── revisits/
│   │   ├── page.tsx
│   │   └── [revisitId]/
│   │       └── page.tsx
│   │
│   ├── profile/
│   │   └── page.tsx
│   │
│   └── unauthorized/
│       └── page.tsx
│
├── loading.tsx
├── error.tsx
├── not-found.tsx
└── page.tsx
```

The exact physical folder structure may be adjusted during implementation, but the user-facing route responsibilities should remain consistent.

---

# 4. Route Groups

Next.js route groups should be used to separate application concerns without affecting public URLs.

Recommended groups:

```text
(auth)
(app)
```

## 4.1 `(auth)`

Contains unauthenticated authentication experiences:

```text
/sign-in
/sign-up
/verify-email
```

## 4.2 `(app)`

Contains authenticated application experiences:

```text
/dashboard
/classes
/lessons
/echoes
/revisits
/profile
```

---

# 5. Public Routes

The public route surface should remain minimal.

```text
/
 /sign-in
 /sign-up
 /verify-email
```

The landing page is optional for the initial authenticated product and may redirect authenticated users to `/dashboard`.

---

# 6. Authentication Pages

## 6.1 Sign In

**Route**

```text
/sign-in
```

**Purpose**

Authenticate an existing EchoClass user through Amazon Cognito.

### UI

```text
EchoClass

Welcome back.

Email
[________________]

Password
[________________]

[ Sign In ]

Don't have an account?
Create one
```

### States

Must support:

- initial
- submitting
- invalid credentials
- unverified email
- temporarily unavailable
- successful authentication

### Navigation

Successful authentication:

```text
Sign In
   ↓
Load application user
   ↓
Determine role
   ↓
/dashboard
```

---

# 7. Sign Up

**Route**

```text
/sign-up
```

**Purpose**

Create a Cognito identity and corresponding application user.

### Fields

```text
Name
Email
Password
Role
```

Role options:

```text
Teacher
Student
```

### Flow

```text
Sign Up
   ↓
Cognito registration
   ↓
Email verification required
   ↓
/verify-email
```

The frontend must not directly assign authorization permissions based on the selected role.

The backend must establish the application's role securely.

---

# 8. Email Verification

**Route**

```text
/verify-email
```

**Purpose**

Allow a newly registered user to verify their email address.

### UI

```text
Check your email

We sent a verification code to your email address.

Verification code
[______]

[ Verify Email ]

Didn't receive it?
[ Resend code ]
```

### Success

```text
Verification successful
        ↓
Sign in
        ↓
Dashboard
```

---

# 9. Shared Application Shell

All authenticated pages should use a common application shell.

Desktop structure:

```text
┌─────────────────────────────────────────────────────────┐
│ EchoClass                              Profile / Menu   │
├───────────────┬─────────────────────────────────────────┤
│               │                                         │
│ Navigation    │              Page Content               │
│               │                                         │
│ Dashboard     │                                         │
│ Classes       │                                         │
│ My Echoes     │                                         │
│ Revisit       │                                         │
│ Profile       │                                         │
│               │                                         │
└───────────────┴─────────────────────────────────────────┘
```

Teacher navigation differs from student navigation.

---

# 10. Student Navigation

Primary student navigation:

```text
Dashboard
Classes
My Echoes
Revisit
Profile
```

Recommended route mapping:

```text
Dashboard   → /dashboard
Classes     → /classes
My Echoes   → /echoes
Revisit     → /revisits
Profile     → /profile
```

---

# 11. Teacher Navigation

Primary teacher navigation:

```text
Dashboard
My Classes
Profile
```

Recommended route mapping:

```text
Dashboard   → /dashboard
My Classes  → /classes
Profile     → /profile
```

Lesson creation should primarily happen from the class context rather than becoming a permanent top-level navigation item.

---

# 12. Dashboard

**Route**

```text
/dashboard
```

The dashboard is role-aware.

After authentication:

```text
/dashboard
     ↓
Application user role
     ├── STUDENT
     └── TEACHER
```

The same route may render different dashboard experiences depending on the user's application role.

---

# 13. Student Dashboard

**Route**

```text
/dashboard
```

### Purpose

Give students a calm overview of their active learning activity.

### Primary sections

```text
Welcome back

Your Classes

Recent Lessons

Pending Revisits

Recent Echoes
```

### Example

```text
Good morning, Alex.

Your Classes
────────────────────────
Neural Networks
Data Structures

Pending Revisits
────────────────────────
😕 Backpropagation
31:14
Due today

Recent Lessons
────────────────────────
How Neural Networks Learn
Decision Trees

Recent Echoes
────────────────────────
💡 Gradient Descent
⭐ Activation Functions
```

### Actions

Students should be able to:

- open a class
- open a lesson
- open a revisit
- open an Echo
- join a class

---

# 14. Teacher Dashboard

**Route**

```text
/dashboard
```

### Purpose

Provide teachers with an overview of their classes and recent learning activity.

### Primary sections

```text
Welcome back

Your Classes

Students

Lessons

Recent Activity

Recent Hotspots
```

### Example

```text
Your Classes

Neural Networks
37 students
4 lessons

Data Structures
28 students
6 lessons

Recent Activity

How Neural Networks Learn
29 / 37 students participated

Top Hotspot
31:14 – 34:02
```

The teacher dashboard should prioritize useful classroom signals rather than generic SaaS metrics.

---

# 15. Classes Index

**Route**

```text
/classes
```

The page is role-aware.

## Student

Displays classes where:

```text
ClassMembership.status = ACTIVE
```

Students should not see unrelated classes.

Primary action:

```text
[ Join Class ]
```

## Teacher

Displays classes where:

```text
Class.teacherId = authenticatedUserId
```

Primary action:

```text
[ Create Class ]
```

---

# 16. Join Class

**Route**

```text
/classes/join
```

**Role**

Student only.

### UI

```text
Join a Class

Enter the invite code provided by your teacher.

Invite code

[ ML-7K4P2 ]

[ Join Class ]
```

### States

Must handle:

```text
Invalid code
Expired/invalid class state
Already enrolled
Successful enrollment
Network failure
```

### Successful flow

```text
Join
 ↓
Membership created
 ↓
Class page
```

---

# 17. Class Page

**Route**

```text
/classes/[classId]
```

The class page is role-aware.

---

## 17.1 Student Class Page

### Purpose

Show the student's active learning content for the class.

### Sections

```text
Class Header
Lessons
Recent Activity
```

### Example

```text
Neural Networks

Introduction to neural networks

Lessons
────────────────────────────

How Neural Networks Learn
Published
42 min

Activation Functions
Published
31 min

Backpropagation
Published
28 min
```

Students must only see published lessons.

---

## 17.2 Teacher Class Page

### Purpose

Provide class management and lesson management.

### Sections

```text
Class Header
Students
Lessons
Invite Code
Recent Activity
```

### Primary actions

```text
[ Create Lesson ]
[ Generate Invite Code ]
[ Manage Students ]
[ Edit Class ]
```

---

# 18. Class Settings

**Route**

```text
/classes/[classId]/settings
```

**Role**

Teacher only.

### Responsibilities

Allow the teacher to:

- edit class name
- edit description
- archive class
- manage class-level settings where required

Archived classes should clearly communicate their archived state.

---

# 19. Student Management

**Route**

```text
/classes/[classId]/students
```

**Role**

Teacher only.

### Purpose

Allow the teacher to inspect and manage class membership.

### Example

```text
Students

37 students

Alex Morgan        Active
Sam Lee            Active
Taylor Chen        Active

[ Remove ]
```

Student identity should only be shown to the teacher in the context of class membership management.

This page is not a replacement for student activity analytics.

---

# 20. Lesson List

**Route**

```text
/classes/[classId]/lessons
```

**Role**

Teacher only.

### Purpose

Manage lessons belonging to the selected class.

### Example

```text
Lessons

[ Create Lesson ]

How Neural Networks Learn
Published

Activation Functions
Draft

Backpropagation
Published
```

Each lesson should expose appropriate actions:

```text
Open
Edit
Publish
Unpublish
Archive
Analytics
```

---

# 21. Create Lesson

**Route**

```text
/classes/[classId]/lessons/new
```

**Role**

Teacher only.

### Step 1 — Metadata

```text
Create Lesson

Title
[________________]

Description
[________________]

Content Type
Video

[ Continue ]
```

### Step 2 — Upload

```text
Upload Lesson Video

[ Select Video ]

or

Drag and drop video here

Upload progress
████████████░░░ 80%

[ Cancel ]
```

### Step 3 — Review

```text
Lesson Ready

How Neural Networks Learn

Video
42:17

Status
Draft

[ Save Draft ]
[ Publish Lesson ]
```

Publishing must only be available after the required media is successfully uploaded.

---

# 22. Lesson Edit

**Route**

```text
/classes/[classId]/lessons/[lessonId]/edit
```

**Role**

Teacher only.

### Editable metadata

```text
Title
Description
```

The teacher may also manage publication state through appropriate controls.

The timestamped Echo domain must not be modified as a side effect of metadata editing.

---

# 23. Lesson Upload

**Route**

```text
/classes/[classId]/lessons/[lessonId]/upload
```

**Role**

Teacher only.

This page may be combined with the lesson creation/edit page if the final UX is simpler.

### Upload flow

```text
Request upload authorization
        ↓
Upload directly to S3
        ↓
Verify upload
        ↓
Update lesson media metadata
        ↓
Ready to publish
```

The browser must never upload the video through the API Gateway/Lambda request body.

---

# 24. Student Lesson Player

**Route**

```text
/lessons/[lessonId]
```

**Role**

Student only.

This is the most important V1 page.

The page should combine:

```text
Video
Echo controls
Echo Timeline
Selected moment
Collective activity
Teacher responses
```

### Primary layout

```text
┌───────────────────────────────────────────────────────┐
│ Lesson title                                           │
│ Class name                                             │
├───────────────────────────────────────────────────────┤
│                                                       │
│                    VIDEO PLAYER                       │
│                                                       │
│                     31:14                             │
├───────────────────────────────────────────────────────┤
│                                                       │
│   😕 Confused       ⭐ Important       💡 Insight     │
│                                                       │
├───────────────────────────────────────────────────────┤
│ Echo Timeline                                         │
│                                                       │
│ 00:00 ────────●────────🔥🔥🔥────●──────── 42:17     │
│                                                       │
├───────────────────────────────────────────────────────┤
│ Selected Moment                                       │
│                                                       │
│ 31:14                                                 │
│ High Activity                                         │
│                                                       │
│ 12 students interacted here.                         │
│                                                       │
│ Confused 8   Important 3   Insight 4                 │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

# 25. Lesson Player Responsibilities

The lesson page must provide:

### Video controls

- play
- pause
- seek
- volume
- fullscreen
- current time
- duration

### Echo creation

The current video timestamp is captured when an Echo interaction begins.

### Timeline

Display:

- personal Echoes
- collective activity
- hotspots
- teacher responses

### Navigation

Selecting a timeline item must seek the video.

---

# 26. Echo Creation Interface

The Echo creation interface should remain directly attached to the player.

### Primary interaction

```text
😕 Confused
⭐ Important
💡 Insight
```

After selecting a type:

```text
What would you like to remember?

[ Optional note............................ ]
[ Save Echo ]
```

### Requirements

The interface must:

- capture timestamp locally
- allow optional note
- validate note length
- submit a small API request
- show immediate success feedback
- update the timeline without requiring a full page reload

---

# 27. Echo Timeline

The Echo Timeline is a custom product component.

It should visually encode:

```text
personal Echo markers
collective activity
activity intensity
hotspots
teacher responses
```

### Conceptual structure

```text
00:00
│
├──── personal Echo
│
├────────────── hotspot ────────────────┐
│                                       │
├──── personal Echo                     │
│                                       │
└────────────────────────────────────── 60:00
```

The timeline must remain usable on mobile web.

---

# 28. Timeline Interaction Model

Selecting a marker or hotspot should:

```text
Select item
    ↓
Seek player
    ↓
Highlight timeline region
    ↓
Show context panel
```

The context panel may display:

```text
31:14

High Activity

12 students interacted here.

Confused: 8
Important: 3
Insight: 4

Teacher Response

"The important idea here is..."
```

Student private notes must never appear in collective activity.

---

# 29. Hotspot Detail

Hotspot detail may be implemented as:

- a timeline side panel
- a bottom sheet
- a dialog
- a dedicated route

A dedicated route is not required for V1 if the contextual experience is strong enough.

### Content

```text
High Activity

31:14 – 34:02

17 Echoes
12 students participated

Confused
8

Important
4

Insight
5

[ Jump to 31:14 ]
```

The system must describe this as significant activity rather than automatically calling it a confusion point.

---

# 30. Teacher Lesson Analytics

**Route**

```text
/classes/[classId]/lessons/[lessonId]/analytics
```

**Role**

Teacher only.

This is the primary teacher investigation page.

### Layout

```text
How Neural Networks Learn

Students
37

Participated
29 / 37

Echoes
────────────────
😕 32
⭐ 21
💡 17

Timeline
────────────────────────────────

🔥 31:14 – 34:02

Confused: 8
Important: 4
Insight: 3

[ Inspect ]

42:07 – 43:15

Confused: 2
Important: 7
Insight: 4
```

---

# 31. Teacher Analytics Page Responsibilities

The analytics page must allow teachers to:

- view total Echoes
- view Echo counts by type
- view unique participating students
- inspect activity over time
- inspect hotspots
- jump to lesson timestamps
- add teacher responses

The analytics page must never display private student notes by default.

---

# 32. Teacher Response

Teacher responses should be created from the analytics context.

### Preferred interaction

```text
Hotspot
  ↓
Inspect
  ↓
[ Add Teacher Response ]
  ↓
Response dialog
```

### Dialog

```text
Add Teacher Response

Timestamp
31:14

Response
[......................................]
[......................................]
[......................................]

[ Cancel ]    [ Save Response ]
```

The response is associated with:

```text
lessonId
teacherId
timestampSeconds
```

The teacher identity is derived server-side.

---

# 33. Teacher Response Display

Teacher responses should appear in the lesson timeline and student lesson context.

Example:

```text
31:14

Teacher Response

The important idea here is that
backpropagation applies the chain rule
to determine how each weight contributed
to the final error.
```

Students can use the response while revisiting the original timestamp.

---

# 34. My Echoes

**Route**

```text
/echoes
```

**Role**

Student only.

### Purpose

Provide a personal chronological history of Echoes.

### Example

```text
My Echoes

────────────────────────────

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

Each Echo should provide:

```text
Lesson
Timestamp
Echo type
Note where appropriate
Created date
```

Private notes are visible only to the owning student.

---

# 35. Echo Detail

**Route**

```text
/echoes/[echoId]
```

This route is optional.

The preferred V1 behavior is to navigate directly to the relevant lesson and timestamp.

If implemented, the page should display:

```text
Echo

😕 Confused

How Neural Networks Learn

31:14

Your note:
"I don't understand how the gradient
gets propagated backwards."

Created 3 days ago

[ Open Lesson ]
[ Edit ]
[ Delete ]
```

---

# 36. Echo Editing

Echo editing should preferably occur through a dialog or inline panel rather than requiring a separate page.

### Editable

```text
type
note
```

### Immutable

```text
studentId
lessonId
classId
timestampSeconds
```

The UI should clearly communicate that the original timestamp is fixed.

---

# 37. Revisit Index

**Route**

```text
/revisits
```

**Role**

Student only.

### Purpose

Show pending and completed revisit moments.

### Layout

```text
Revisit

Due Today
────────────────────────

😕 Backpropagation
31:14

You marked this moment confusing
3 days ago.

[ Revisit ]

Upcoming
────────────────────────

Activation Functions
Tomorrow

Completed
────────────────────────

Gradient Descent
Completed
```

---

# 38. Revisit Detail

**Route**

```text
/revisits/[revisitId]
```

This page may be implemented as a focused revisit state or redirected directly to the lesson.

### Preferred flow

```text
Revisit
   ↓
Open lesson
   ↓
Seek to timestamp
   ↓
Show original Echo
   ↓
Student reviews moment
```

After reviewing:

```text
Do you understand this now?

[ Still Confused ]
[ Got It ]
```

---

# 39. Revisit Completion

Selecting:

```text
Got It
```

should mark the current revisit:

```text
status = COMPLETED
completedAt = now
```

The UI should provide a calm positive confirmation.

Example:

```text
Nice work.

You've revisited this moment.
```

Avoid gamification-heavy treatment.

---

# 40. Profile

**Route**

```text
/profile
```

Available to both roles.

### Sections

```text
Profile

Name
Email
Role

[ Save Changes ]

Security

[ Sign Out ]
```

The role should be displayed as informational data and should not be editable from the profile page.

Changing application roles is outside the normal V1 profile flow.

---

# 41. Unauthorized Page

**Route**

```text
/unauthorized
```

### Purpose

Explain that the authenticated user does not have permission to access a resource.

### Example

```text
You don't have permission to access this page.

The requested resource may belong to another class
or may no longer be available.

[ Back to Dashboard ]
```

Do not expose internal authorization details.

---

# 42. Not Found Page

**Route**

```text
/not-found
```

### Example

```text
We couldn't find that page.

The lesson, class, or resource may have been removed
or may no longer be available.

[ Back to Dashboard ]
```

Resource existence should not be unnecessarily exposed when authorization rules require indistinguishable `404` responses.

---

# 43. Global Error Page

**Route**

```text
/error
```

The application should provide a user-friendly fallback for unexpected errors.

Example:

```text
Something went wrong.

We couldn't complete that action.

[ Try Again ]
[ Back to Dashboard ]
```

Raw infrastructure errors must never be displayed.

---

# 44. Loading States

Pages that depend on authenticated or remote data should have intentional loading states.

The design should avoid blank screens.

Example:

```text
Loading your classes...

[ Skeleton ]
[ Skeleton ]
[ Skeleton ]
```

Lesson pages should use loading states appropriate to:

- lesson metadata
- timeline data
- analytics
- media authorization

---

# 45. Student Route Access Matrix

| Route                                             | Student                       |
| ------------------------------------------------- | ----------------------------- |
| `/dashboard`                                      | Own dashboard                 |
| `/classes`                                        | Active memberships            |
| `/classes/join`                                   | Yes                           |
| `/classes/[classId]`                              | Active membership             |
| `/classes/[classId]/students`                     | Deny                          |
| `/classes/[classId]/lessons`                      | Read through class context    |
| `/classes/[classId]/lessons/new`                  | Deny                          |
| `/classes/[classId]/lessons/[lessonId]/analytics` | Deny                          |
| `/lessons/[lessonId]`                             | Published + active membership |
| `/echoes`                                         | Own Echoes                    |
| `/echoes/[echoId]`                                | Own Echo                      |
| `/revisits`                                       | Own revisits                  |
| `/revisits/[revisitId]`                           | Own revisit                   |
| `/profile`                                        | Own profile                   |

---

# 46. Teacher Route Access Matrix

| Route                                             | Teacher                        |
| ------------------------------------------------- | ------------------------------ |
| `/dashboard`                                      | Own dashboard                  |
| `/classes`                                        | Own classes                    |
| `/classes/join`                                   | Deny                           |
| `/classes/[classId]`                              | Owned class                    |
| `/classes/[classId]/students`                     | Owned class                    |
| `/classes/[classId]/lessons`                      | Owned class                    |
| `/classes/[classId]/lessons/new`                  | Owned class                    |
| `/classes/[classId]/lessons/[lessonId]/edit`      | Owned lesson                   |
| `/classes/[classId]/lessons/[lessonId]/upload`    | Owned lesson                   |
| `/classes/[classId]/lessons/[lessonId]/analytics` | Owned lesson                   |
| `/lessons/[lessonId]`                             | Not primary teacher experience |
| `/echoes`                                         | Deny                           |
| `/revisits`                                       | Deny                           |
| `/profile`                                        | Own profile                    |

---

# 47. Route-Level Authorization Strategy

The frontend should use authentication state to improve navigation and UX.

However:

```text
Frontend route protection
        ≠
Authorization
```

Every page that loads protected resources must call backend APIs that enforce:

```text
Authentication
      ↓
Identity
      ↓
Role
      ↓
Ownership / Membership
      ↓
Resource State
```

For example:

```text
GET /lessons/{lessonId}
```

must verify:

```text
Authenticated user
        ↓
Student
        ↓
Active membership in lesson.classId
        ↓
lesson.status = PUBLISHED
```

---

# 48. Lesson Page Data Architecture

The student lesson page should load a consolidated lesson experience where practical.

Conceptually:

```text
Lesson Page
    │
    ├── Lesson metadata
    │
    ├── Media authorization
    │
    ├── Personal Echoes
    │
    ├── Collective activity
    │
    ├── Hotspots
    │
    └── Teacher responses
```

The frontend should avoid making one request per timeline marker.

---

# 49. Suggested Student Lesson API Loading

Initial page load:

```text
GET /api/v1/lessons/{lessonId}
GET /api/v1/lessons/{lessonId}/timeline
```

The timeline response should contain enough information to render:

```text
personal markers
aggregate activity
hotspots
teacher responses
```

Media access should use the secure media mechanism returned or authorized by the backend.

---

# 50. Suggested Teacher Analytics API Loading

Teacher analytics page:

```text
GET /api/v1/lessons/{lessonId}
GET /api/v1/lessons/{lessonId}/analytics
GET /api/v1/lessons/{lessonId}/timeline
```

The exact API aggregation can be optimized during implementation.

The frontend should not independently reconstruct authorization or student identity relationships.

---

# 51. Navigation from Echoes

When a student selects an Echo:

```text
My Echoes
   ↓
Echo
   ↓
Open Lesson
   ↓
/lessons/{lessonId}?t=1874
```

The `t` query parameter may represent the target timestamp.

Example:

```text
/lessons/lesson_123?t=1874
```

The lesson page should:

1. load the lesson
2. authorize access
3. load the media
4. seek to the requested timestamp
5. highlight the corresponding Echo/timeline region

The query parameter must never bypass authorization.

---

# 52. Navigation from Revisits

When a student selects a revisit:

```text
Revisit
   ↓
Lesson
   ↓
/lessons/{lessonId}?t=1874&revisit={revisitId}
```

The lesson page should enter a revisit-aware state.

Example:

```text
You marked this moment confusing 3 days ago.

31:14

[ Play ]

Do you understand this now?

[ Still Confused ]
[ Got It ]
```

---

# 53. Navigation from Teacher Analytics

When a teacher selects a hotspot:

```text
Analytics
   ↓
Hotspot
   ↓
Lesson context
```

Preferred implementation:

```text
/classes/{classId}/lessons/{lessonId}/analytics?at=1874
```

The analytics page can highlight the selected hotspot and provide:

```text
[ Open Lesson ]
```

Opening the lesson should seek to the relevant timestamp.

---

# 54. Browser URL State

URL state should be used selectively for meaningful navigation state.

Recommended:

```text
?t=1874
```

for a lesson timestamp.

Potentially:

```text
?hotspot=hotspot_123
```

for analytics selection.

Avoid placing rapidly changing video playback state into the URL.

The current playback timestamp should not update the browser URL continuously.

---

# 55. Responsive Page Architecture

The application should support:

```text
Desktop
Laptop
Tablet
Mobile Web
```

## Desktop

Use a persistent sidebar and larger content regions.

## Tablet

Use a narrower sidebar or collapsible navigation.

## Mobile

Use a compact navigation pattern.

The lesson page should prioritize:

```text
Video
Echo controls
Timeline
Selected context
```

in that order.

---

# 56. Mobile Lesson Layout

Recommended mobile structure:

```text
┌───────────────────────┐
│ Lesson title          │
├───────────────────────┤
│                       │
│      Video            │
│                       │
├───────────────────────┤
│ 😕   ⭐   💡           │
├───────────────────────┤
│ Echo Timeline         │
│ ───●────🔥🔥──●────   │
├───────────────────────┤
│ 31:14                 │
│ High Activity         │
│                       │
│ Confused 8            │
│ Important 3           │
│ Insight 4             │
└───────────────────────┘
```

The Echo controls must remain easy to reach without requiring navigation away from playback.

---

# 57. Page-Level Component Architecture

The following reusable components should form the foundation of the page architecture.

## Shared

```text
AppShell
Sidebar
MobileNavigation
TopBar
UserMenu
PageHeader
EmptyState
ErrorState
LoadingState
ConfirmDialog
```

## Classes

```text
ClassCard
ClassHeader
ClassList
ClassForm
InviteCodeCard
MemberList
MemberRow
```

## Lessons

```text
LessonCard
LessonList
LessonForm
LessonStatusBadge
LessonPlayer
LessonHeader
```

## Echoes

```text
EchoButton
EchoTypeBadge
EchoForm
EchoCard
EchoList
EchoTimeline
EchoTimelineMarker
```

## Analytics

```text
ActivitySummary
ActivityBreakdown
Hotspot
HotspotList
HotspotDetail
TeacherResponse
TeacherResponseForm
```

## Revisits

```text
RevisitCard
RevisitList
RevisitStatusBadge
RevisitPrompt
```

---

# 58. Lesson Page Component Architecture

The lesson page should conceptually be structured as:

```text
LessonPage
│
├── LessonHeader
│
├── LessonPlayer
│
├── EchoComposer
│   ├── ConfusedButton
│   ├── ImportantButton
│   └── InsightButton
│
├── EchoTimeline
│   ├── PersonalMarkers
│   ├── ActivityLayer
│   ├── HotspotLayer
│   └── TeacherResponseMarkers
│
└── MomentContext
    ├── ActivitySummary
    ├── HotspotDetail
    └── TeacherResponse
```

The actual implementation should keep the timeline and player synchronized through shared client state.

---

# 59. Teacher Analytics Component Architecture

```text
LessonAnalyticsPage
│
├── LessonHeader
│
├── ParticipationSummary
│
├── EchoBreakdown
│   ├── ConfusedCount
│   ├── ImportantCount
│   └── InsightCount
│
├── AnalyticsTimeline
│
├── HotspotList
│   └── HotspotCard
│
└── HotspotDetail
    └── TeacherResponseForm
```

---

# 60. Student Dashboard Component Architecture

```text
StudentDashboard
│
├── WelcomeHeader
├── ClassList
│
├── PendingRevisitSection
│   └── RevisitCard
│
├── RecentLessons
│   └── LessonCard
│
└── RecentEchoes
    └── EchoCard
```

---

# 61. Teacher Dashboard Component Architecture

```text
TeacherDashboard
│
├── WelcomeHeader
├── ClassOverview
│   └── ClassCard
│
├── RecentActivity
│   └── ActivityCard
│
└── RecentHotspots
    └── HotspotCard
```

---

# 62. Page State Model

Pages should distinguish between:

```text
Server State
Client UI State
URL State
Authentication State
```

## Server State

Managed through TanStack Query.

Examples:

```text
classes
lessons
echoes
timeline
analytics
revisits
profile
```

## Client UI State

Examples:

```text
selected timeline marker
open dialog
active Echo type
expanded hotspot
mobile navigation state
```

## URL State

Examples:

```text
lesson timestamp
selected hotspot
```

## Authentication State

Managed through the Cognito integration and application authentication layer.

---

# 63. Query Caching Strategy

TanStack Query should cache stable server state where appropriate.

Potential query keys:

```text
["me"]

["classes"]

["class", classId]

["class", classId, "members"]

["class", classId, "lessons"]

["lesson", lessonId]

["lesson", lessonId, "timeline"]

["lesson", lessonId, "analytics"]

["echoes"]

["echo", echoId]

["revisits"]
```

After Echo creation:

```text
invalidate timeline
invalidate analytics where appropriate
invalidate personal echoes
```

The exact invalidation strategy should avoid unnecessary network traffic.

---

# 64. Page Data Ownership

Pages should consume domain data through API/query hooks rather than directly accessing DynamoDB or AWS services.

The frontend architecture must remain:

```text
Page
 ↓
Query / Mutation Hook
 ↓
API Client
 ↓
API Gateway
 ↓
Lambda
 ↓
DynamoDB / S3 / CloudFront
```

Never:

```text
Page
 ↓
DynamoDB
```

---

# 65. Authentication-Aware Rendering

Authenticated application pages should follow:

```text
Authentication loading
        ↓
Authenticated?
   ┌────┴────┐
  No        Yes
  ↓          ↓
Sign In    Load /me
             ↓
          Determine role
             ↓
        Render dashboard
```

A user's role should come from the trusted application user record.

---

# 66. Empty States

Every collection page should have an intentional empty state.

## Student Classes

```text
You're not part of any classes yet.

Join a class using an invite code.

[ Join Class ]
```

## Teacher Classes

```text
Create your first class.

Start by creating a private classroom
for your students.

[ Create Class ]
```

## My Echoes

```text
Your Echoes will appear here.

Watch a lesson and leave an Echo when
something feels confusing, important,
or insightful.
```

## Revisits

```text
No revisits are due.

When you mark a moment confusing,
EchoClass will help you return to it later.
```

---

# 67. Error State Strategy

Errors should be presented in the context of the action.

Examples:

```text
Unable to load this class.
[ Try Again ]
```

```text
You don't have permission to access this lesson.
[ Back to Dashboard ]
```

```text
We couldn't save your Echo.
[ Try Again ]
```

Avoid:

```text
500 Internal Server Error
DynamoDB ConditionalCheckFailedException
AccessDeniedException
```

in the user interface.

---

# 68. Destructive Actions

Destructive actions should require appropriate confirmation.

Examples:

```text
Archive Class
Remove Student
Delete Echo
Archive Lesson
```

Echo deletion confirmation:

```text
Delete this Echo?

This will permanently remove your Echo.

[ Cancel ] [ Delete Echo ]
```

Class and lesson archiving should use softer language where appropriate because V1 defines archiving rather than deletion.

---

# 69. Success Feedback

Success feedback should be subtle.

Examples:

```text
Echo saved.
```

```text
Lesson published.
```

```text
Student removed from class.
```

```text
Response added.
```

```text
Revisit completed.
```

Avoid intrusive toast notifications for every minor interaction.

---

# 70. Core Product Flow — Teacher

The page architecture must support:

```text
/sign-up
   ↓
/verify-email
   ↓
/sign-in
   ↓
/dashboard
   ↓
/classes
   ↓
/classes/{classId}
   ↓
/classes/{classId}/lessons/new
   ↓
/classes/{classId}/lessons/{lessonId}/upload
   ↓
/classes/{classId}/lessons/{lessonId}/analytics
   ↓
Hotspot
   ↓
Teacher Response
```

---

# 71. Core Product Flow — Student

The page architecture must support:

```text
/sign-up
   ↓
/verify-email
   ↓
/sign-in
   ↓
/dashboard
   ↓
/classes/join
   ↓
/classes/{classId}
   ↓
/lessons/{lessonId}
   ↓
Create Echo
   ↓
Timeline Hotspot
   ↓
/echoes
   ↓
/lessons/{lessonId}?t=1874
   ↓
/revisits
   ↓
Revisit
   ↓
Got It
```

---

# 72. Primary Wow-Moment Architecture

The architecture should make the primary product demonstration possible without unnecessary navigation.

```text
Student Lesson
      │
      ├── Watch
      │
      ├── 😕 Echo
      │
      ├── Timeline updates
      │
      └── Continue watching
              │
              ▼
        Collective activity
              │
              ▼
       Teacher Analytics
              │
              ├── Hotspot
              │
              └── Teacher Response
                         │
                         ▼
                  Student Lesson
                         │
                         ▼
                     Revisit
                         │
                         ▼
                      Got It
```

The lesson page is therefore the central product surface.

---

# 73. Recommended Navigation Hierarchy

## Student

```text
Dashboard
│
├── Classes
│   ├── Class
│   │   └── Lesson
│   │
│   └── Join Class
│
├── My Echoes
│   └── Lesson timestamp
│
├── Revisit
│   └── Lesson timestamp
│
└── Profile
```

## Teacher

```text
Dashboard
│
├── My Classes
│   └── Class
│       ├── Students
│       ├── Lessons
│       │   ├── Create
│       │   ├── Edit
│       │   ├── Upload
│       │   └── Analytics
│       │       └── Hotspot
│       │           └── Teacher Response
│       │
│       └── Settings
│
└── Profile
```

---

# 74. Page Naming Conventions

Routes should use lowercase kebab-case where multiple words are required.

Examples:

```text
/sign-in
/sign-up
/verify-email
/classes
/revisits
```

Dynamic resources should use stable identifiers:

```text
/classes/[classId]
/lessons/[lessonId]
/echoes/[echoId]
/revisits/[revisitId]
```

Human-readable titles should not be used as authoritative resource identifiers.

---

# 75. Page Metadata

Each major page should define useful browser metadata.

Examples:

```text
Dashboard | EchoClass
My Echoes | EchoClass
Revisit | EchoClass
Neural Networks | EchoClass
Lesson Analytics | EchoClass
```

Lesson titles may be used dynamically for lesson pages.

Sensitive student activity should not be included in document titles.

---

# 76. Accessibility Architecture

Every page must support:

```text
Keyboard navigation
Screen readers
Visible focus
Semantic headings
Accessible forms
Accessible dialogs
Accessible buttons
Non-color indicators
```

Echo type indicators must always contain text or an accessible label.

Example:

```text
😕 Confused
⭐ Important
💡 Insight
```

is preferable to icon-only controls.

---

# 77. Visual Hierarchy

The application should consistently use:

```text
Deep Ink Navy
#1B2A4A
```

for structural hierarchy.

```text
Warm Amber
#F4A14B
```

for Important Echoes and attention states.

```text
Understanding Green
#5CB88A
```

for Insight and successful revisit states.

```text
Chalk White
#E8F0F7
```

for calm surfaces and backgrounds.

The lesson timeline should use these colors sparingly to preserve a calm visual language.

---

# 78. Animation Architecture

Animation should primarily communicate state changes.

Recommended:

```text
Echo marker appears
Hotspot expands
Timeline selection changes
Player seeks
Revisit completes
```

Avoid animations that continuously move while a lesson is playing.

The lesson itself remains the primary focus.

---

# 79. Mobile Navigation

On mobile, the application should use a compact navigation mechanism.

Recommended student navigation:

```text
Dashboard
Classes
Echoes
Revisit
Profile
```

Recommended teacher navigation:

```text
Dashboard
Classes
Profile
```

The lesson page should not be obstructed by persistent navigation while the user is watching video.

---

# 80. Implementation Boundaries

The page architecture must not introduce V1 features outside the requirements.

Do not add:

```text
Chat
Assignments
Quizzes
AI Tutor
Transcription
Live Lessons
Notifications
Grading
Attendance
```

unless the product requirements are explicitly expanded.

---

# 81. Recommended V1 Page Inventory

## Authentication

```text
1. Sign In
2. Sign Up
3. Verify Email
```

## Shared

```text
4. Dashboard
5. Profile
6. Unauthorized
7. Not Found
8. Error
```

## Student

```text
9. Classes
10. Join Class
11. Student Class
12. Lesson Player
13. My Echoes
14. Revisit
```

## Teacher

```text
15. My Classes
16. Teacher Class
17. Student Management
18. Lesson List
19. Create Lesson
20. Edit Lesson
21. Upload Lesson
22. Lesson Analytics
```

The following should preferably be implemented as contextual components rather than separate pages:

```text
Echo Creation
Hotspot Detail
Teacher Response
Echo Editing
Revisit Completion
```

---

# 82. V1 Screen Priority

The implementation order should prioritize the core learning loop.

## P0

```text
Sign In
Sign Up
Verify Email

Student Dashboard
Teacher Dashboard

Classes
Class Page

Create Lesson
Lesson Upload

Student Lesson Player
Echo Creation
Echo Timeline

Teacher Analytics
Hotspot Detail
```

## P1

```text
My Echoes
Revisit
Teacher Response
Student Management
```

## P2

```text
Advanced class settings
Advanced lesson management
Additional dashboard refinements
```

---

# 83. Definition of Done — Page Architecture

The page architecture is complete when:

- [ ] Every V1 user journey has a defined route or contextual UI.
- [ ] Teacher and student navigation are clearly separated.
- [ ] Authentication pages are defined.
- [ ] Class management pages are defined.
- [ ] Lesson creation and upload pages are defined.
- [ ] Student lesson experience is defined.
- [ ] Echo creation is integrated into the lesson page.
- [ ] Echo Timeline is treated as a core product component.
- [ ] Teacher analytics is defined.
- [ ] Hotspot inspection is defined.
- [ ] Teacher response interaction is defined.
- [ ] My Echoes is defined.
- [ ] Revisit experience is defined.
- [ ] Profile is defined.
- [ ] Unauthorized and error states are defined.
- [ ] Mobile navigation is defined.
- [ ] Route-level role expectations are documented.
- [ ] Resource-level authorization remains server-side.
- [ ] Page data loading is compatible with TanStack Query.
- [ ] URL state is defined for timestamp navigation.
- [ ] The core Wow Moment can be completed without unnecessary navigation.

---

# 84. Final Page Architecture

The final V1 architecture can be summarized as:

```text
                         EchoClass
                            │
                 ┌──────────┴──────────┐
                 │                     │
              Teacher                Student
                 │                     │
             Dashboard             Dashboard
                 │                     │
              Classes               Classes
                 │                     │
               Class                 Class
                 │                     │
              Lessons               Lessons
                 │                     │
          Create / Upload        Lesson Player
                 │                     │
             Publish              Echo Composer
                 │                     │
            Analytics            Echo Timeline
                 │                     │
              Hotspot              Hotspot
                 │                     │
        Teacher Response          My Echoes
                                       │
                                    Revisit
                                       │
                                    Got It
```

The central product relationship is:

```text
Teacher
   ↓
Class
   ↓
Lesson
   ↓
Student watches
   ↓
Echoes accumulate
   ↓
Timeline
   ↓
Hotspots
   ↓
Teacher Response
   ↓
Student Revisit
   ↓
Understanding
```

The architecture should preserve the product's core principle:

> **Every lesson leaves a trace.**
