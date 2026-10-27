# Design system / Ledger Console consistency audit

Date: 27 October 2026 (Asia/Shanghai)

## Correction verified on 27 October 2026

The color and control-state findings below have been addressed locally:

- The board reads effective root CSS variables and observes theme changes. All **40 displayed color roles** match the actual ledger in both light and dark modes (zero mismatches in each comparison). Swatch rendering and copied declarations use those variables.
- The current catalogue displays **73 tokens**, including theme additions and Select colors/radius. The underlying JSON generator still contains 78 base entries; its 20 legacy palette entries are hidden from the active catalogue. The README now distinguishes these inventories.
- There are **18 pinned interaction specimens**: primary and secondary buttons each show default, hover, pressed, focus, disabled and loading; inputs show default, hover, focus, filled, error and disabled. Native interactions and specimen states share CSS declarations. The live form was checked for error, recovery and currency selection. Disabled/loading buttons block actions; loading exposes aria-busy and a spinner.
- FilterBar uses radius 24px, padding 24px and gap 20px in both the ledger and board. ErrorState uses radius 24px, title size 18px and a 44px action in both. Specimen-only appearance overrides were removed.
- The same interaction catalogue is included in Storybook. The token playground now inherits the active ledger's initial values instead of starting with an unrelated teal override.
- The catalogue's duplicate display heading is removed. Its chrome now uses the existing 22px page, 18px section, 14px group and 12px label/value tokens. Font specimens retain their true source sizes and weights, and native component typography is preserved.
- Application and Storybook builds passed. Desktop and narrow-screen verification is recorded with the task's local screenshots; no deployment or Git push was performed.

The findings and hashes below are the **initial audit snapshot**, before these corrections. The remaining general typography-scale and hardcoded-size observations are outside this color/control-state change. Theme additions remain in `themes.css`; this change does not claim a fully generated light/dark JSON graph or automatic Figma synchronization.

## Initial verdict (before correction)

The board uses the actual shared React components, but its foundation specimens and example-specific styling do not fully describe the current ledger. It is a component catalogue with partial token coverage, not a verified one-to-one specification of the rendered page.

This audit changed no application code or published files. Existing uncommitted changes were preserved.

## Scope and evidence

- Board: `src/examples/DesignSystem.tsx`, `src/examples/design-system.css`, `src/examples/styles.css`.
- Ledger: `src/App.tsx`, `src/components/`, `src/styles/global.css`.
- Foundations: `tokens/tokens.json`, generated `src/styles/tokens.css`, `src/styles/themes.css`.
- Local packaged Portfolio: `portfolio_01-original/projects/ledger-console/index.html` and `examples.html`.
- Browser inspection used the current local packaged files over `http://127.0.0.1:4175/`. Computed CSS variables were checked in both light and dark modes; component geometry was checked on both the board and ledger.
- Source inspection and SHA-256 comparison were read-only. No build was run during this audit.

## Findings

### 1. High: swatches and copied declarations do not follow the active light theme

`DesignSystem.tsx:2,25,57-58,76` reads literal JSON values, paints swatches with `token.value`, and copies that same value. JSON contains the dark foundation. The actual light values are overrides in `themes.css:18-52`.

Browser results: all 26 displayed semantic color slots match the dark theme. In light mode, **24 of 26 differ** from the active CSS variables. Primary action and on-primary remain the same after normalizing letter case.

| Semantic slot | Board / copied base value | Actual light value |
| --- | --- | --- |
| `color.text.primary` | `#FFFFFF` | `#191622` |
| `color.surface.page` | `#08080D` | `#f6f5fa` |
| `color.interactive.primary-hover` | `#8146FF` | `#561bd6` |
| `color.status.settled.fg` | `#8DEF9D` | `#176536` |

The board has a visually hidden “Base values” note, but its Light / Dark presentation does not expose both sets of values. Copying a swatch while viewing light mode still returns the dark declaration.

Recommended correction: resolve displayed and copied values from the active CSS variables, or explicitly show labelled light and dark pairs.

### 2. Medium: the token count is a source inventory, not page usage or visible coverage

The header reports all **78 JSON base tokens** (`DesignSystem.tsx:69`). After the prior palette-hiding change, the board contains **58 token specimens**: 26 color slots, 11 typography tokens, 9 spacing tokens, 4 radii, 5 motion tokens and 3 layer tokens. README.md:54-56 still says that all 78 appear.

A static scan of application/shared source (excluding examples, stories and generated token declarations) found direct CSS references to **54 of the 78 base tokens**. The 24 without direct references are all 20 `color.palette.*` tokens, `color.text.inverse`, `space.0`, `space.6` and `space.7`.

This is a source-reference count, not a claim that all 54 win the browser cascade or occur in every UI state. Some referenced declarations are later overridden.

Recommended correction: distinguish source inventory, visible specimens and actual component usage. “26 colors” means semantic slots, not 26 distinct hues.

### 3. Medium: the board omits extra tokens used by the real page

`themes.css:4-15` declares **10 additional color variables and one radius variable** outside the JSON catalogue:

- Top bar, card start/end, control, input and input-hover surfaces.
- Select surface, text, hover and active colors.
- `--lc-radius-select-menu: 16px`.

The ledger uses these values in `global.css:523-545,601-641`, but the board only flattens JSON. Its 26 color slots therefore omit important real control and surface colors even in dark mode.

Recommended correction: include these semantic roles in the shared token source and board, then derive counts from that source.

### 4. Medium: shared components receive different visual overrides in the board

| Element | Actual ledger | Board | Evidence |
| --- | --- | --- | --- |
| FilterBar (desktop) | Radius 24px; padding 24px; gap 20px | Radius 14px; padding 16px; gap 12px | `global.css:545`; `examples/styles.css:27`; browser computed styles |
| ErrorState | Radius 24px; title 18px | Radius 14px; title 14px; body 12px; fixed 44px action height | `global.css:313-344`; `examples/design-system.css:79-82` |
| MoneyText | Table text 13px | Specimen text 19px | `global.css:552`; `examples/design-system.css:71-72` |

MoneyText size changes can be legitimate display variants. FilterBar and ErrorState changes are currently applied by example-container CSS rather than documented component props, so the board cannot be used as an exact visual specification for the ledger.

Recommended correction: retain compact outer specimen layout while sharing component styling, or expose and document an explicit compact component variant.

### 5. Medium: the foundation scale does not cover all actual sizes

The displayed font scale is 12, 14, 16, 18, 22 and 28px. Actual desktop ledger styling also uses 13px table text, a 20px top-bar title and 36px ledger/summary titles (`global.css:524,529,536,552`).

The radius board shows 4, 30, 24 and 999px. Actual controls also use a literal 32px button radius (`global.css:538`) and the 16px Select menu radius (`themes.css:15`). The gallery introduces another 14px card radius. Actual FilterBar gap is 20px, outside the displayed 0/4/8/12/16/24/32/48/64 spacing scale.

Recommended correction: document component-level sizes or promote repeated values into tokens; do not describe the current base scale as covering every rendered value.

## What is consistent

- All 13 entries import and render shared `src/components` implementations (`DesignSystem.tsx:4-12,103-119`). The ledger uses all 13 directly or through other shared components. They are not separate mockups.
- MoneyText formatting, status icons/text, Select interaction, table sorting and drawer implementation come from those shared components. Preview data and props can differ.
- Generated base token names and values are shared by both entry points. Dark-mode displayed color values match the active base values.
- Motion durations/easing and layer values come from the same token source. The page uses the shared fast/normal/slow and sticky/overlay/drawer variables; the Select popup adds one to the drawer layer.
- Font-family stacks originate from the same variables. This establishes declared-stack parity, not that Switzer or JetBrains Mono is installed on every viewer's device.
- Packaged Portfolio assets are current exact copies of the existing local source builds:

| Source → Portfolio copy | SHA-256 |
| --- | --- |
| `Ledger Console.html` → `projects/ledger-console/index.html` | `35EF803F8B8A5C3A94C1D1A1DD099A92534D009102656F727628A46A6D955B7A` |
| `docs/article-examples.html` → `projects/ledger-console/examples.html` | `8BB31DBA7DBC2E314A038CF6B9CA78EF231C19B57BFA84CE21EC48D667DD6AFB` |

## Preview configuration differences

The board sorts only its first four matching fixture rows (`DesignSystem.tsx:55-56`); the ledger sorts the full filtered result (`App.tsx:95-118`). The board skeleton requests two rows while the ledger uses six by default. These are preview configuration differences, not forked component implementations.

## Correction order

1. Make swatches and copy actions theme-aware.
2. Reconcile JSON tokens, theme additions, displayed inventory and README claims.
3. Remove component appearance overrides from specimen containers or formalize compact variants.
4. Reconcile typography, spacing and radius scales with the rendered component values.

No production deployment or Git push was performed as part of this audit.
