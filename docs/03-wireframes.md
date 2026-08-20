# EchoClass — Wireframes

> **Every lesson leaves a trace.**

**Version:** 1.0  
**Status:** V1 Production Wireframes  
**Product:** EchoClass  
**Related Documents:** `requirements.md`, `page-architecture.md`

---

# 1. Purpose

This document defines the V1 low-fidelity wireframes for EchoClass.

The wireframes describe:

- page structure
- information hierarchy
- primary actions
- navigation
- responsive behavior
- empty states
- loading states
- error states
- key interaction flows

These wireframes are intentionally low-fidelity.

They should define **what appears where and how users move through the product**, without prescribing final visual styling, typography, spacing tokens, or polished component design.

---

# 2. Wireframe Principles

EchoClass wireframes should follow these principles:

## 2.1 Lesson-first

The lesson player is the central student experience.

## 2.2 Timeline-first

The Echo Timeline should remain visually prominent.

## 2.3 Minimal cognitive load

Students should be able to watch, react, and continue without navigating through multiple screens.

## 2.4 Contextual actions

Actions should appear close to the content they affect.

## 2.5 Calm hierarchy

The interface should avoid dashboard clutter and excessive controls.

## 2.6 Responsive by design

Wireframes must account for:

```text
Desktop
Tablet
Mobile Web
```

---

# 3. Wireframe Legend

The following notation is used throughout this document.

```text
┌──────────────────────────────┐
│ Page region                  │
└──────────────────────────────┘

[ Button ]

[ Input field ]

──────────────
Divider

● Marker
🔥 Hotspot

→ Navigation
```

For interactive elements:

```text
[ Primary Action ]
[ Secondary Action ]
[ Destructive Action ]
```

---

# 4. Global Application Shell

## 4.1 Desktop

```text
┌─────────────────────────────────────────────────────────────────────┐
│ EchoClass                                      Profile ▼           │
├───────────────────┬─────────────────────────────────────────────────┤
│                   │                                                 │
│ Dashboard         │                                                 │
│                   │                 PAGE CONTENT                    │
│ Classes           │                                                 │
│                   │                                                 │
│ My Echoes         │                                                 │
│                   │                                                 │
│ Revisit           │                                                 │
│                   │                                                 │
│ Profile           │                                                 │
│                   │                                                 │
│                   │                                                 │
└───────────────────┴─────────────────────────────────────────────────┘
```

### Teacher navigation

```text
┌───────────────────┐
│ EchoClass         │
├───────────────────┤
│ Dashboard         │
│ My Classes        │
│ Profile           │
└───────────────────┘
```

### Student navigation

```text
┌───────────────────┐
│ EchoClass         │
├───────────────────┤
│ Dashboard         │
│ Classes           │
│ My Echoes         │
│ Revisit           │
│ Profile           │
└───────────────────┘
```

---

# 5. Mobile Application Shell

On mobile, the sidebar becomes compact navigation.

```text
┌─────────────────────────────┐
│ EchoClass             ☰    │
├─────────────────────────────┤
│                             │
│        PAGE CONTENT         │
│                             │
│                             │
└─────────────────────────────┘
```

Optional bottom navigation for students:

```text
┌─────────────────────────────┐
│                             │
│        PAGE CONTENT         │
│                             │
├─────────────────────────────┤
│ Home  Classes  Echoes  More │
└─────────────────────────────┘
```

The lesson player may use an immersive layout where navigation is minimized.

---

# 6. Authentication Wireframes

# 6.1 Sign In

```text
┌─────────────────────────────────────────┐
│                                         │
│               EchoClass                 │
│                                         │
│            Welcome back                 │
│                                         │
│ Email                                   │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Password                                │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│              [ Sign In ]                │
│                                         │
│ Don't have an account? Sign up          │
│                                         │
└─────────────────────────────────────────┘
```

### Error state

```text
┌─────────────────────────────────────────┐
│ Email                                   │
│ ┌─────────────────────────────────────┐ │
│ │ student@example.com                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Password                                │
│ ┌─────────────────────────────────────┐ │
│ │ ••••••••••••                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ⚠ We couldn't sign you in.              │
│ Check your email and password.          │
│                                         │
│              [ Sign In ]                │
└─────────────────────────────────────────┘
```

---

# 6.2 Sign Up

```text
┌─────────────────────────────────────────┐
│               EchoClass                 │
│                                         │
│             Create account              │
│                                         │
│ Name                                    │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Email                                   │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Password                                │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ I am a                                  │
│                                         │
│ [ Teacher ]      [ Student ]            │
│                                         │
│             [ Create Account ]          │
│                                         │
│ Already have an account? Sign in        │
└─────────────────────────────────────────┘
```

---

# 6.3 Email Verification

```text
┌─────────────────────────────────────────┐
│               EchoClass                 │
│                                         │
│             Check your email            │
│                                         │
│ We sent a verification code to          │
│ your email address.                     │
│                                         │
│ Verification code                       │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│            [ Verify Email ]             │
│                                         │
│ Didn't receive it?                      │
│ [ Resend Code ]                         │
│                                         │
└─────────────────────────────────────────┘
```

---

# 7. Student Dashboard

## Desktop

```text
┌─────────────────────────────────────────────────────────────┐
│ Dashboard                                                   │
│ Welcome back.                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Your Classes                                                │
│ ┌───────────────────┐ ┌───────────────────┐                │
│ │ Neural Networks   │ │ Data Structures   │                │
│ │ 4 lessons         │ │ 6 lessons         │                │
│ │ [ Open Class ]    │ │ [ Open Class ]    │                │
│ └───────────────────┘ └───────────────────┘                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Pending Revisits                              [ View All ]  │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 😕 Backpropagation                                      │ │
│ │ 31:14                                                   │ │
│ │ You marked this moment confusing.                      │ │
│ │                                          [ Revisit ]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Recent Lessons                                              │
│                                                             │
│ How Neural Networks Learn                   42 min          │
│ Activation Functions                        31 min          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Recent Echoes                                               │
│                                                             │
│ 😕 Backpropagation                         31:14             │
│ ⭐ Activation Functions                     20:18             │
│ 💡 Gradient Descent                         42:07             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 8. Student Classes

```text
┌─────────────────────────────────────────────────────────────┐
│ Classes                                      [ Join Class ] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────┐                             │
│ │ Neural Networks             │                             │
│ │ Introduction to neural      │                             │
│ │ networks                    │                             │
│ │                             │                             │
│ │ 4 lessons                   │                             │
│ │ [ Open Class ]              │                             │
│ └─────────────────────────────┘                             │
│                                                             │
│ ┌─────────────────────────────┐                             │
│ │ Data Structures             │                             │
│ │ Algorithms and structures   │                             │
│ │                             │                             │
│ │ 6 lessons                   │                             │
│ │ [ Open Class ]              │                             │
│ └─────────────────────────────┘                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 9. Join Class

```text
┌─────────────────────────────────────────────┐
│ Join a Class                                │
├─────────────────────────────────────────────┤
│                                             │
│ Enter the invite code provided by your      │
│ teacher.                                    │
│                                             │
│ Invite Code                                 │
│ ┌─────────────────────────────────────────┐ │
│ │ ML-7K4P2                                │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│              [ Join Class ]                │
│                                             │
└─────────────────────────────────────────────┘
```

### Invalid code

```text
┌─────────────────────────────────────────────┐
│ Invite Code                                 │
│ ┌─────────────────────────────────────────┐ │
│ │ ABC-123                                 │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ⚠ We couldn't find an active class for     │
│ this invite code.                          │
│                                             │
│              [ Try Again ]                 │
└─────────────────────────────────────────────┘
```

### Already enrolled

```text
This class is already in your classes.
```

---

# 10. Student Class Page

```text
┌─────────────────────────────────────────────────────────────┐
│ ← Classes                                                   │
│                                                             │
│ Neural Networks                                             │
│ Introduction to neural networks                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Lessons                                                     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ How Neural Networks Learn                              │ │
│ │ 42 minutes                                             │ │
│ │ Published                                              │ │
│ │                                      [ Open Lesson ]   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Activation Functions                                   │ │
│ │ 31 minutes                                             │ │
│ │ Published                                              │ │
│ │                                      [ Open Lesson ]   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 11. Student Lesson Player

This is the primary EchoClass wireframe.

## Desktop

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Neural Networks                                      Lesson           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ How Neural Networks Learn                                              │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                                                                     │ │
│ │                                                                     │ │
│ │                         VIDEO PLAYER                                │ │
│ │                                                                     │ │
│ │                                                                     │ │
│ │                                                                     │ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │ ▶  31:14 ──────────────────────────────── 42:17   🔊   ⛶           │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ What do you think about this moment?                                   │
│                                                                         │
│       [ 😕 Confused ]  [ ⭐ Important ]  [ 💡 Insight ]                │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ Echo Timeline                                                           │
│                                                                         │
│ 00:00 ─────────●──────────────🔥🔥🔥🔥──────────────●───────── 42:17     │
│                ↑                         ↑                              │
│             Echo                    Hotspot                            │
│                                                                         │
│ Activity                                                                │
│ ─────────────────────────────────────────────────────────────────────── │
│                                                                         │
│ Selected Moment                                                         │
│                                                                         │
│ 31:14                                                                   │
│                                                                         │
│ High Activity                                                           │
│                                                                         │
│ 12 students interacted here.                                           │
│                                                                         │
│ Confused: 8    Important: 3    Insight: 4                              │
│                                                                         │
│ Teacher Response                                                       │
│ "The important idea here is that backpropagation..."                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 12. Lesson Player — Initial State

Before any timeline selection:

```text
┌─────────────────────────────────────────────────────────────┐
│ How Neural Networks Learn                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                  ┌─────────────────────┐                    │
│                  │                     │                    │
│                  │       VIDEO         │                    │
│                  │                     │                    │
│                  └─────────────────────┘                    │
│                                                             │
│                         00:00                               │
│                                                             │
│      [ 😕 Confused ] [ ⭐ Important ] [ 💡 Insight ]       │
│                                                             │
│ Echo Timeline                                               │
│ ────────────────────────────────────────────────────────── │
│                                                             │
│ Select a moment on the timeline to explore activity.        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 13. Echo Creation

After selecting an Echo type:

```text
┌──────────────────────────────────────────────────────┐
│ Add an Echo                                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 😕 Confused                                          │
│                                                      │
│ Timestamp                                            │
│ 31:14                                                │
│                                                      │
│ Optional note                                        │
│ ┌──────────────────────────────────────────────────┐ │
│ │ What was confusing?                             │ │
│ │                                                  │ │
│ │                                                  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ 0 / 2000 characters                                  │
│                                                      │
│                  [ Cancel ] [ Save Echo ]            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

The timestamp is displayed for confirmation but should not be editable in V1.

---

# 14. Echo Saved State

After saving:

```text
┌──────────────────────────────────────────────────────┐
│ ✓ Echo saved                                          │
│                                                      │
│ 😕 Confused · 31:14                                  │
│                                                      │
│ Your Echo has been added to the timeline.            │
└──────────────────────────────────────────────────────┘
```

The timeline should immediately display the new personal marker.

---

# 15. Timeline — Personal Echo

```text
00:00 ─────────●─────────────────────────────── 42:17
               │
               └── 😕 Your Echo
                   31:14
```

The marker should clearly distinguish the student's own Echo from aggregate activity.

---

# 16. Timeline — Collective Activity

```text
00:00 ────────────────●────────██████────────●──── 42:17
                                  ▲
                                  │
                             High Activity
```

Activity intensity should be represented visually without requiring exact individual student identities.

---

# 17. Timeline — Hotspot

```text
31:00                 32:00                 34:00
  │                     │                     │
  ├─────────────────────🔥🔥🔥🔥🔥─────────────┤
                        Hotspot
```

Selecting the hotspot opens contextual details.

---

# 18. Hotspot Detail

## Desktop Side Panel

```text
┌───────────────────────────────────────┐
│ High Activity                         │
│                                       │
│ 31:14 – 34:02                         │
│                                       │
│ 17 Echoes                             │
│ 12 students participated              │
│                                       │
│ ───────────────────────────────────── │
│                                       │
│ 😕 Confused                 8         │
│ ⭐ Important                4         │
│ 💡 Insight                  5         │
│                                       │
│ ───────────────────────────────────── │
│                                       │
│ Teacher Response                      │
│                                       │
│ The important idea here is that       │
│ backpropagation applies the chain     │
│ rule...                               │
│                                       │
│ [ Jump to 31:14 ]                     │
│                                       │
└───────────────────────────────────────┘
```

---

# 19. Hotspot Detail — No Teacher Response

```text
┌───────────────────────────────────────┐
│ High Activity                         │
│                                       │
│ 31:14 – 34:02                         │
│                                       │
│ 😕 Confused        8                  │
│ ⭐ Important       4                  │
│ 💡 Insight         5                  │
│                                       │
│ No teacher response yet.              │
│                                       │
│ [ Jump to 31:14 ]                     │
└───────────────────────────────────────┘
```

For students, no teacher-response creation action should be shown.

---

# 20. Teacher Dashboard

```text
┌─────────────────────────────────────────────────────────────┐
│ Dashboard                                                   │
│ Welcome back.                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ My Classes                              [ Create Class ]    │
│                                                             │
│ ┌──────────────────────┐ ┌──────────────────────┐          │
│ │ Neural Networks      │ │ Data Structures      │          │
│ │ 37 students          │ │ 28 students          │          │
│ │ 4 lessons            │ │ 6 lessons            │          │
│ │ [ Open Class ]       │ │ [ Open Class ]       │          │
│ └──────────────────────┘ └──────────────────────┘          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Recent Activity                                             │
│                                                             │
│ How Neural Networks Learn                                  │
│ 29 / 37 students participated                              │
│                                                             │
│ Top hotspot: 31:14 – 34:02                                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Recent Hotspots                                             │
│                                                             │
│ 🔥 How Neural Networks Learn                               │
│    31:14 – 34:02                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 21. Teacher Classes

```text
┌─────────────────────────────────────────────────────────────┐
│ My Classes                                  [ Create Class ]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Neural Networks                                        │ │
│ │ Introduction to neural networks                        │ │
│ │                                                         │ │
│ │ 37 students · 4 lessons                               │ │
│ │                                                         │ │
│ │ [ Open ] [ Invite Code ]                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Data Structures                                        │ │
│ │                                                         │ │
│ │ 28 students · 6 lessons                               │ │
│ │                                                         │ │
│ │ [ Open ] [ Invite Code ]                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 22. Create Class

```text
┌──────────────────────────────────────────────────────┐
│ Create Class                                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Class Name                                           │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Neural Networks                                  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ Description                                          │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Introduction to neural networks                  │ │
│ │                                                  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│               [ Cancel ] [ Create Class ]            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# 23. Teacher Class Page

```text
┌─────────────────────────────────────────────────────────────┐
│ ← My Classes                                                │
│                                                             │
│ Neural Networks                              [ Edit Class ] │
│ Introduction to neural networks                            │
│                                                             │
│ [ Generate Invite Code ]                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 37 Students                     4 Lessons                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Lessons                                      [ Create Lesson ]│
│                                                             │
│ How Neural Networks Learn                                   │
│ Published · 42 min                         [ Analytics ]    │
│                                                             │
│ Activation Functions                                        │
│ Draft · 31 min                              [ Edit ]        │
│                                                             │
│ Backpropagation                                             │
│ Published · 28 min                         [ Analytics ]    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Students                                    [ View All ]    │
│ 37 active students                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 24. Invite Code

```text
┌─────────────────────────────────────────────┐
│ Class Invite Code                           │
├─────────────────────────────────────────────┤
│                                             │
│ Share this code with your students.         │
│                                             │
│              ML-7K4P2                       │
│                                             │
│        [ Copy Code ]                        │
│                                             │
│ Students can use this code to join the     │
│ class.                                      │
│                                             │
└─────────────────────────────────────────────┘
```

The actual code should be generated and validated by the backend.

---

# 25. Student Management

```text
┌─────────────────────────────────────────────────────────────┐
│ ← Neural Networks                                           │
│ Students                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 37 active students                                         │
│                                                             │
│ Search students                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Search...                                               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Alex Morgan                              Active             │
│                                             [ Remove ]      │
│                                                             │
│ Sam Lee                                   Active             │
│                                             [ Remove ]      │
│                                                             │
│ Taylor Chen                               Active             │
│                                             [ Remove ]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 26. Create Lesson

## Step 1 — Lesson Information

```text
┌─────────────────────────────────────────────────────────────┐
│ Create Lesson                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Lesson title                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ How Neural Networks Learn                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Description                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Introduction to neural network learning.               │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Content type                                                │
│                                                             │
│ (●) Video                                                  │
│                                                             │
│                              [ Continue ]                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 27. Lesson Upload

```text
┌─────────────────────────────────────────────────────────────┐
│ Upload Lesson Video                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │              Drag and drop video here                  │ │
│ │                                                         │ │
│ │                    or                                   │ │
│ │                                                         │ │
│ │                [ Select Video ]                         │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Supported content type: Video                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 28. Upload Progress

```text
┌─────────────────────────────────────────────────────────────┐
│ Uploading                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ How Neural Networks Learn.mp4                              │
│                                                             │
│ ████████████████████░░░░░  82%                             │
│                                                             │
│ Uploading directly to secure media storage.                │
│                                                             │
│                         [ Cancel ]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

The UI should make clear that the upload is in progress without exposing infrastructure details.

---

# 29. Lesson Ready

```text
┌─────────────────────────────────────────────────────────────┐
│ Lesson Ready                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ How Neural Networks Learn                                  │
│                                                             │
│ Video                                                       │
│ 42:17                                                       │
│                                                             │
│ Status                                                      │
│ Draft                                                       │
│                                                             │
│ [ Save Draft ]                         [ Publish Lesson ]   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 30. Lesson Analytics

```text
┌─────────────────────────────────────────────────────────────┐
│ ← Neural Networks                                           │
│ How Neural Networks Learn                                  │
│                                                             │
│ [ Lesson ] [ Analytics ]                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Participation                                               │
│                                                             │
│ 29 / 37 students participated                              │
│                                                             │
├──────────────────────┬──────────────────────────────────────┤
│ Echoes               │                                      │
│                      │                                      │
│ 😕 32                │                                      │
│ ⭐ 21                │        Activity Timeline             │
│ 💡 17                │                                      │
│                      │ 00:00 ───🔥────●──────🔥──── 42:17  │
│ Total: 70            │                                      │
│                      │                                      │
└──────────────────────┴──────────────────────────────────────┘
```

---

# 31. Teacher Analytics — Hotspot List

```text
┌─────────────────────────────────────────────────────────────┐
│ Hotspots                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔥 31:14 – 34:02                                       │ │
│ │                                                         │ │
│ │ High Activity                                           │ │
│ │                                                         │ │
│ │ Confused     8                                         │ │
│ │ Important    4                                         │ │
│ │ Insight      3                                         │ │
│ │                                                         │ │
│ │ 12 students participated                               │ │
│ │                                                         │ │
│ │ [ Inspect ]                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔥 42:07 – 43:15                                       │ │
│ │                                                         │ │
│ │ Confused     2                                         │ │
│ │ Important    7                                         │ │
│ │ Insight      4                                         │ │
│ │                                                         │
│ │ [ Inspect ]                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 32. Teacher Hotspot Inspection

```text
┌─────────────────────────────────────────────────────────────┐
│ Hotspot: 31:14 – 34:02                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ High Activity                                               │
│                                                             │
│ 12 students participated                                  │
│                                                             │
│ 😕 Confused                         8                       │
│ ⭐ Important                        4                       │
│ 💡 Insight                          3                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Teacher Response                                            │
│                                                             │
│ No response yet.                                            │
│                                                             │
│              [ Add Teacher Response ]                       │
│                                                             │
│                              [ Open Lesson ]                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 33. Add Teacher Response

```text
┌──────────────────────────────────────────────────────┐
│ Add Teacher Response                                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Timestamp                                            │
│ 31:14                                                │
│                                                      │
│ Response                                             │
│ ┌──────────────────────────────────────────────────┐ │
│ │ The important idea here is that                 │ │
│ │ backpropagation applies the chain rule...        │ │
│ │                                                  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│                 [ Cancel ] [ Save Response ]          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# 34. Teacher Response — Existing

```text
┌─────────────────────────────────────────────────────────┐
│ Teacher Response · 31:14                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ "The important idea here is that backpropagation       │
│ applies the chain rule to determine how each weight    │
│ contributed to the final error."                       │
│                                                         │
│ Created today                                           │
│                                                         │
│ [ Edit ]                                                │
└─────────────────────────────────────────────────────────┘
```

---

# 35. My Echoes

```text
┌─────────────────────────────────────────────────────────────┐
│ My Echoes                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Filter: [ All Types ▼ ]                                    │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 😕 Confused                                             │ │
│ │ Backpropagation                                         │ │
│ │ How Neural Networks Learn                              │ │
│ │ 31:14 · 3 days ago                                     │ │
│ │                                      [ Open Lesson ]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⭐ Important                                            │ │
│ │ Activation Functions                                    │ │
│ │ 20:18 · 5 days ago                                     │ │
│ │                                      [ Open Lesson ]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 💡 Insight                                              │ │
│ │ Gradient Descent                                        │ │
│ │ 42:07 · 7 days ago                                     │ │
│ │                                      [ Open Lesson ]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 36. Echo Detail / Edit

```text
┌──────────────────────────────────────────────────────┐
│ Edit Echo                                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Timestamp                                            │
│ 31:14                                                │
│                                                      │
│ Echo Type                                            │
│                                                      │
│ [ 😕 Confused ] [ ⭐ Important ] [ 💡 Insight ]      │
│                                                      │
│ Note                                                 │
│ ┌──────────────────────────────────────────────────┐ │
│ │ I still don't understand how the gradient       │ │
│ │ moves backwards.                                │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ [ Cancel ] [ Save Changes ]                          │
│                                                      │
│ [ Delete Echo ]                                      │
└──────────────────────────────────────────────────────┘
```

---

# 37. Delete Echo Confirmation

```text
┌──────────────────────────────────────────────┐
│ Delete this Echo?                            │
├──────────────────────────────────────────────┤
│                                              │
│ This will permanently remove your Echo.      │
│                                              │
│ [ Cancel ]                [ Delete Echo ]    │
│                                              │
└──────────────────────────────────────────────┘
```

---

# 38. Revisit Page

```text
┌─────────────────────────────────────────────────────────────┐
│ Revisit                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Due Today                                                   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 😕 Backpropagation                                     │ │
│ │                                                         │ │
│ │ How Neural Networks Learn                              │ │
│ │ 31:14                                                   │ │
│ │                                                         │ │
│ │ You marked this moment confusing 3 days ago.           │ │
│ │                                                         │ │
│ │ [ Revisit ]                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Upcoming                                                    │
│                                                             │
│ ⭐ Activation Functions                                    │
│ Tomorrow · 20:18                                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Completed                                                   │
│                                                             │
│ 💡 Gradient Descent                                        │
│ Completed · 42:07                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 39. Revisit Lesson State

When a revisit opens the lesson:

```text
┌─────────────────────────────────────────────────────────────┐
│ Revisit                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ You marked this moment confusing 3 days ago.               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │                     VIDEO PLAYER                       │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ 31:14                                                       │
│                                                             │
│ Your Echo                                                  │
│ 😕 Confused                                                │
│ "I don't understand how the gradient gets propagated."    │
│                                                             │
│ Teacher Response                                           │
│ "The important idea here is..."                            │
│                                                             │
│ Do you understand this now?                                │
│                                                             │
│ [ Still Confused ]                 [ Got It ]              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 40. Revisit Completed

```text
┌──────────────────────────────────────────────────────┐
│                                                      │
│                    ✓                                 │
│                                                      │
│                 Nice work.                           │
│                                                      │
│          You've revisited this moment.              │
│                                                      │
│               [ Back to Revisit ]                   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# 41. Profile

```text
┌─────────────────────────────────────────────────────────────┐
│ Profile                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Personal Information                                       │
│                                                             │
│ Name                                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Alex Morgan                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Email                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ alex@example.com                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Role                                                        │
│ Student                                                     │
│                                                             │
│ [ Save Changes ]                                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Security                                                    │
│                                                             │
│ [ Sign Out ]                                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 42. Teacher Lesson List

```text
┌─────────────────────────────────────────────────────────────┐
│ Lessons                                      [ Create Lesson ]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Search lessons                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Search...                                               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ How Neural Networks Learn                                  │
│ Published · 42 min                                         │
│ [ Open ] [ Analytics ] [ Edit ]                            │
│                                                             │
│ Activation Functions                                        │
│ Draft · 31 min                                             │
│ [ Open ] [ Edit ] [ Publish ]                              │
│                                                             │
│ Backpropagation                                             │
│ Published · 28 min                                         │
│ [ Open ] [ Analytics ] [ Edit ]                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 43. Lesson Status States

## Draft

```text
[ Draft ]
```

Actions:

```text
Edit
Upload
Publish
Archive
```

## Published

```text
[ Published ]
```

Actions:

```text
Open
Analytics
Edit
Unpublish
Archive
```

## Archived

```text
[ Archived ]
```

The lesson should not appear in the student's published lesson list.

---

# 44. Class Archived State

```text
┌─────────────────────────────────────────────────────────────┐
│ Neural Networks                                             │
│                                                             │
│ [ Archived ]                                                │
│                                                             │
│ This class is archived and is no longer active.            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Archived classes should not appear in active class lists.

---

# 45. Loading Wireframe — Dashboard

```text
┌─────────────────────────────────────────────────────────────┐
│ Dashboard                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ████████████████████                                       │
│                                                             │
│ ┌──────────────────────┐ ┌──────────────────────┐          │
│ │ ███████████████      │ │ ███████████████      │          │
│ │ █████████            │ │ █████████            │          │
│ │ █████                │ │ █████                │          │
│ └──────────────────────┘ └──────────────────────┘          │
│                                                             │
│ █████████████████████████████████████                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Skeleton states should preserve the final page layout.

---

# 46. Loading Wireframe — Lesson

```text
┌─────────────────────────────────────────────────────────────┐
│ █████████████████████                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │                     Loading video...                    │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [ █████████ ] [ █████████ ] [ █████████ ]                  │
│                                                             │
│ ████████████████████████████████████████████████████████  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 47. Empty State — No Classes

```text
┌─────────────────────────────────────────────────────────────┐
│ Classes                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                         ○                                   │
│                                                             │
│                  No classes yet                             │
│                                                             │
│ Join a class using an invite code from your teacher.        │
│                                                             │
│                     [ Join Class ]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 48. Empty State — No Echoes

```text
┌─────────────────────────────────────────────────────────────┐
│ My Echoes                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                         💡                                  │
│                                                             │
│                  No Echoes yet                              │
│                                                             │
│ When something feels confusing, important, or insightful,   │
│ leave an Echo while watching a lesson.                      │
│                                                             │
│                     [ View Classes ]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 49. Empty State — No Revisits

```text
┌─────────────────────────────────────────────────────────────┐
│ Revisit                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                         ✓                                   │
│                                                             │
│                  Nothing to revisit                         │
│                                                             │
│ When you mark a moment confusing, EchoClass will help       │
│ you return to it later.                                     │
│                                                             │
│                     [ View Lessons ]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 50. Error — Unauthorized

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                     Access unavailable                      │
│                                                             │
│ You don't have permission to access this resource.          │
│                                                             │
│                  [ Back to Dashboard ]                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 51. Error — Resource Not Found

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                 We couldn't find that.                      │
│                                                             │
│ The resource may have been removed or may no longer         │
│ be available.                                               │
│                                                             │
│                  [ Back to Dashboard ]                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 52. Error — Generic

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                  Something went wrong.                      │
│                                                             │
│ We couldn't complete that action.                            │
│                                                             │
│          [ Try Again ]    [ Dashboard ]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 53. Mobile Student Dashboard

```text
┌─────────────────────────────┐
│ EchoClass             ☰    │
├─────────────────────────────┤
│ Dashboard                   │
│                             │
│ Welcome back.               │
│                             │
│ Your Classes                │
│                             │
│ ┌─────────────────────────┐ │
│ │ Neural Networks         │ │
│ │ 4 lessons               │ │
│ │ [ Open ]                │ │
│ └─────────────────────────┘ │
│                             │
│ Pending Revisit             │
│                             │
│ ┌─────────────────────────┐ │
│ │ 😕 Backpropagation      │ │
│ │ 31:14                   │ │
│ │ [ Revisit ]             │ │
│ └─────────────────────────┘ │
│                             │
│ Recent Echoes               │
│ 😕 Backpropagation          │
│ ⭐ Activation Functions     │
│                             │
├─────────────────────────────┤
│ Home Classes Echoes More    │
└─────────────────────────────┘
```

---

# 54. Mobile Teacher Dashboard

```text
┌─────────────────────────────┐
│ EchoClass             ☰    │
├─────────────────────────────┤
│ Dashboard                   │
│                             │
│ My Classes                  │
│                             │
│ ┌─────────────────────────┐ │
│ │ Neural Networks         │ │
│ │ 37 students             │ │
│ │ 4 lessons               │ │
│ │ [ Open ]                │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Data Structures         │ │
│ │ 28 students             │ │
│ │ 6 lessons               │ │
│ │ [ Open ]                │ │
│ └─────────────────────────┘ │
│                             │
│ Recent Activity             │
│                             │
│ 🔥 31:14 – 34:02           │
│ How Neural Networks Learn  │
│                             │
└─────────────────────────────┘
```

---

# 55. Mobile Lesson Player

The lesson player is the most important mobile wireframe.

```text
┌─────────────────────────────┐
│ ← How Neural Networks Learn │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │        VIDEO            │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ 31:14                       │
│                             │
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │  😕  │ │  ⭐  │ │  💡  │ │
│ │Conf. │ │Imp.  │ │Ins.  │ │
│ └──────┘ └──────┘ └──────┘ │
│                             │
│ Echo Timeline               │
│                             │
│ 00:00 ──●──🔥🔥🔥──●──42:17 │
│                             │
│ High Activity               │
│ 31:14                       │
│                             │
│ 12 students interacted     │
│                             │
│ Confused 8                  │
│ Important 3                 │
│ Insight 4                   │
│                             │
│ Teacher Response            │
│ The important idea here...  │
│                             │
└─────────────────────────────┘
```

---

# 56. Mobile Echo Composer

```text
┌─────────────────────────────┐
│ Add Echo                    │
├─────────────────────────────┤
│                             │
│ 😕 Confused                 │
│                             │
│ Timestamp                  │
│ 31:14                       │
│                             │
│ Note                        │
│ ┌─────────────────────────┐ │
│ │ Optional note...        │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ [ Save Echo ]               │
│                             │
└─────────────────────────────┘
```

This may appear as a bottom sheet on mobile.

---

# 57. Mobile Hotspot Detail

```text
┌─────────────────────────────┐
│ High Activity          ×    │
├─────────────────────────────┤
│                             │
│ 31:14 – 34:02               │
│                             │
│ 12 students participated    │
│                             │
│ 😕 Confused          8      │
│ ⭐ Important         4      │
│ 💡 Insight           5      │
│                             │
│ Teacher Response            │
│                             │
│ The important idea here     │
│ is that backpropagation...  │
│                             │
│ [ Jump to 31:14 ]           │
│                             │
└─────────────────────────────┘
```

---

# 58. Core Interaction — Student Echo

```text
Student watching video
        │
        ▼
Current timestamp = 31:14
        │
        ▼
Student taps 😕
        │
        ▼
Echo Composer
        │
        ├── Type = CONFUSED
        ├── Timestamp = 31:14
        └── Optional note
        │
        ▼
Save Echo
        │
        ▼
Timeline updates
        │
        ▼
Student continues watching
```

---

# 59. Core Interaction — Collective Hotspot

```text
Student A ──😕──┐
Student B ──⭐──┤
Student C ──😕──┤
Student D ──💡──┤
Student E ──😕──┤
                ▼
        Lesson activity
                │
                ▼
          Timeline bucket
                │
                ▼
        High activity region
                │
                ▼
             Hotspot
```

---

# 60. Core Interaction — Teacher Investigation

```text
Teacher Dashboard
        ↓
Class
        ↓
Lesson
        ↓
Analytics
        ↓
Hotspot
        ↓
Inspect breakdown
        ↓
Understand activity
        ↓
Add response
```

---

# 61. Core Interaction — Revisit

```text
CONFUSED Echo
      │
      ▼
+1 day revisit
      │
      ▼
+3 day revisit
      │
      ▼
+7 day revisit
      │
      ▼
Student opens revisit
      │
      ▼
Lesson opens at timestamp
      │
      ▼
Student reviews moment
      │
      ▼
Still Confused / Got It
```

---

# 62. Primary Wow Moment

The wireframes must support the following sequence with minimal friction:

```text
┌──────────────────────────────────────────────────────────────┐
│ Student watches lesson                                      │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
                         taps 😕 Confused
                               │
                               ▼
                    Echo appears on timeline
                               │
                               ▼
                 Other students Echo nearby
                               │
                               ▼
                     Timeline develops
                         a hotspot
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Teacher sees hotspot                                        │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
                      Teacher investigates
                               │
                               ▼
                  Teacher adds explanation
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Student revisits exact timestamp                            │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
                         Student taps
                           "Got It"
```

---

# 63. Information Hierarchy

The visual hierarchy should generally follow:

## Student Lesson

```text
1. Lesson title
2. Video
3. Echo controls
4. Timeline
5. Selected moment
6. Collective activity
7. Teacher response
```

## Teacher Analytics

```text
1. Lesson
2. Participation
3. Echo breakdown
4. Timeline
5. Hotspots
6. Hotspot details
7. Teacher response
```

## Student Dashboard

```text
1. Pending revisits
2. Classes
3. Recent lessons
4. Recent Echoes
```

## Teacher Dashboard

```text
1. Classes
2. Recent activity
3. Recent hotspots
```

---

# 64. Privacy Wireframes

Student collective activity should look like:

```text
┌─────────────────────────────────────────────┐
│ High Activity                               │
│                                             │
│ 12 students interacted here.               │
│                                             │
│ 😕 Confused       8                         │
│ ⭐ Important      3                         │
│ 💡 Insight        4                         │
└─────────────────────────────────────────────┘
```

It should not look like:

```text
Alex Morgan       😕
Sam Lee           ⭐
Taylor Chen       😕
```

Student names and private notes should not be displayed alongside collective activity.

---

# 65. Accessibility Wireframe Requirements

Every wireframe interaction must have an accessible equivalent.

For example:

```text
😕 Confused
```

must have an accessible label:

```text
"Confused — leave an Echo"
```

The timeline must not rely solely on color.

Example:

```text
🔥 Hotspot
High Activity
31:14 – 34:02
```

is preferable to using only an orange highlighted region.

---

# 66. Responsive Behavior Rules

## Desktop

```text
Sidebar
+
Wide content
+
Timeline below player
```

## Tablet

```text
Collapsible navigation
+
Full-width lesson content
+
Timeline below player
```

## Mobile

```text
Compact navigation
+
Video
+
Echo controls
+
Timeline
+
Context panel
```

The core Echo interaction must remain accessible at all breakpoints.

---

# 67. Component Interaction Rules

## Echo Button

```text
Idle
 ↓
Hover / Focus
 ↓
Selected
 ↓
Echo Composer
 ↓
Saved
```

## Timeline Marker

```text
Idle
 ↓
Hover / Focus
 ↓
Selected
 ↓
Player seeks
 ↓
Context shown
```

## Hotspot

```text
Idle
 ↓
Hover / Focus
 ↓
Selected
 ↓
Hotspot detail
 ↓
Jump to timestamp
```

## Revisit

```text
Pending
 ↓
Open
 ↓
Review
 ↓
Still Confused / Got It
 ↓
Completed
```

---

# 68. Form Validation Wireframes

Validation should appear near the relevant field.

Example:

```text
Lesson title

┌──────────────────────────────────────────┐
│                                          │
└──────────────────────────────────────────┘

⚠ Lesson title is required.
```

Echo note:

```text
Note

┌──────────────────────────────────────────┐
│ ...                                      │
└──────────────────────────────────────────┘

1,999 / 2,000 characters
```

At the limit:

```text
2,000 / 2,000 characters
```

If exceeded:

```text
⚠ Note must be 2,000 characters or fewer.
```

---

# 69. Confirmation Patterns

Use confirmation dialogs for destructive actions.

Use inline feedback for successful non-destructive actions.

### Destructive

```text
[ Delete Echo ]
       ↓
Confirmation Dialog
```

### Non-destructive

```text
[ Save Echo ]
       ↓
✓ Echo saved
```

---

# 70. Navigation Patterns

The following navigation patterns should be consistent.

### Back navigation

```text
← Neural Networks
```

### Resource navigation

```text
Classes
   ↓
Neural Networks
   ↓
How Neural Networks Learn
```

### Contextual navigation

```text
Analytics
   ↓
Hotspot
   ↓
[ Open Lesson ]
```

---

# 71. No-Data Versus Error States

The UI must distinguish:

```text
No data
```

from:

```text
Failed to load data
```

### No data

```text
No Echoes yet.
```

### Error

```text
We couldn't load your Echoes.
[ Try Again ]
```

Do not present a failed request as an empty state.

---

# 72. Upload Failure

```text
┌─────────────────────────────────────────────────────────────┐
│ Upload failed                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ We couldn't upload your lesson video.                       │
│                                                             │
│ Your lesson is still saved as a draft.                      │
│                                                             │
│ [ Try Again ]                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

The user should not lose lesson metadata because an upload failed.

---

# 73. Publish Confirmation

Publishing is a meaningful state transition.

```text
┌──────────────────────────────────────────────┐
│ Publish this lesson?                        │
├──────────────────────────────────────────────┤
│                                              │
│ Students in this class will be able to      │
│ watch this lesson after it is published.    │
│                                              │
│ [ Cancel ]                [ Publish ]        │
└──────────────────────────────────────────────┘
```

---

# 74. Unpublish Confirmation

```text
┌──────────────────────────────────────────────┐
│ Unpublish this lesson?                      │
├──────────────────────────────────────────────┤
│                                              │
│ Students will no longer be able to open     │
│ this lesson while it is unpublished.        │
│                                              │
│ [ Cancel ]                [ Unpublish ]      │
└──────────────────────────────────────────────┘
```

---

# 75. Archive Confirmation

```text
┌──────────────────────────────────────────────┐
│ Archive this class?                        │
├──────────────────────────────────────────────┤
│                                              │
│ This class will no longer appear as active. │
│                                              │
│ [ Cancel ]                [ Archive ]        │
└──────────────────────────────────────────────┘
```

---

# 76. Teacher Lesson State Machine

```text
              Create
                │
                ▼
             DRAFT
             /   \
            /     \
       Upload     Edit
          │         │
          └────┬────┘
               │
               ▼
           PUBLISH
               │
               ▼
           PUBLISHED
           /       \
          /         \
    Unpublish       Archive
       │              │
       ▼              ▼
     DRAFT         ARCHIVED
```

The wireframes should clearly communicate the current state.

---

# 77. Class State Machine

```text
Create
  │
  ▼
ACTIVE
  │
  │ Archive
  ▼
ARCHIVED
```

Archived classes should have reduced active actions.

---

# 78. Revisit State Machine

```text
Created
   │
   ▼
PENDING
   │
   │ Student revisits
   ▼
Reviewing
   │
   ├───────────────┐
   │               │
Still Confused   Got It
   │               │
   ▼               ▼
PENDING         COMPLETED
```

The underlying V1 persisted statuses remain:

```text
PENDING
COMPLETED
```

`Reviewing` is a UI state, not necessarily a database state.

---

# 79. Echo State

```text
Create
  │
  ▼
Saved
  │
  ├── Edit
  │
  └── Delete
```

Echoes do not need a complex lifecycle in V1.

---

# 80. Final Wireframe Map

```text
AUTH
│
├── Sign In
├── Sign Up
└── Verify Email
        │
        ▼
     DASHBOARD
        │
        ├─────────────────────────────┐
        │                             │
     STUDENT                       TEACHER
        │                             │
        ├── Classes                   ├── My Classes
        │     │                       │     │
        │     ├── Join                │     ├── Class
        │     │                       │     │    ├── Students
        │     └── Class               │     │    ├── Lessons
        │          │                  │     │    │    ├── Create
        │          └── Lesson         │     │    │    ├── Edit
        │               │             │     │    │    ├── Upload
        │               ├── Video     │     │    │    └── Analytics
        │               ├── Echo      │     │    │         │
        │               ├── Timeline  │     │    │         ├── Hotspot
        │               └── Revisit  │     │    │         └── Response
        │                             │     │    └── Settings
        ├── My Echoes                 │     │
        │     └── Lesson timestamp    │     └── Profile
        │                             │
        ├── Revisit                   │
        │     └── Lesson timestamp    │
        │                             │
        └── Profile                   │
                                      │
                                      └── Profile
```

---

# 81. Final Product Experience

The wireframes should make EchoClass feel like:

```text
A calm digital notebook
          +
A recorded lesson
          +
A collective learning trace
```

The most important screen remains:

```text
┌──────────────────────────────────────────┐
│ Lesson                                   │
│                                          │
│              Video                       │
│                                          │
│ 😕        ⭐        💡                   │
│                                          │
│ Echo Timeline                            │
│ ───────●──────🔥🔥🔥──────●───────────── │
│                                          │
│ High Activity                            │
│                                          │
│ Confused: 8                              │
│ Important: 4                             │
│ Insight: 3                               │
│                                          │
│ Teacher Response                         │
│ "The important idea here..."             │
└──────────────────────────────────────────┘
```

This screen should communicate the product's core value immediately:

> **A lesson is no longer just a video. It becomes a learning trace.**

---

# 82. Wireframe Definition of Done

- [ ] Authentication screens are defined.
- [ ] Student dashboard is defined.
- [ ] Teacher dashboard is defined.
- [ ] Student class experience is defined.
- [ ] Teacher class management is defined.
- [ ] Join-class flow is defined.
- [ ] Lesson creation is defined.
- [ ] Lesson upload is defined.
- [ ] Lesson publishing states are defined.
- [ ] Student lesson player is defined.
- [ ] Echo creation is defined.
- [ ] Echo editing and deletion are defined.
- [ ] Echo Timeline is defined.
- [ ] Collective activity is defined.
- [ ] Hotspot detail is defined.
- [ ] Teacher analytics is defined.
- [ ] Teacher response is defined.
- [ ] My Echoes is defined.
- [ ] Revisit experience is defined.
- [ ] Revisit completion is defined.
- [ ] Profile is defined.
- [ ] Loading states are defined.
- [ ] Empty states are defined.
- [ ] Error states are defined.
- [ ] Mobile layouts are defined.
- [ ] Accessibility considerations are defined.
- [ ] Primary student and teacher journeys are represented.
- [ ] The core Echo → Hotspot → Response → Revisit loop is represented.

---

# 83. Final Principle

The wireframes should always reinforce the central EchoClass experience:

```text
Watch
  ↓
React
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

> **Every lesson leaves a trace.**
