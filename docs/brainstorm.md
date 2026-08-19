# EchoClass — Production V1 Brainstorm

> **Every lesson leaves a trace.**

## 1. Product Vision

EchoClass is a classroom learning platform where teachers publish pre-recorded lessons and students interact with those lessons through timestamped learning signals called **Echoes**.

Instead of treating a lesson as something students simply watch and forget, EchoClass creates a persistent learning trace:

```text
Lesson
  ↓
Student interactions
  ↓
Timestamped Echoes
  ↓
Collective Echo Timeline
  ↓
Confusion / insight hotspots
  ↓
Revisit
  ↓
Better understanding
```

The V1 product focuses on one strong idea:

> **Turn a recorded lesson into an interactive timeline of what students found confusing, important, or insightful.**

The system is designed as a real production application, not merely a prototype. Authentication, authorization, storage, deployment, and data isolation are therefore part of V1.

---

# 2. V1 Goals

## Primary Goals

1. Teachers can create and manage their own classes.
2. Teachers can add students to their classes.
3. Students only see classes they belong to.
4. Teachers only see classes they own/teach.
5. Teachers can create lessons inside their classes.
6. Teachers can upload recorded video lessons.
7. Students can watch lessons securely.
8. Students can create timestamped Echoes while watching.
9. Echoes can contain a reaction type and optional note.
10. Students can see their personal Echoes.
11. Students can see an aggregated Echo Timeline for a lesson.
12. The system can identify high-activity/hotspot regions.
13. Teachers can inspect lesson hotspots and student feedback.
14. Students can revisit specific lesson moments.
15. The system can create simple spaced-revisit reminders.
16. The complete application can be deployed to AWS.
17. Authentication and authorization must be enforced server-side.

---

# 3. Explicit V1 Non-Goals

To keep V1 stable and production-ready, we will deliberately NOT build:

* Live video streaming
* Live classroom communication
* Video conferencing
* Chat between students
* Full LMS functionality
* Assignment management
* Exams/quizzes
* Attendance tracking
* Complex grading
* Mobile native applications
* AI tutor/chatbot
* Automatic lecture transcription
* Automatic AI summaries
* Automatic AI-generated hotspots
* Facial/emotion recognition
* Advanced recommendation systems
* Complex spaced-repetition algorithms
* Public/social classrooms
* Marketplace functionality

These may become future features.

The V1 should be excellent at one thing rather than mediocre at twenty things.

---

# 4. Target Users

EchoClass has two primary roles.

## Teacher

A teacher can:

* Create classes
* View their classes
* Add/remove students
* Create lessons
* Upload lesson videos
* Publish/unpublish lessons
* View lesson timelines
* View aggregated student activity
* Inspect hotspots
* Add teacher notes/responses
* See student feedback associated with lesson moments

## Student

A student can:

* View classes they belong to
* View published lessons in their classes
* Watch lessons
* Create Echoes
* Add notes to Echoes
* View their own Echo history
* View collective lesson activity
* Explore hotspots
* Revisit previous moments
* Mark a revisited moment as understood
* Receive/view simple revisit reminders

---

# 5. Core Mental Model

The application hierarchy is:

```text
User
 │
 ├── Teacher
 │      │
 │      └── Classes
 │             │
 │             ├── Students
 │             │
 │             └── Lessons
 │                    │
 │                    └── Echoes
 │
 └── Student
        │
        └── Class Memberships
               │
               └── Lessons
                      │
                      └── Personal Echoes
```

The most important relationship is:

```text
Teacher
   ↓
Class
   ↓
Student Membership
   ↓
Lesson
   ↓
Timestamped Echo
```

This relationship is also the foundation of authorization.

---

# 6. Identity and Access Model

Amazon Cognito will handle authentication.

Cognito answers:

> Who is this person?

Our application database answers:

> What role do they have?

and:

> Which classes are they allowed to access?

We should NOT rely solely on frontend route hiding for authorization.

Every protected backend operation must verify authorization.

---

# 7. Roles

V1 has two application roles:

```text
TEACHER
STUDENT
```

A user has one primary role.

Example:

```text
User
id: user_123
role: TEACHER
name: Alex
email: alex@example.com
```

or:

```text
User
id: user_456
role: STUDENT
name: Maya
email: maya@example.com
```

The Cognito `sub`/user identifier becomes the stable identity reference used by our application.

---

# 8. Class Model

A class is a private learning group owned by a teacher.

Example:

```text
Class
────────────────────────
Introduction to ML
Teacher: Alex
Students: 37
```

A class contains:

* `classId`
* `teacherId`
* `name`
* `description`
* `status`
* `createdAt`
* `updatedAt`

A teacher should only retrieve classes where:

```text
class.teacherId == authenticatedUserId
```

A student should only retrieve classes where they have an active membership.

---

# 9. Student-Class Membership

Students should not simply be associated with all classes.

We explicitly create membership records.

Conceptually:

```text
ClassMembership
────────────────────────
classId
studentId
status
joinedAt
```

Possible status:

```text
ACTIVE
REMOVED
```

For V1, we can keep this simple.

The important rule is:

```text
Student
   ↓
Membership
   ↓
Class
```

If no active membership exists:

> Student cannot access the class.

---

# 10. How Students Join a Class

V1 should avoid building a complex school-wide administration system.

The simplest stable flow is:

### Teacher generates a class invite code

Example:

```text
ML-7K4P2
```

Student enters the code:

```text
Join a Class

Enter class code:

[ ML-7K4P2 ]

[ Join Class ]
```

Backend validates the code and creates the membership.

This gives us a complete working enrollment mechanism without needing an administrator role.

---

# 11. Class Isolation

This is a critical security requirement.

Suppose:

```text
Teacher A
 ├── ML Class
 └── Python Class

Teacher B
 └── Physics Class
```

Teacher A must not be able to access Teacher B's class simply by changing:

```text
/class/{classId}
```

Similarly:

```text
Student A
 └── ML Class
```

must not be able to request:

```text
/class/physics-class-id
```

and receive data.

Every API request involving a class must verify ownership/membership.

---

# 12. Lesson Model

V1 lessons are recorded lessons.

Primary content type:

> **Video**

Potential secondary content type:

> **Audio**

We should architect the database so the lesson has a content type:

```text
VIDEO
AUDIO
```

but build video first.

A lesson contains:

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

Possible status:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Only `PUBLISHED` lessons are visible to students.

---

# 13. Why Video Is the Primary V1 Content Type

Video gives us the strongest EchoClass experience.

A timestamp such as:

```text
31:14
```

has an obvious meaning when attached to a video.

The student can:

1. Watch the video.
2. Create an Echo.
3. Pause/replay the exact moment.
4. Jump back to the moment later.

Audio can use the same timestamp model, but video should be the primary demo and implementation path.

---

# 14. Media Storage

Lesson media is stored in Amazon S3.

Conceptually:

```text
S3
│
└── lessons/
      └── {lessonId}/
            └── video.mp4
```

The database stores the object key rather than the video itself.

Example:

```text
mediaKey:
lessons/lesson_123/video.mp4
```

---

# 15. Media Delivery

Amazon CloudFront sits in front of S3.

Conceptually:

```text
Student
   ↓
CloudFront
   ↓
S3
   ↓
Video
```

The application should not expose the S3 bucket publicly.

The preferred production architecture is:

```text
Private S3 bucket
       ↓
CloudFront
       ↓
Authenticated/authorized application access
```

We should design the final media-access mechanism carefully during implementation, potentially using signed CloudFront URLs/cookies or another secure access pattern.

---

# 16. Echoes

An Echo is the core interaction primitive of EchoClass.

An Echo represents:

> A student's reaction to a specific moment in a lesson.

Each Echo contains:

```text
echoId
lessonId
classId
studentId
timestampSeconds
type
note
createdAt
```

---

# 17. Echo Types

V1 should have three primary types:

### 😕 Confused

> "I don't understand this."

### ⭐ Important

> "This is important. I want to remember it."

### 💡 Insight

> "This helped something click."

Optional future types can include:

* Question
* Interesting
* Review
* Teacher-highlighted

But V1 stays with three.

---

# 18. Creating an Echo

While watching:

```text
▶ 31:14

😕 Confused
⭐ Important
💡 Insight
```

Student clicks:

```text
😕
```

EchoClass captures the current playback timestamp.

The student can optionally add:

```text
Why are we calculating this derivative?
```

Then:

```text
[ Save Echo ]
```

The backend stores the event.

---

# 19. Echo Ownership

Every Echo belongs to exactly one student.

Example:

```text
echo_123
studentId = student_456
lessonId = lesson_789
timestamp = 1874
type = CONFUSED
```

Students can edit/delete their own Echoes.

Students cannot modify another student's Echo.

Teachers can view aggregated student Echo information according to the product's privacy model.

---

# 20. Student Privacy

We should avoid turning EchoClass into a system where students feel publicly judged.

Therefore:

### Student's exact personal notes

Private by default.

Example:

> "I don't understand why the derivative changes sign."

Other students should not automatically see the author's name or private note.

### Aggregate signals

Can be shown:

```text
12 students marked this area as confusing.
```

### Anonymous/aggregated peer insights

We can optionally show anonymized notes in V1 if implemented carefully.

For example:

> "Why does this derivative change sign?"

rather than:

> Rahul said...

This allows collective learning without exposing individual struggles unnecessarily.

---

# 21. Echo Timeline

The Echo Timeline is the primary product interface.

It maps lesson activity onto time.

Example:

```text
00:00 ───────────────────────────────────────── 60:00
          ⭐             😕
                              🔥🔥🔥
                                    💡
```

The timeline should show:

* Personal Echoes
* Collective activity
* Hotspots
* Teacher responses

---

# 22. Timeline Interaction

Clicking a marker should:

1. Seek the media player to that timestamp.
2. Highlight the selected Echo.
3. Show contextual information.

Example:

```text
31:14

🔥 High Activity

12 students interacted here.

Confused: 8
Important: 3
Insight: 4
```

---

# 23. Hotspots

A hotspot represents a period of unusually high Echo activity.

We should NOT overcomplicate hotspot detection in V1.

A simple deterministic algorithm is sufficient.

Example:

1. Group Echoes into time windows.
2. Count activity within each window.
3. Identify windows above a threshold.
4. Merge adjacent high-activity windows.

For example:

```text
31:00–32:00 → 2 Echoes
32:00–33:00 → 11 Echoes
33:00–34:00 → 14 Echoes
34:00–35:00 → 4 Echoes
```

could become:

```text
Hotspot:
32:00–34:00
```

The exact algorithm can be tuned after we see real data.

---

# 24. Hotspot Meaning

A hotspot does NOT automatically mean:

> "Students were confused."

It means:

> "There was significant student interaction around this point."

We can then break down the activity:

```text
Confused: 8
Important: 4
Insight: 3
```

This distinction should remain clear in the UI.

---

# 25. Teacher Dashboard

Teacher dashboard should answer:

> "How are my classes and lessons performing?"

Example:

```text
My Classes

Introduction to ML
37 students
8 lessons

Python Fundamentals
24 students
5 lessons
```

The teacher should NOT see unrelated classes.

---

# 26. Teacher Class Page

Selecting a class:

```text
Introduction to ML

Students: 37

Lessons
────────────────────────────
01  Introduction
02  Linear Regression
03  Neural Networks
04  Backpropagation
```

Teacher can:

* Add students
* Remove students
* Create lesson
* Edit lesson
* Publish lesson
* Archive lesson

---

# 27. Teacher Lesson Analytics

Teacher selects a lesson.

Dashboard:

```text
How Neural Networks Learn

Students interacted: 29 / 37

Echoes:
😕 32
⭐ 21
💡 17

Top Hotspots:

31:14–34:02 🔥🔥🔥🔥
42:07–43:15 🔥🔥
```

Teacher can click a hotspot to investigate.

---

# 28. Teacher Response

Teacher should be able to attach an explanation to a lesson moment.

For V1, this can be a text response.

Example:

```text
31:14

Teacher Response

"The important thing to remember is that
backpropagation is applying the chain rule
to determine how each weight contributed
to the final error."

[ Save Response ]
```

Audio teacher responses can remain a future enhancement.

---

# 29. Student Revisit

Students should have a personal history.

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

Clicking an item takes the student back to the lesson moment.

---

# 30. Spaced Echo V1

We should implement a deliberately simple version.

We do NOT need sophisticated machine learning.

When a student creates a `CONFUSED` Echo, the system can schedule revisit points.

Example:

```text
Initial Echo
    ↓
+1 day
    ↓
+3 days
    ↓
+7 days
```

We can later refine this based on the student's response.

---

# 31. Revisit State

A revisit can have a simple state:

```text
PENDING
COMPLETED
```

When the student opens the reminder:

```text
You marked this moment confusing 3 days ago.

[ Revisit ]
```

After revisiting:

```text
Do you understand this now?

[ Still confused ]
[ Got it ]
```

For V1, this is enough.

---

# 32. Echo Learning Journey

A student should eventually be able to see:

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
👍 Got it
```

This is one of the strongest differentiating UI concepts in EchoClass.

---

# 33. Main Student Navigation

V1 student navigation:

```text
Dashboard
Classes
My Echoes
Revisit
Profile
```

Dashboard:

```text
My Classes

Introduction to ML
Python Fundamentals
```

---

# 34. Main Teacher Navigation

V1 teacher navigation:

```text
Dashboard
My Classes
Create Lesson
Profile
```

Teacher dashboard focuses on classes and lesson activity.

---

# 35. Authentication Flow

Use Amazon Cognito.

Basic flow:

```text
User
 ↓
Sign Up
 ↓
Email verification
 ↓
Sign In
 ↓
Cognito authentication
 ↓
Application
```

On first login, application profile information is created/updated.

---

# 36. Registration

Teacher/student registration should explicitly capture role.

Example:

```text
Create Account

Name
Email
Password

I am a:

( ) Teacher
( ) Student

[ Create Account ]
```

The role must not be trusted from arbitrary client-side requests.

The backend should establish the user's application role securely.

---

# 37. Important Security Rule

Never trust:

```text
role = TEACHER
```

because the frontend says so.

Never trust:

```text
studentId = abc
```

because the request body says so.

The authenticated identity must come from Cognito.

For example:

```text
authenticatedUserId
        ↓
Cognito identity
        ↓
Backend
        ↓
Application user
```

Then authorization is based on that identity.

---

# 38. API Architecture

V1 backend:

```text
Frontend
   ↓
API Gateway
   ↓
Lambda
   ↓
DynamoDB
```

S3/CloudFront handle media.

Cognito handles authentication.

Conceptually:

```text
                    ┌──────────────┐
                    │   Cognito    │
                    │     Auth     │
                    └──────┬───────┘
                           │
                           ▼
┌───────────┐       ┌──────────────┐
│ Frontend  │──────▶│ API Gateway  │
└───────────┘       └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Lambda    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  DynamoDB    │
                    └──────────────┘

Lesson Media:

Frontend
   ↓
CloudFront
   ↓
Private S3
```

---

# 39. Lambda Design

We should avoid creating dozens of tiny Lambda functions unnecessarily.

V1 can use a small number of logical API handlers.

Possible structure:

```text
Auth/Profile
Classes
Lessons
Echoes
Analytics
Revisits
```

Whether these become separate Lambda functions or routes handled by fewer functions should be decided during implementation based on maintainability.

The important principle is:

> Keep the backend simple and observable.

---

# 40. DynamoDB Data Model

We should favor access patterns over relational thinking.

Core entities:

```text
User
Class
ClassMembership
Lesson
Echo
TeacherResponse
Revisit
```

Potentially:

```text
InviteCode
```

if invite codes are stored independently.

We will finalize the exact DynamoDB key strategy before implementation.

---

# 41. Core Data Relationships

Conceptually:

```text
User
 │
 ├──────────────┐
 │              │
Teacher       Student
 │              │
 ▼              ▼
Class        Membership
 │              │
 └──────┬───────┘
        ▼
      Lesson
        │
        ▼
      Echo
        │
        ├── Personal state
        │
        └── Aggregate analytics
```

---

# 42. Media Upload Flow

Teacher creates a lesson.

Frontend requests an upload URL.

Backend verifies:

```text
Is this user the teacher of this class?
```

If yes, backend creates a secure upload mechanism.

Teacher uploads:

```text
video.mp4
```

to S3.

Then lesson metadata is updated.

Example:

```text
Lesson status:

DRAFT
```

After successful upload:

```text
DRAFT
```

Teacher chooses:

```text
Publish
```

Then:

```text
PUBLISHED
```

Students can now access it.

---

# 43. Media Processing

For V1, avoid complicated video transcoding pipelines unless necessary.

The initial target should be:

> Upload a browser-compatible video and play it through the web application.

If production media requirements later demand transcoding, we can introduce an AWS media-processing service.

But it should not be a V1 dependency unless testing proves it necessary.

---

# 44. Lesson Access

Student requests lesson.

Backend checks:

```text
Authenticated?
       ↓
Is student?
       ↓
Is student a member of this lesson's class?
       ↓
Is lesson published?
       ↓
Allow
```

Otherwise:

```text
403 Forbidden
```

This must be enforced server-side.

---

# 45. Teacher Lesson Access

Teacher requests lesson.

Backend checks:

```text
Authenticated?
       ↓
Is teacher?
       ↓
Does teacher own lesson's class?
       ↓
Allow
```

Otherwise:

```text
403 Forbidden
```

---

# 46. Echo Access

Student:

```text
CREATE
READ
UPDATE
DELETE
```

their own Echoes.

Teacher:

```text
READ
```

aggregated Echo information for lessons belonging to their classes.

A teacher should not arbitrarily modify student Echoes.

---

# 47. Analytics Strategy

Do not build a separate analytics platform in V1.

Calculate lesson-level analytics from Echo data.

For example:

```text
Total Echoes
Confused count
Important count
Insight count
Activity by time range
Hotspots
```

If performance later becomes a concern, we can introduce precomputed aggregates.

For V1, prioritize correctness and simplicity.

---

# 48. Error Handling

Production V1 must have predictable error handling.

Examples:

```text
401 Unauthorized
403 Forbidden
404 Not Found
400 Bad Request
409 Conflict
500 Internal Server Error
```

Frontend should display user-friendly messages rather than raw backend errors.

Example:

Instead of:

```text
DynamoDB ConditionalCheckFailedException
```

show:

> "You don't have permission to access this class."

---

# 49. Important Security Requirements

At minimum:

* Cognito authentication
* Server-side authorization
* Private S3 bucket
* No client-controlled ownership fields
* Input validation
* Secure upload mechanism
* Secure media delivery
* HTTPS
* Least-privilege IAM
* Secrets/configuration outside source code
* No sensitive information in frontend bundles
* Proper CORS configuration
* CloudWatch logging

---

# 50. Deployment Architecture

The application must be deployed.

Target:

```text
                    AWS
                     │
       ┌─────────────┼─────────────┐
       │             │             │
       ▼             ▼             ▼
   Cognito         S3          DynamoDB
       │             │
       │          CloudFront
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

Frontend hosting can use AWS Amplify if it provides the simplest reliable deployment path.

Amplify is therefore optional as an implementation convenience, not a fundamental application dependency.

---

# 51. Environments

Production-minded V1 should ideally have:

```text
development
production
```

At minimum, production resources should be isolated from development resources.

If project time is constrained, a single AWS environment can be used initially, but resource naming/configuration should make future separation straightforward.

---

# 52. Observability

Production V1 should use CloudWatch for:

* Lambda logs
* API errors
* Application errors
* Authentication-related diagnostics
* Important operational events

We should be able to answer:

> "Why did this API request fail?"

without manually inspecting the database.

---

# 53. V1 User Journey — Complete

## Teacher

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
Echoes Appear
   ↓
View Timeline
   ↓
Inspect Hotspots
   ↓
Add Teacher Response
```

## Student

```text
Sign Up
   ↓
Verify Email
   ↓
Sign In
   ↓
Join Class with Code
   ↓
Open Class
   ↓
See Published Lessons
   ↓
Open Lesson
   ↓
Watch Video
   ↓
Create Echo
   ↓
Add Note
   ↓
Continue Watching
   ↓
Review Echo Timeline
   ↓
Return to Difficult Moments
   ↓
Receive Revisit Reminder
   ↓
Revisit
   ↓
Mark Understanding
```

---

# 54. The V1 "Wow" Moment

The strongest demo should be:

```text
Student watches lesson
        ↓
Student marks 😕
        ↓
Several students mark the same area
        ↓
Timeline becomes a hotspot
        ↓
Teacher sees the hotspot
        ↓
Teacher adds explanation
        ↓
Student revisits the exact timestamp
        ↓
Student marks 👍 Got it
```

This single sequence demonstrates the entire product philosophy.

---

# 55. Recommended V1 Screens

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
19. Teacher Lesson Analytics
20. Hotspot Detail
21. Teacher Response

We can combine some of these into shared pages where appropriate.

---

# 56. V1 Feature Priority

## P0 — Absolutely required

* Cognito authentication
* Teacher/student roles
* Class creation
* Class membership
* Invite code
* Access control
* Lesson creation
* Video upload
* Video playback
* Lesson publishing
* Echo creation
* Timestamp capture
* Echo persistence
* Personal Echo timeline
* Collective timeline
* Basic hotspot calculation
* Teacher analytics
* Production deployment

## P1 — Important but can follow core implementation

* Teacher responses
* Revisit scheduling
* Revisit status
* Audio lessons
* Better timeline visualization
* Improved upload experience

## P2 — Future

* AI summaries
* AI misconception analysis
* AI-generated revision
* Voice notes
* PDF/slides
* Advanced analytics
* Automatic transcription
* Real-time lessons
* Notifications
* Mobile apps

---

# 57. V1 Definition of Done

EchoClass V1 is considered complete when:

### Authentication

* A new user can register.
* Email verification works.
* User can log in/out.
* Role is established securely.

### Teacher

* Teacher can create a class.
* Teacher can generate an invite code.
* Teacher can see only their classes.
* Teacher can manage students.
* Teacher can create lessons.
* Teacher can upload video.
* Teacher can publish lessons.
* Teacher can see lesson activity.

### Student

* Student can join a class.
* Student can see only their classes.
* Student can see only published lessons.
* Student can watch lessons.
* Student can create timestamped Echoes.
* Student can add notes.
* Student can see their Echo history.
* Student can revisit moments.

### Echo system

* Echoes persist.
* Echoes are associated with exact timestamps.
* Collective activity is visible.
* Hotspots are calculated.
* Teacher can inspect hotspots.

### Security

* Unauthorized users cannot access protected resources.
* Students cannot access unrelated classes.
* Teachers cannot access unrelated classes.
* S3 bucket is not publicly writable/readable.
* Backend verifies ownership/membership.

### Deployment

* Frontend is publicly accessible.
* APIs are deployed.
* Cognito is configured.
* Database is deployed.
* Media storage is deployed.
* CloudFront is configured.
* Production application works end-to-end.

---

# 58. Product Principles

Throughout development, we should follow these principles.

## 1. Build the learning loop, not a feature collection

The central loop is:

```text
Watch
→ React
→ Reflect
→ Revisit
→ Understand
```

Every feature should strengthen this.

## 2. Security is a product feature

Class isolation isn't an implementation detail.

It is fundamental to the product.

## 3. Prefer deterministic logic over unnecessary AI

If a simple algorithm works, use it.

AI should enhance the experience rather than become a dependency for basic functionality.

## 4. Production simplicity beats architectural complexity

We want:

```text
Simple
Reliable
Observable
Secure
Deployable
```

rather than:

```text
Distributed
Complicated
Over-engineered
```

## 5. Make the timeline the hero

The Echo Timeline should be the visual centerpiece of the application.

---

# 59. Future Evolution

After V1 is stable, the architecture should allow us to add:

```text
V1
Recorded lessons
+
Echo timeline
+
Hotspots
+
Revisit
        ↓
V2
AI summaries
+
AI misconception detection
+
AI revision generation
        ↓
V3
Live lessons
+
Real-time Echoes
+
Streaming
        ↓
V4
Adaptive learning
+
Personalized learning paths
```

This lets us demonstrate a believable product roadmap without contaminating V1 with unnecessary complexity.

---

# 60. Final V1 Concept

The concrete EchoClass V1 can be summarized as:

> **EchoClass is a secure classroom platform where teachers create private classes and publish recorded video lessons. Students join only the classes they're enrolled in and watch lessons through an interactive player. At any moment, students can leave a timestamped Echo — Confused, Important, or Insight — optionally with a note. These Echoes form a collective timeline that reveals high-activity learning hotspots. Teachers can inspect those hotspots and respond to difficult concepts. Students can later return to their own Echoes and receive simple spaced-revisit prompts, turning moments of confusion into a measurable learning journey.**

The core architecture is:

```text
                         ┌───────────────┐
                         │    Cognito    │
                         │ Authentication│
                         └───────┬───────┘
                                 │
                                 ▼
┌──────────────┐          ┌───────────────┐
│   Frontend   │─────────▶│  API Gateway  │
└──────┬───────┘          └───────┬───────┘
       │                          │
       │                          ▼
       │                   ┌─────────────┐
       │                   │   Lambda    │
       │                   └──────┬──────┘
       │                          │
       │                          ▼
       │                   ┌─────────────┐
       │                   │  DynamoDB   │
       │                   └─────────────┘
       │
       │
       ▼
┌──────────────┐
│  CloudFront  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Private S3   │
│ Lesson Media │
└──────────────┘
```

And the core domain model is:

```text
Teacher
   │
   ├── Class
   │     │
   │     ├── Student Memberships
   │     │
   │     └── Lessons
   │            │
   │            └── Echoes
   │                   │
   │                   └── Revisit
   │
   └── Analytics
```

**This is the V1 we should build.**

The next planning artifact should be the **system architecture/design**, where we turn this brainstorm into concrete AWS resources, DynamoDB access patterns, API endpoints, authorization rules, S3/CloudFront media flow, frontend structure, deployment strategy, and the exact end-to-end data flows.
