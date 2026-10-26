# Role-aligned delivery index

Ledger Console is one responsive ledger page and its supporting component system. All data is fictional. This index describes implemented artifacts, not professional experience or production results.

| Deliverable | Source / output | Review path |
| --- | --- | --- |
| React + TypeScript page and components | `src/App.tsx`, `src/components/`, `Ledger Console.html` | Filter, sort and open a row; resize the viewport |
| Design tokens | `tokens/tokens.json`, `scripts/build-tokens.mjs`, `src/tokens.ts`, `src/styles/tokens.css`, `src/styles/themes.css` | Run `npm run build`; inspect 78 generated base tokens and both themes |
| Domain components and states | MoneyText, StatusBadge, FilterBar, TransactionTable, TransactionDrawer, Controls | Inspect amount, fee, currency, status, sorting, validation and full/partial refunds |
| Storybook and component rules | `src/stories/`, [component guide](COMPONENT_GUIDE.md), [Figma mapping](figma-variables-mapping.md) | Run `npm run storybook`; switch the theme toolbar; inspect variants |
| Boundary states | Header “Demo state”; `Patterns/Boundary states`; TransactionTable / LongText | Choose loading, no transactions, network failure, permission denial, session expiry or long text; search for a nonexistent reference to inspect filtered empty |
| Internationalization and accessibility | `src/i18n.tsx`, [review guide](I18N_ACCESSIBILITY.md) | Switch English/Arabic and RTL; test keyboard-only navigation and a narrow viewport |
| English case and handoff | [case study](CASE_STUDY.md), [README](../README.md), [handoff](IMPLEMENTATION_HANDOFF.md), [validation](VALIDATION.md) | Review the problem, rules, implementation, evidence and remaining limitations |

## Five-minute walkthrough

1. Open `Ledger Console.html`. Review ISO currency labels, fee columns and text-based statuses.
2. Filter by currency and status. Enter an unmatched search and clear the filters.
3. Open a refunded record. Compare original debit, returned principal, returned fee and remaining net debit.
4. Use “Demo state” to inspect empty data, persistent loading, long text and each blocked state. Return to “Normal” to recover; filters persist.
5. Switch light/dark and English/Arabic. Tab through the page, open a row with Enter, close its drawer with Escape and check focus returns.

Persistent loading intentionally remains until another demo state is selected. Permission and session recovery buttons only restore local fixture data. No request grants real permission or signs in a user.

## Delivery boundaries

The Figma references identify selected source controls, not full component parity or Code Connect. Light-mode overrides live outside the generated JSON graph. Arabic content still needs native-speaker review. Build and unit checks do not establish complete WCAG conformance or user success. No portfolio copy or domain is updated by building this project.
