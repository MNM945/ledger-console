# Ledger Console — Audit remediation update

**Updated:** 23 October 2026. **Scope:** the five issues selected by the user, on the single Ledger Console page.

## Current result

The five requested issues are addressed in the local demo. The original audit below is retained as a historical baseline; its old contrast measurements, missing-state findings and incomplete Arabic findings do not describe the updated build. This focused follow-up does not certify every item in the full release checklist or WCAG conformance.

| Requested issue | Current implementation and verification |
|---|---|
| Placeholder contrast | Secondary text token replaces the browser default. Measured foreground/background contrast: **6.73:1 dark**, **5.58:1 light**. Both exceed 4.5:1. |
| Monetary precision | Fixture amounts and fees are canonical minor-unit values for the six currencies (2 decimals). Decimal half-away-from-zero rounding precedes integer minor-unit addition; unsafe/invalid values are rejected by the formatting helpers. No hidden four-decimal GBP amounts remain. |
| Refund semantics | Full and partial refund fixtures explicitly record principal returned and fee returned. Drawer separates original debit, refund credit and remaining net debit. This demo retains original fees and labels that as an illustrative policy. Full refund USD79.33 + retained fee USD2.05 leaves net debit USD2.05; partial EUR67.38 credit against EUR136.91 original debit leaves EUR69.53. |
| Permission/session states | Demo selector exercises typed network, forbidden and expired errors through the simulated request. Each hides rows and filters and provides localized recovery. Browser checked forbidden/expired with zero visible rows and restored access; network retry preserved the search query. Recovery is local simulation, not real authentication or authorization. |
| 44px targets | Buttons, selects, search, sort controls, checkbox labels and skip link have minimum 44px targets. Rendered checks found no undersized targets in desktop English or narrow Arabic RTL. The checkbox target is its full associated label. |
| Timezone | Table, transaction date and timeline all use explicit UTC with a visible UTC label. First fixture displays 15 Oct 2026, 09:30 UTC regardless of the machine timezone. |
| Arabic | Skip link, timeline notes, theme control, state selector, error/recovery content, money rules and refund labels are translated. Identifiers, fictional legal names, currency codes and UTC remain unchanged. Arabic timeline checked with no English note fallback for the provided dataset. Translation has not undergone a native-speaker editorial review. |

## Validation

- Production build: strict TypeScript and Vite passed; 78 generated base tokens.
- Seven automated tests passed, including decimal ties, invalid inputs, overflow, exact integer-unit totals, all 42 fixture precisions, and full/partial refund reconciliation.
- Browser: permission-denied, expired-session and network recovery checked; filter retained after retry.
- Narrow Arabic RTL: viewport 390×844, document client/scroll widths both 375px; no whole-page horizontal overflow. Table retains its own horizontal scroll.
- Light and dark modes, localized drawer content, 44px close button and explicit UTC labels checked.

Evidence: [permission state](validation/permission-denied.jpg), [Arabic partial refund in light mode](validation/refund-arabic-light.jpg), [light theme](validation/ledger-light.jpg), [dark theme](validation/ledger-dark.jpg).

Remaining original audit items such as full Figma/component variant parity, regional-format coverage beyond English/Arabic, screen-reader testing, performance timing and release-process evidence are outside these five requested fixes. No production payment, real login or permission change is performed by the demo.

---

## Historical baseline — original audit before remediation

# Ledger Console — Interface Design Audit

**Date:** 23 October 2026
**Reference:** `界面设计评审清单.md` in the workspace root
**Scope:** the single Ledger Console page, including filters, table, states and transaction drawer.
**Method:** current source inspection, the locally served production build, browser interaction, rendered target measurements, and computed contrast. No interface changes were made during this audit.

## Verdict

**Does not pass the supplied release checklist.** The prototype demonstrates the main ledger interaction, but has failures in the checklist’s mandatory money, state-coverage and accessibility sections. This is a checklist-based release recommendation, not a complete WCAG conformance assessment.

Confirmed strengths: explicit currency codes, a separate fee column, status text plus icons, localized numeric formatting, keyboard sorting, distinct empty-state components, and working drawer focus containment/return.

## Prioritized findings

### 1. P1 — Search placeholder contrast is too low

**Checklist:** V — text contrast.
**Evidence:** computed placeholder `rgb(117,117,117)`, opacity 1; input background `rgba(255,255,255,0.1)` over panel `rgb(20,20,25)`. Composited contrast is approximately **3.04:1**, below the checklist’s 4.5:1 threshold.

**Impact:** the search hint is difficult to read, especially on dim displays. A visible label does not make the low-contrast hint itself pass the checklist.

**Recommendation:** introduce a placeholder-text token that reaches 4.5:1 against every supported input background, including hover. Set `::placeholder` explicitly. Recheck disabled and error variants separately.

**Location:** `src/styles/global.css`, `.field__input`.

### 2. P1 — Stored precision cannot be inspected or explained

**Checklist:** I — precision confirmation and monetary conventions.
**Evidence:** transaction `PAY-2026-10420` stores **23.8945 GBP**, while both table and drawer show **GBP 23.89**. The drawer offers no precision explanation. The visible example does add up: 23.89 + 0.34 = 24.23. A scan of all 42 current fixtures found no displayed amount/fee/total mismatch; this finding is about the undefined precision contract, not a proven incorrect sum.

**Impact:** a reviewer cannot tell whether the stored value is a payable amount, a calculation intermediate, or an incorrectly generated fixture.

**Recommendation:** define the canonical currency precision and rounding point. Normalize payable amounts at the data boundary using minor units or decimal values. If extra precision is intentional, identify it explicitly in details. Do not present four decimal places as a payable GBP amount without a valid domain rule.

**Locations:** `src/data/transactions.ts` (`buildAmount`), `src/components/MoneyText.tsx`, `src/components/TransactionDrawer.tsx`.

### 3. P1 — Refund and exceptional-amount rules are incomplete

**Checklist:** I — negative amounts, refunds and partial settlement.
**Evidence:** a refunded transaction uses the same positive amount, positive fee and “Total (amount + fee)” block as other transactions. Its timeline says “Full refund issued,” but the schema has no refunded amount, refunded fee, net debit/credit or partial-settlement fields. All current fixtures use positive values.

**Impact:** the interface cannot establish how much was returned or whether a fee was retained. A refunded status alone does not answer that financial question.

**Recommendation:** distinguish original amount, original fee, refunded amount, refunded fee and net outcome. Add representative negative, partial-refund and partial-settlement examples if those are supported. Otherwise document the unsupported cases explicitly. This is a missing rule, not proof that a real refund was calculated incorrectly.

**Locations:** `src/data/transactions.ts`, `src/components/TransactionDrawer.tsx`.

### 4. P1 — Permission and session states are missing

**Checklist:** II — permission denied, session expiry and network interruption.
**Evidence:** the loading state machine is only `loading | error | ready`; the fake API exposes one generic network error. There are no permission-denied or expired-session views. Retry while the simulation switch remains enabled predictably fails again.

**Recommendation:** define typed failures and separate recovery actions: sign in again, request access, or retry connectivity. These are integration gaps for release; no production authentication behavior was tested.

**Locations:** `src/App.tsx`, `src/data/api.ts`, `src/components/StateViews.tsx`.

### 5. P2 — Interactive targets miss the checklist’s 44px minimum

**Checklist:** V — touch-target size.
**Evidence:** rendered language, RTL and currency controls are **40px** high. Status-checkbox labels are approximately **19px** high. Date, Counterparty and Status sort buttons are approximately **20px** high. Their surrounding table cells are not equivalent to button hit areas.

**Recommendation:** retain compact visual geometry if required, but provide at least 44px interaction areas and adequate separation at touch breakpoints. The 44px requirement here comes from the supplied checklist; these measurements alone are not a complete WCAG verdict.

### 6. P2 — Dates omit the timezone

**Checklist:** IV — explicit timezone.
**Evidence:** both table and drawer use localized `Intl.DateTimeFormat` without a specified `timeZone` or displayed zone. The first record is stored as `2026-10-15T09:30:00.000Z`; this browser rendered **15 Oct 2026, 17:30** without a timezone label.

**Recommendation:** choose and display a business or viewer timezone, including the abbreviation/offset where ambiguity matters. Use the same convention in the table and timeline.

### 7. P2 — The component-system contract is only partially enforced

**Checklist:** VI and X — token coverage, component reuse and traceability.
**Evidence:** the final theme contains raw colors, dimensions and gradients, including `#08080def`, `#24242466`, `#ffffff1a`, `30px` and `32px`. Controls also diverge: the filter currency uses the shared Select wrapper, the language selector is native markup, and sortable headers use raw buttons. These can look consistent today but bypass a single component contract. README documents selected source nodes, not every rendered variant.

**Recommendation:** move visual decisions into semantic tokens, consolidate shared controls, and record which Figma variants map to which React variants and which are deliberate ledger adaptations. Do not claim complete one-to-one parity until every used variant has been checked.

**Locations:** `src/styles/global.css`, `src/components/Controls.tsx`, `FilterBar.tsx`, `DirectionToggle.tsx`, `TransactionTable.tsx`.

### 8. P2 — Arabic localization is incomplete

**Checklist:** IV and VIII — market formatting and language completeness.
**Evidence:** Arabic switches the root to RTL and localizes interface labels, but the skip link and timeline notes remain English. `intlLocale` supports only en-GB and Arabic with Latin digits, so German-style separators are not demonstrated. Narrow RTL layout contains horizontal table scrolling without document-level overflow in the measured viewport.

**Recommendation:** translate remaining product strings or explicitly restrict the supported language scope. Separate region/currency formatting from text language. Test long translations and mixed-script references with language reviewers before claiming full localization.

## Checklist coverage

**Legend:** PASS = supported by inspected evidence; FAIL = missing or contradictory implementation; PARTIAL = some requirements met; UNVERIFIED = insufficient evidence; N/A = outside this page’s current scope. N/A is not a pass for a future product that introduces that feature.

### I. Money accuracy — mandatory

| Criterion | Result | Evidence / limitation |
|---|---|---|
| Unambiguous currency | PASS | Codes such as GBP and USD accompany displayed amounts. |
| Separate fee and amount + fee = total | PASS for current fixtures | Fee column and drawer breakdown; all 42 displayed fixture sums checked. |
| Currency-specific decimal places | PARTIAL | Intl formatting supports the rule; current page only offers six two-decimal currencies, not JPY/KWD. |
| Local separators | PARTIAL | en-GB and Arabic implemented; no region selection or de-DE demonstration. |
| Tabular numbers and alignment | PASS | `tabular-nums`, end-aligned monetary cells, consistent two-decimal fixtures. |
| Status icon + text + color | PASS | Shared StatusBadge provides all three. |
| Negative/refund/partial-settlement rules | FAIL | Finding 3; formatter support alone does not establish product rules. |
| Exact precision inspectable | FAIL | Finding 2. |

### II. State coverage — mandatory

| Criterion | Result | Evidence / limitation |
|---|---|---|
| Loading skeleton | PASS | Skeleton component is shown during simulated latency. |
| No-data vs no-results empty states | PARTIAL | Separate components exist; no-results tested; production demo always returns data, so no-data route is not reachable here. |
| Actionable error | PASS for simulated network error | Human-readable message and Retry; one generic failure only. |
| Batch partial failure | N/A | No batch operations. |
| Permission/session/network states | FAIL | Only generic network error exists; finding 4. |
| Destructive/high-risk confirmation | N/A | Read-only ledger; no payment, deletion or permission mutation. |

### III. Tables and filters

| Criterion | Result | Evidence / limitation |
|---|---|---|
| Keyboard sorting and visible direction | PASS | Enter on Counterparty changed its arrow to ascending. |
| Active filters visible | PASS | Controlled query, currency and checked statuses remain visible. |
| Result count | PASS | Visible count and debounced live region. |
| Large-list strategy | PARTIAL | 42 rows render directly; no pagination or virtualization for larger datasets. |
| Missing-value placeholder | FAIL | Cells render raw fields; no shared unavailable/missing-value convention for general table data. |

### IV. Multiple markets / internationalization

| Criterion | Result | Evidence / limitation |
|---|---|---|
| Long translated text | UNVERIFIED | No realistic long-language fixture tested; nowrap table cells scroll rather than wrap. |
| Complete RTL mirroring | PARTIAL | RTL enabled and logical layout used; every directional glyph was not independently checked. |
| Latin digits / isolated money in RTL | PASS for inspected implementation | `ar-u-nu-latn` plus `bdi`. |
| Localized dates | PASS for supported locales | Intl formatter used; market coverage remains limited. |
| Market-specific payment methods | N/A | No payment-method selection. |
| Explicit timezone | FAIL | Finding 6. |

### V. Accessibility — mandatory

| Criterion | Result | Evidence / limitation |
|---|---|---|
| Text contrast | FAIL | Placeholder 3.04:1; tested body and status text pass. |
| Keyboard journey | PARTIAL | Search recovery, sort, drawer Tab/Escape tested; no complete browser/assistive-technology matrix. |
| Visible focus | PASS for inspected controls | Focus rings visible; focused row restored. |
| Modal trap and focus return | PASS | Tab stays on Close; Escape returns focus to triggering row. |
| Visible form labels and associated errors | PASS / N/A | Search, currency and language labeled; page has no field-validation flow. |
| Screen-reader output | UNVERIFIED | Semantic attributes inspected; actual screen-reader announcements were not tested. |
| Reduced motion | PARTIAL | CSS reduction rule present; OS preference behavior not exercised in this audit. |
| 44px touch targets | FAIL | Finding 5. |

**Calculated token contrast:** primary text on raised surface 18.36:1; secondary text 8.82:1; settled 10.48:1; processing 7.95:1; failed 7.83:1; refunded 10.76:1; pending 9.30:1. These calculations do not certify every state, overlay or browser-generated style.

### VI. Design-system consistency

| Criterion | Result | Evidence / limitation |
|---|---|---|
| All visuals use tokens | FAIL | Raw theme values remain. |
| Components belong to the library | PARTIAL | Shared controls exist; bypassing raw controls remain. |
| Consistent reuse | PARTIAL | StatusBadge reused; button/select construction is mixed. |
| Figma ↔ React one-to-one coverage | PARTIAL | Selected source IDs documented; complete variant reconciliation missing. |
| Dark theme via tokens | PARTIAL | Semantic tokens are dark, but theme overrides also hardcode colors. No theme switch exists. |
| Open-source token integration | N/A | No Radix/shadcn component system in this implementation. |

### VII. Onboarding / KYB / checkout

All six items are **N/A**: this is a read-only ledger with filters, not a transactional form, multistep onboarding flow, regulated disclosure flow or checkout. This audit does not assess compliance approval.

### VIII. Content and language

| Criterion | Result | Evidence / limitation |
|---|---|---|
| Consistent terminology | PARTIAL | Status names are centralized; refund financial semantics remain undefined. |
| Action-oriented buttons | PASS | Retry, Clear filters, Close and Switch to RTL describe actions. |
| No language leakage/placeholders | FAIL for Arabic | English timeline notes and skip link remain; no lorem ipsum seen in the English page. |
| Numeric/date/currency content rules | PARTIAL | Currency/date formatting implemented; timezone and precision rules unresolved. |

### IX. Responsive behavior and performance

| Criterion | Result | Evidence / limitation |
|---|---|---|
| Table degradation at narrow width | PASS at tested width | 375px document width, 375px scroll width; 992.5px table inside a 343px horizontally scrolling container. |
| No initial layout shift | UNVERIFIED | No CLS trace recorded; skeleton and populated table have different structures. |
| Feedback within 100ms | UNVERIFIED | Interactions appeared responsive, but no input-to-paint timing measurement was taken. |

### X. Release consistency

| Criterion | Result | Evidence / limitation |
|---|---|---|
| Screen-by-screen Figma comparison and accepted deviations | PARTIAL | Source-node references exist; no complete deviation register and sign-off. |
| Review of tokens, ARIA and logical CSS | PARTIAL | Inspected in this audit; token coverage still fails. |
| PR screenshots/recording | N/A / no evidence | No PR is part of this local task; local screenshots do not establish PR evidence. |
| Customization approach approved | UNVERIFIED | No agreed token-vs-source extension policy or peer approval supplied. |

### XI. Open-source component adaptation

All 15 subitems are **N/A to Radix/shadcn adaptation** because the UI uses native controls and custom React components. This is not evidence that those libraries were integrated or audited. Relevant keyboard, focus, branding and boundary-state checks are covered above.

## Evidence and next steps

Screenshots: [RTL desktop](audit/rtl.jpg), [narrow RTL](audit/narrow-rtl.jpg). Source files inspected: App, Controls, FilterBar, TransactionTable, TransactionDrawer, MoneyText, money formatting, data fixtures, API simulator, locale dictionaries, token JSON and global CSS.

Fix first: placeholder contrast; monetary precision and refund semantics; permission/session states. Then address touch targets, timezone labels and token/component consolidation. Recheck narrow layouts and Arabic content after those changes. Before release, complete an actual screen-reader pass, reduced-motion test, realistic large-data test and approved Figma comparison.

**Audit only:** no application source or design files were modified. This report does not supersede the checklist and does not convert the concept into a production-ready financial product.
