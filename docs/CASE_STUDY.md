# Ledger Console — design-system delivery

A single ledger page connects the following seven deliverables. The 42 transactions are fictional; no real account is connected and no funds move. This is an implementation study, not a client production release.

| File / artifact | Role requirement |
| --- | --- |
| React + TypeScript page and components | Code delivery, reusable components and responsive layout |
| Design tokens | Color, typography, spacing and radius foundations |
| Component and state examples | Amounts, currencies, fees, statuses, tables, filters and forms |
| Storybook and component documentation | Variants, usage rules and documented Figma ↔ React references |
| Boundary-state examples | Loading, no data, errors, long text and permission restrictions |
| Internationalization and accessibility | Multiple currencies, local formats, keyboard access and RTL |
| English case study and README | Problem, decisions, implementation, validation and handoff |

## React + TypeScript page and components

A dense ledger needs a clear scan path and a predictable way to inspect a record. The page composes Button, Input, Select, FilterBar, MoneyText, StatusBadge, TransactionTable and TransactionDrawer instead of implementing each state separately.

Implementation: src/App.tsx owns filters, currency-grouped sorting, request states and selection. Components live in src/components/. On narrow screens, the table scrolls inside a labelled region; the details drawer supports keyboard focus and return. The TypeScript/Vite build produces a standalone Ledger Console.html for review.


## Design tokens

The foundation covers semantic colors, typography, spacing, radii and motion. tokens/tokens.json is the source for 78 base tokens; scripts/build-tokens.mjs emits CSS custom properties and typed TypeScript references. Generated files are rebuilt rather than edited by hand.

Dark and light modes share component contracts. The dark foundation is generated from JSON, while light-mode and additional surface overrides are maintained in src/styles/themes.css. Moving both modes into one generated token graph remains a handoff improvement.


## Component and state examples

MoneyText shows ISO currency codes and local grouping. Amounts and fees are normalized to integer minor units before totals; decimal midpoint values round away from zero. Sorting groups currencies and does not imply FX conversion. StatusBadge pairs text with an icon rather than relying on color alone.

The drawer separates original debit, principal returned, fee returned, refund credit and remaining net debit. Full and partial refunds use an explicitly illustrative policy that retains original fees. Filter examples cover search, status and currency; the Controls story adds labelled fields, required validation, inline errors and disabled controls without sending or saving data.


## Storybook and component documentation

src/stories/ makes component variants reviewable in Storybook, including monetary edge cases, statuses, active filters, long text, full/partial refunds, form validation and blocked states. The shared toolbar switches dark and light mode. Usage contracts and review paths are recorded in docs/COMPONENT_GUIDE.md and docs/DELIVERABLES.md.

The Figma ↔ React relationship is documented rather than implied: Button references 22:25906 / 22:26058, Input references 22:26741, and the table-header treatment references 110:21982 in the supplied library. Ledger-specific components and interaction rules are implementation decisions. No complete library parity, Code Connect registration or automatic synchronization is claimed.


## Boundary-state examples

The header exposes persistent loading, no transactions, long text, network error, permission denial and expired session. A search with no match shows a separate filtered-empty state with a clear-filters action. Loading remains inspectable until another demo state is selected.

Blocked states hide transaction rows and filters. Local recovery restores fixture data while preserving filter selections; it does not authenticate a user or grant access. Long names and unbroken references wrap without truncating the identifier. These patterns are also isolated under Patterns/Boundary states in Storybook.


## Internationalization and accessibility

The ledger supports English and Arabic, with automatic RTL when Arabic is selected. Currency codes remain explicit, numbers use the documented Latin-digit convention, bidirectional isolation protects identifiers, and dates are consistently labelled UTC. All six fixture currencies use two decimals; the MoneyText examples additionally exercise zero- and three-decimal formats.

Keyboard support includes a skip link, visible focus, native controls, result-count announcements, Enter/Space to open a row, and a drawer with Tab containment, Escape and focus return. Core targets are at least 44px. docs/I18N_ACCESSIBILITY.md records the review matrix and remaining native-speaker and assistive-technology checks; no WCAG certification is claimed.


## English case study and README

docs/CASE_STUDY.md explains the problem, design decisions and implementation. README.md covers setup and the standalone build; docs/IMPLEMENTATION_HANDOFF.md records entry points and contracts; docs/VALIDATION.md records checks and limits. The seven deliverables are indexed in docs/DELIVERABLES.md so another designer or engineer can continue the work.

TypeScript/Vite and Storybook production builds pass, alongside seven automated money/refund tests. Browser checks cover recovery, long text, form validation and a 390px Arabic/RTL/light layout with no page overflow. These are implementation checks, not user-research findings or measured business uplift. Production use still needs server-owned financial records, authenticated access and provider-approved refund rules.

## Review and handoff

The portfolio article includes a visual design-system board with all 78 source tokens and 13 shared components, a refund calculation explorer, and expandable boundary-state contracts. The board uses color swatches, type specimens, spacing bars, radius shapes, motion previews and layer samples; its component gallery uses the actual React components. The refund explorer reads fixtures `tx-015` (partial, EUR) and `tx-008` (full, USD) from the source dataset. It keeps the records separate and preserves the illustrative fee-retention rule. Its native radio controls and disclosures work without additional JavaScript.

`npm run build:article-visuals` rebuilds the bilingual visual markup in `docs/portfolio.json`. Styling lives in `docs/article-visuals.css`; the sync scripts copy it to the portfolio's `assets/ledger-console/article-visuals.css` with the article.

Start with [the deliverable index](DELIVERABLES.md), then follow the component and accessibility guides. Native-speaker review, comprehensive screen-reader testing and task-based usability research remain future work. The source-inspired Figma mapping is documented; no automatic synchronization is claimed.
