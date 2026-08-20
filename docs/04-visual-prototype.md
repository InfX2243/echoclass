# EchoClass — Visual Prototype

> **Every lesson leaves a trace.**

## 1. Visual Direction

EchoClass should feel like a **calm digital academic notebook** rather than a generic SaaS dashboard. The visual language combines:

- Clean academic structure
- Warm analog character
- Focused digital learning tools
- Quiet, reflective feedback

Avoid excessive gradients, noisy analytics, gamification-heavy UI, and decorative motion.

## 2. Core Visual Identity

### Structural color
- **Deep Ink Navy:** `#1B2A4A`
- Use for navigation, headings, primary text, and major structure.

### Important / attention
- **Warm Amber:** `#F4A14B`
- Use for `IMPORTANT` Echoes, active attention states, and selected timeline emphasis.

### Understanding / success
- **Understanding Green:** `#5CB88A`
- Use for `INSIGHT`, successful revisit completion, and “Got it” states.

### Surface
- **Chalk White:** `#E8F0F7`
- Use for calm backgrounds, cards, and learning surfaces.

Echo types must always be distinguishable through icon + label + color:
- 😕 Confused
- ⭐ Important
- 💡 Insight

## 3. Typography and Layout

Use a readable modern sans-serif with strong hierarchy and generous whitespace.

Suggested layout:
- Desktop: persistent sidebar + top header + constrained content area
- Tablet: collapsible navigation
- Mobile: compact header/navigation
- Lesson page: immersive, with navigation visually minimized

Primary content widths:
- Standard pages: 1120–1280px max
- Forms: 420–560px
- Lesson experience: wider, optimized for video and timeline

## 4. Visual Prototype — Application Shell

```text
┌──────────────────────────────────────────────────────────────┐
│ EchoClass                                      Profile/Menu  │
├──────────────────┬───────────────────────────────────────────┤
│ Dashboard        │                                           │
│ Classes          │              PAGE CONTENT                 │
│ My Echoes        │                                           │
│ Revisit          │                                           │
│ Profile          │                                           │
│                  │                                           │
└──────────────────┴───────────────────────────────────────────┘
```

Teacher navigation remains intentionally smaller:

```text
Dashboard
My Classes
Profile
```

## 5. Primary Screens

### Authentication
Centered, quiet forms with minimal distraction:
- Sign In
- Sign Up
- Verify Email

### Student Dashboard
Prioritize:
1. Active classes
2. Pending revisits
3. Recent lessons
4. Recent Echoes

### Teacher Dashboard
Prioritize useful learning signals:
1. Classes
2. Student counts
3. Lesson counts
4. Recent activity
5. Recent hotspots

### Class Pages
Use a strong class header followed by contextual content.

Student:
- Published lessons
- Recent activity

Teacher:
- Students
- Lessons
- Invite code
- Recent activity
- Management actions

## 6. The Signature Screen: Lesson Player

The lesson page is the visual centerpiece.

```text
┌────────────────────────────────────────────────────────────────┐
│ ← Class                                         Lesson          │
├────────────────────────────────────────────────────────────────┤
│ Lesson Title                                                   │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │                                                            │ │
│ │                       VIDEO PLAYER                         │ │
│ │                                                            │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                │
│ What do you think about this moment?                           │
│ [ 😕 Confused ] [ ⭐ Important ] [ 💡 Insight ]               │
│                                                                │
│ Echo Timeline                                                  │
│ 00:00 ─────●──────────🔥🔥🔥────────────●──────────── 42:17    │
│                                                                │
│ Selected moment / hotspot detail / teacher response            │
└────────────────────────────────────────────────────────────────┘
```

The page should communicate immediately:

> A lesson is no longer just a video. It becomes a learning trace.

## 7. Echo Timeline Visual Specification

The Echo Timeline is a custom product component.

It must visually represent:
- Personal Echo markers
- Collective activity intensity
- Hotspot ranges
- Selected timestamp
- Teacher responses

Interaction model:
1. User selects a marker/hotspot.
2. Video seeks to the relevant timestamp.
3. Selected state updates.
4. Context panel shows aggregate activity and teacher response.
5. URL may preserve timestamp/selection state where useful.

## 8. Motion

Motion communicates state only:
- Echo marker enters
- Selected timeline moment changes
- Hotspot expands/collapses
- Video seeks
- Revisit completion confirms success

Respect reduced-motion preferences. Avoid continuous or distracting animation during learning.

## 9. Responsive Rules

### Desktop
Sidebar visible. Lesson player and timeline remain spacious.

### Tablet
Sidebar collapses. Cards and analytics stack progressively.

### Mobile
- Compact navigation
- Single-column content
- Large touch targets
- Lesson controls remain usable
- Timeline supports horizontal interaction/scrolling where required
- Persistent navigation must not obstruct video playback

## 10. State Design

Every major screen must have:
- Loading
- Empty
- Error
- Unauthorized/forbidden where relevant
- Success feedback

Errors should be user-friendly and must not expose infrastructure details.

## 11. Accessibility Baseline

- Semantic HTML
- Keyboard-accessible controls
- Visible focus states
- Accessible labels
- Sufficient contrast
- Screen-reader-friendly buttons
- No color-only meaning
- Accessible video controls where supported
- Reduced-motion support

## 12. Visual Acceptance Criteria

- The lesson player is unmistakably the primary student experience.
- The Echo Timeline is visually prominent and not treated as secondary analytics.
- Teacher analytics explain learning activity rather than generic SaaS metrics.
- Teacher/student navigation differs without fragmenting the design system.
- The UI remains calm, warm, focused, trustworthy, reflective, and uncluttered.
