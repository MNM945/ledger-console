# Ledger Console: making financial UI rules inspectable

## Project and scope

Ledger Console is a single-page personal concept built with React and TypeScript. Its 42 fictional transactions cover six currencies and five transaction statuses. It is a design-system implementation study, not a client delivery or a live payment service. No account, bank or wallet is connected.

The visual treatment adapts selected components from a supplied Figma library. The transaction layout, data model, financial rules, accessibility behavior and theme support are implementation decisions for this concept. The mapping is documented; it is not automatic Figma synchronization.

## Problem

A ledger can look convincing while leaving its most important rules unclear. A currency symbol can be ambiguous, a refund can look like a new charge, and a rounded total can hide a different calculation. A single happy-path screen also says little about permissions, session expiry or recovery.

The goal was to make these decisions visible in both the interface and reusable component contracts.

## Decisions

### Keep currency and calculation explicit

Every amount includes its currency code. Sorting groups currencies before comparing amounts, rather than implying an exchange-rate conversion. Amounts and fees are normalized to each currency's minor units before addition. Decimal midpoint values round away from zero. All six fixture currencies use two decimal places; invalid or unsafe values render as unavailable.

Full and partial refunds carry their own principal and fee-return fields. The drawer separates original debit, principal returned, fee returned, refund credit and remaining net debit. The illustrative policy retains the original fee. For example, a USD79.33 principal refund against an original USD81.38 debit leaves USD2.05 in retained fees. This is a demo rule, not a provider's financial policy.

### Turn visual foundations into reusable code

A token generator emits 78 base tokens as CSS custom properties and typed references. Button, Input and Select feed the filters and state actions; MoneyText, StatusBadge, TransactionTable and TransactionDrawer define domain patterns. Semantic overrides provide a light theme while keeping the same layout and interaction contracts as dark mode. Storybook source exposes component examples for review.

### Design the blocked paths alongside the normal page

The local request simulator exposes network failure, permission denial and session expiry. Blocked states hide transaction rows and filters, explain the situation and offer an explicit local recovery action. Retrying preserves filter selections. These controls exercise the UI; they do not authenticate a user or change real permissions.

### Preserve meaning across language and input methods

English and Arabic cover the supplied UI and timeline notes. Financial values use explicit codes, Latin digits and bidirectional isolation. Table dates, transaction details and timeline events use a visible UTC label. The table scrolls within its own region on narrow screens. Statuses combine words and icons, and the detail drawer contains keyboard focus, closes with Escape and restores the triggering row.

### Use an audit to drive specific fixes

The initial review found a 3.04:1 search placeholder, sub-44px targets, hidden extra monetary precision and incomplete recovery/localization states. The revised placeholder measures 6.73:1 in dark mode and 5.58:1 in light mode. Core interactive targets reach 44px; the money and refund rules are now explicit and testable.

## Validation and limits

The production build passes TypeScript and Vite checks. Seven automated tests cover currency formatting, invalid values, grouped sorting, rounding ties, safe integer totals and full/partial refund reconciliation across the fixtures. Browser checks cover themes, filtering, drawer focus, blocked states and recovery. These are implementation results, not a measured conversion improvement or a claim of WCAG certification.

A real service would still need a server-owned money model, authenticated permissions, provider-approved refund rules, native-speaker review and task-based usability testing. No interviews, production transactions or commercial outcomes are claimed.

## Deliverable

The repository includes reusable source components, tokens, Storybook configuration, tests, documentation and a standalone HTML build that can be opened without a local server. The single-page scope keeps the financial and interaction decisions easy to inspect.
