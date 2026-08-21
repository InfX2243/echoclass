# EchoClass — Account Controls and Settings Plan

## Scope

This documented product slice adds the missing account controls to the shared application shell:

- clickable avatar/account menu
- role-aware account identity
- logout for the current demo-auth flow
- dedicated settings page
- light, dark, and system theme selection
- persistence through the existing theme provider

## Boundaries

This is a frontend shell/auth-completion slice. Demo authentication remains development-only and is not a substitute for backend sessions or authorization.

## Implementation

1. Add explicit demo-session state when a supported demo account signs in.
2. Extend the shared top bar with an accessible account menu.
3. Add Settings and Logout actions to that menu.
4. Logout clears the demo session and returns to `/login`.
5. Add `/settings` with light, dark, and system theme controls using the existing `ThemeProvider`.
6. Keep the shared shell usable for both student and teacher routes.

## Done when

- Every existing application page using `AppShell` exposes the same account controls.
- Settings updates the existing persisted theme preference.
- Logout clears demo-session state and navigates to login.
- No backend auth contract is introduced.
