---
title: Mobile setup and notification settings
description: Set up the paired Nod server from Flutter and understand the gates for phone alerts and incoming links.
---

The Flutter setup screen can finish the paired server's onboarding without a browser preflight. Phone push notifications are not available yet.

Pairing still uses **Server address**, **Access token**, and **Connect to Nod**. Use the existing private token field, never a token in a link, chat, command, or screenshot. HTTPS and certificate checks stay unchanged. See [Mobile client evaluation](/contribute/mobile-evaluation/) for device networking requirements.

## Set up the paired server

The setup entry is `NodMobileOnboarding`. The app shell must open it after authentication when `/api/session` reports `settings.onboardingCompleted: false`. An already configured server should open chat. This package supplies the screens and route parser; the shared app shell owns their navigation wiring.

1. Review **Share usage data** and select **Get started**. Nod starts preparing its workspace and browser on the paired server. Reading connected apps in the background uses your model and counts as model usage.
2. Select **Connect apps** to connect Gmail, Outlook, or another app through the existing account manager. You can skip this step.
3. Fill in **About you**, or select **Skip for now**. Multiple roles and tasks are allowed. Business roles show who the help is for. Personal scope hides company size. Typed answers are capped at 200 characters each. Never include secrets.
4. Connect a model if none works. **Models** opens the same private provider configuration as Settings. Keys go directly to the paired server, never through chat.
5. Select **Share traces** or **Not now** where traces are available. This saves an explicit choice. Traces include conversations and what Nod reads and does. They are pseudonymised, not anonymous, retained for 14 days, and never used to train AI.
6. Optionally enter an email for updates and tick the separate consent box. **Start chatting** submits it only when usage sharing and the server's email capability are available. **Continue without email** skips submission.

About you uses the server's existing profile route. With memory on, it saves one stated note. With usage sharing on, only fixed choices reach the installation's analytics profile. Typed answers stay out of analytics. An optional updates email requires consent to n8n GmbH linking it to usage data and sending updates about Nod and other n8n products. You can withdraw through each email's unsubscribe link or privacy@n8n.io.

After About you, confirmed email connections can start the existing first-idea discovery. This does not block setup. Discovery failure does not mean Nod found nothing. Preparation and completion failures keep setup open for an explicit retry. The server checks its own completion prerequisites before saving completion.

Returning from an app or model sign-in refreshes server state. Foregrounding refreshes it too. Unsaved answers live only in this screen's memory, not device storage. Restarting setup keeps saved server connections and preferences, but starts the optional questions again. An observed owner change clears unsaved answers before any new save.

## Change preparation and quiet hours

`NodNotificationSettingsPage` exposes existing server preferences:

- **Pause preparation** stops background preparation, Gmail inbox polling, and planned checks of tasks Nod started. Your own tasks and schedules keep running.
- **Quiet hours**, **From**, and **Until** use the server preference time zone, not the phone clock. Enter 24-hour `HH:mm` times. Equal times mean no quiet interval. An empty time zone uses the server fallback, UTC.
- **Notification rule** is your standing instruction for background work. Nod reads connected apps even with no rule. Outside actions still pass Trust. A notification rule does not authorize changes to Nod's own settings.

Quiet hours hold nudges until they end, except high-impact findings with strong evidence and an earlier deadline. Snooze is specific to a finding: reply to its nudge in chat, such as “Remind me tonight”. There is no invented global snooze preference.

These settings do not request operating-system permission or enable phone alerts. Existing web and desktop notification choices remain unchanged.

## Incoming links and platform gates

`NodMobileRoute.parse` accepts relative known paths or absolute URLs on the exact paired origin only after authentication. It recognizes chat, the existing `/tasks` list, `/prepared/<uuid>`, existing private sign-in and payment request links, and `/browser`. Private sign-in IDs use the existing server request-token format, not a new pairing credential. Never generate links containing the connection access token.

The parser rejects other origins, embedded credentials, queries, fragments, encoded paths, traversal, and unknown routes. Parsing is not authorization. The caller must use the current authenticated transport, fetch the exact referenced request or result, and let the server reject removed, expired, replaced, or other-owner data. `/browser` must resolve the currently pending server handoff, never assume a turn from the link. The current web task path opens the task list, not an invented task-detail URL.

Native URL registration, cold-start delivery, routing before authentication, and shared-shell dispatch need central platform integration. Do not preserve a pending route across a server or owner change. Finishing onboarding should open chat, rather than follow a deferred link.

:::caution[Remote push is blocked]
There is no APNs or FCM device registration or delivery infrastructure in this client. Push needs an owner-approved architecture and credentials decision, followed by platform permission, delivery, and device checks. No permission toggle pretends that this exists.
:::

## Check the package

From `clients/flutter`, run:

```sh
flutter pub get
flutter test test/api/onboarding_repository_test.dart
flutter analyze lib/core/onboarding.dart lib/api/onboarding_repository.dart lib/features/onboarding test/api/onboarding_repository_test.dart
```

These are synthetic HTTP-contract and widget checks. They cover authentication headers, consent gates, optional steps, model prerequisites, preparation failure, single-flight completion, owner-change clearing, pause writes, foreground refresh, and unsafe route rejection. They do not prove full server database isolation, native URL delivery, phone permissions, push delivery, live models, or real sign-ins.

## Related resources

- [Mobile client evaluation](/contribute/mobile-evaluation/)
- [Your first conversation](/get-started/first-conversation/)
- [Mobile settings](/contribute/mobile-settings/)
- [Mobile connections](/contribute/mobile-connections/)
- [Mobile private entry](/contribute/mobile-private-entry/)
- [Nudges](/use/nudges/)
