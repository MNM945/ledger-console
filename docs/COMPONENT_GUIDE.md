# Component contracts and Figma references

## Foundations

Use semantic CSS variables rather than literal status colors in domain components. Generate CSS/TypeScript from `tokens/tokens.json`; never edit generated output. Shared light/dark overrides are in `src/styles/themes.css`. Inspect either mode using the Storybook toolbar. Layout uses logical properties so RTL remains independent of color mode.

## Component inventory

| React component | Variants and usage rules | Storybook | Figma relationship |
| --- | --- | --- | --- |
| Button | Native button; primary, default, disabled; explicit type; at least 44px target | Components/Controls | Source-inspired Button `22:25906` / `22:26058` |
| Input / Select | Visible labels; input validation and inline errors; disabled controls; Select supports arrows, Home/End, typeahead, Enter, Escape and Tab | Components/Controls; Components/FilterBar | Input adapts `22:26741`; Select adapts `22:26860`, `22:26875` and `22:26893–26902` |
| MoneyText | ISO code, local grouping, tabular figures, invalid-value fallback; never add unlike currencies | Components/MoneyText | Concept-specific; no mapped Figma component |
| StatusBadge | Five statuses, each with words and an icon; color is supplemental | Components/StatusBadge | Concept-specific |
| FilterBar | Search, status selection, currency selection, clear filters; controlled state | Components/FilterBar | Composition using the input/button treatment; no full variant parity claimed |
| TransactionTable | Compact 12×16px paired chevrons and aria-sort; currency-grouped amount order; long text wraps; narrow view scrolls within its own region | Components/TransactionTable | Header treatment adapts `110:21982`; sorting uses a code-drawn chevron indicator; ledger composition is concept-specific |
| TransactionDrawer | Timeline; settled/failed/full or partial refund; focus containment, Escape and focus return | Components/TransactionDrawer | Concept-specific |
| Loading / Empty / Error | Distinguish no data from no matches; distinguish network, access and session problems; expose no rows while blocked | Patterns/Boundary states | Concept-specific |

Source library: [supplied Figma file](https://www.figma.com/design/3BZDsAEpiSX4B7sgqLltD7/Shell-mobile--Copy-?node-id=22-23675).
Select, SelectOption, table-header and arrow references were inspected in the supplied Figma file for the control refinement. The Select uses a pill trigger, a 4px popup gap, 16px panel corners and violet active text. Its listbox is portalled and positioned within the viewport; focus remains on the labelled combobox. Pointer targets are at least 44px. Original 24px chevrons are stored in `src/assets/figma/` and bundled locally for Select; table sorting uses a compact code-drawn icon. Currency labels are supplied by the ledger; the reference component's crypto logo is not used for fiat currencies. No Figma edits, automatic synchronization or Code Connect registration were performed. Proposed variables are documented in [the token mapping](figma-variables-mapping.md).

## Financial contract

Each displayed amount carries its currency. Amount and fee are distinct; original debit adds their minor units. Refund credit adds returned principal and returned fee. Remaining net debit subtracts that credit. The illustrative policy retains original fees. All six ledger currencies use two decimals; the formatter also demonstrates zero- and three-decimal currencies in Storybook. Rounding happens before addition. Financial records and policies must be supplied and validated by a production service.

## Form contract

The Controls story demonstrates required reference validation with a real form submit, `aria-invalid`, `aria-describedby`, inline errors and disabled controls. It sends and saves nothing. The ledger uses these controls for filtering; there is no payment or refund execution form.

## Handoff rules

Keep product states in the page, formatting in MoneyText/money.ts and translations in i18n.tsx. Add variants to Storybook when a component contract changes. Check both themes, narrow view, long text and RTL. Never infer successful payment, authentication or permission changes from a local recovery action.
