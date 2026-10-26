# Verification record — 25 October 2026

## Seven live article examples

- The seven delivery categories each contain one labelled iframe, lazy loading and a separate-tab link. Six windows share a standalone React bundle; the seventh is the actual Storybook documentation catalogue.
- Browser checks: resize the component composition, open a transaction with Enter and close with Escape; adjust token radius to 32px and click the preview action; enter 100.10 + 0.20 and see EUR 100.30; test invalid input and clear an unmatched search.
- Permission denial hides all rows; recovery restores three rows plus their header. Persistent loading exposes aria-busy. Arabic switches to RTL; JPY rounds 1284.5 to 1,285 and KWD preserves 12.345. The drawer supports keyboard open/close.
- Storybook's actual MoneyText Docs controls change the rendered amount to GBP 99.25. The handoff window switches real source documents and records checklist progress. Clipboard and download actions are user-operated local actions.
- Parent language changes preserve token state. At 390px, all seven outer windows are 341px wide and the article has no page-level horizontal overflow.
- Main React build, focused example build, Storybook build, TypeScript and source translation/asset checks pass. No dependency installation, push, deployment or domain change was required.

Scope: single Ledger Console page after dark/light mode and the requested audit fixes.

- `npm run build`: passed, strict TypeScript, 78 generated base tokens and Vite production build.
- `npm test`: 7/7 passed. Covers currency formatting, invalid values, grouped sorting, decimal rounding, integer totals/overflow, all fixture precision and full/partial refunds.
- Browser: dark/light switching and stored selection, English/Arabic, UTC date labels, refund details, permission/session states, network retry with preserved filters.
- Placeholder contrast: dark 6.73:1, light 5.58:1.
- Target measurements: minimum 44px for buttons, selects, search, sort controls and full checkbox labels; skip link also 44px.
- Narrow RTL: viewport 390×844; document clientWidth=scrollWidth=375px.
- No real authentication/authorization backend is present. Restore actions reset the local demo scenario.
- This is targeted verification, not a complete WCAG, performance or production-readiness assessment. Storybook 10.6.2 production build passed on 25 October 2026; large documentation/accessibility chunks are build warnings, not a runtime performance certification.

See `UI_AUDIT_EN.md` for remediation details and the historical audit baseline.

## Figma control refinement — 26 October 2026

- Inspected the supplied Select/SelectOption, table-header and arrow nodes with Figma design context and screenshots. Four original SVGs are bundled locally at their native 24×24 size.
- Replaced system select menus with the shared labelled combobox: 16px option-panel corners, 4px anchor gap, violet selected text and 44px option targets. Reused it in the ledger, article examples, component board and Storybook.
- Browser checks: pointer selection changes transaction currencies; arrows, Home/End, typeahead and Enter select; Escape cancels without changing the value; Tab closes the panel and advances focus. Sorting changes `aria-sort` and transaction order.
- At 390×844, the currency panel stays within the viewport and the document has no horizontal overflow. Arabic/RTL aligns the panel to the trigger's right edge. At 390×360, the panel opens upward and scrolls within the available height. Light and dark controls and all 24px icons render correctly.
- `npm run build`, 7 money tests and `npm run build-storybook -- --disable-telemetry` pass. No dependency installation, remote push, deployment or domain change.

## Visual design-system board — 26 October 2026

- Browser DOM contains 78 distinct source-token specimens: 46 colors, 11 typography tokens, 9 spacing values, 4 radii, 5 motion tokens and 3 stacking levels.
- All 13 shared components render in the gallery, including all five statuses, disabled controls, empty states and three error kinds.
- Browser checks cover required-field errors, editing without losing focus, currency changes in MoneyText, filtering the table, Enter to open the drawer and Escape to restore row focus, motion playback, and dark mode.
- The standalone gallery has zero document-level horizontal overflow at a 390px viewport. The table retains its named horizontal scroll region.

## Role-aligned artifact update — 25 October 2026

- `npm run build`: passed after adding the scenario selector options and long-text fixtures; standalone outputs regenerated.
- `npm test`: all 7 financial-formatting/refund tests passed.
- `npm run build-storybook`: passed with Controls, boundary states, long text, partial refund and the theme toolbar. Documentation/accessibility chunks still generate size warnings.
- Browser checks: no-data shows zero summary counts and a distinct empty state; persistent loading exposes `aria-busy=true`; long-text mode contains 42 rows; 390×844 Arabic/RTL/light layout has zero page overflow.
- Permission denial exposes neither rows nor search filters. Local recovery restores the table. Long-text details retain the full counterparty and reference; Escape closes the drawer and returns focus to its row.
- Storybook Controls: empty submit sets `aria-invalid=true` and displays the associated alert; entering `DEMO-123` produces the local success status.
- Added screenshots: `validation/long-text-mobile-rtl.png` and `validation/long-text-details-rtl.png`. Existing screenshots remain historical evidence.
- No new dependency installation, Figma edit, portfolio synchronization, remote push, publication or domain change was performed. Full screen-reader and native-speaker review remain pending.
