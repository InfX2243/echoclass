# EchoClass — DynamoDB MVP Access Patterns

This document defines the DynamoDB access patterns required by MVP-011 before indexes are created.

## Table model

EchoClass uses a single application table. Each item has a `PK` and `SK`; entity-specific attributes are stored alongside them. IDs are application-generated and Cognito `sub` is stored as the immutable external identity key.

The design favors direct `GetItem`/`Query` operations. No MVP path should require a table scan.

## Access patterns

| # | Access pattern | Key strategy | Operation |
|---|---|---|---|
| 1 | Resolve application user by Cognito `sub` | `GSI1PK = USER#SUB#<sub>` | Query, one result |
| 2 | Get class by ID | `PK = CLASS#<classId>`, `SK = META` | GetItem |
| 3 | List classes owned by teacher | `GSI1PK = TEACHER#<teacherId>`, `GSI1SK = CLASS#<classId>` | Query |
| 4 | Resolve student membership for class | `PK = CLASS#<classId>`, `SK = MEMBER#<studentId>` | GetItem |
| 5 | List classes for student | `GSI2PK = STUDENT#<studentId>`, `GSI2SK = CLASS#<classId>` | Query |
| 6 | Get lesson by ID | `PK = LESSON#<lessonId>`, `SK = META` | GetItem |
| 7 | List lessons for class | `GSI2PK = CLASS#<classId>`, `GSI2SK = LESSON#<lessonId>` | Query |
| 8 | Verify student access to published lesson | Get lesson + membership using patterns 4 and 6 | GetItem + GetItem |
| 9 | Create/list/update/delete student's Echoes for a lesson | `PK = LESSON#<lessonId>`, `SK = ECHO#<studentId>#<echoId>`; ownership checked from authenticated user | Query / Put / Update / Delete |
| 10 | List lesson activity for timeline/hotspots | Echo items under `PK = LESSON#<lessonId>` filtered by `SK` prefix `ECHO#` | Query |

## Entity layout

### User

- `PK = USER#<userId>`
- `SK = META`
- `GSI1PK = USER#SUB#<cognitoSub>`
- `GSI1SK = META`

### Class

- `PK = CLASS#<classId>`
- `SK = META`
- `GSI1PK = TEACHER#<teacherId>`
- `GSI1SK = CLASS#<classId>`

### Membership

- `PK = CLASS#<classId>`
- `SK = MEMBER#<studentId>`
- `GSI2PK = STUDENT#<studentId>`
- `GSI2SK = CLASS#<classId>`

### Lesson

- `PK = LESSON#<lessonId>`
- `SK = META`
- `GSI2PK = CLASS#<classId>`
- `GSI2SK = LESSON#<lessonId>`

### Echo

- `PK = LESSON#<lessonId>`
- `SK = ECHO#<studentId>#<echoId>`
- `studentId`, `lessonId`, timestamp and Echo metadata are stored as attributes.

## Indexes

Only two GSIs are required for the MVP access patterns:

- **GSI1** — user-by-Cognito-sub and teacher-owned-class lookup.
- **GSI2** — student-enrolled-class lookup and class-lesson listing.

The shared index attributes are intentionally overloaded by entity type; application code must always use the complete partition/sort-key prefixes documented above.

## Consistency and authorization

Authorization remains an application concern. A DynamoDB key alone does not grant access. Lambda handlers must derive the authenticated application user from the verified Cognito token and check ownership/membership before returning or mutating data.

Membership records are the source of truth for student class access. Lesson publication state is checked for student lesson reads.
