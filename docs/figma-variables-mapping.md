# Figma Variables ↔ Token Pipeline Mapping

This document proposes a naming contract for this concept. It is not an export of the supplied Figma library and does not establish that these variables already exist there.
One source of truth: `tokens/tokens.json`. `scripts/build-tokens.mjs` generates
`src/styles/tokens.css` (CSS custom properties) and `src/tokens.ts` (typed TS
references) from it. Never hand-edit the generated files.

Naming rule: Figma uses `/` separators, code uses `.`/`-` — otherwise the path
segments are identical, so a variable can be located mechanically in either tool.

## Semantic colors (the part a ledger UI actually consumes)

| Proposed Figma Variable | tokens.json path | CSS variable | TS reference |
|---|---|---|---|
| `color/status/settled-fg` | `color.status.settled.fg` | `--lc-color-status-settled-fg` | `tokens.color.status.settled.fg` |
| `color/status/settled-bg` | `color.status.settled.bg` | `--lc-color-status-settled-bg` | `tokens.color.status.settled.bg` |
| `color/status/processing-fg` | `color.status.processing.fg` | `--lc-color-status-processing-fg` | `tokens.color.status.processing.fg` |
| `color/status/processing-bg` | `color.status.processing.bg` | `--lc-color-status-processing-bg` | `tokens.color.status.processing.bg` |
| `color/status/failed-fg` | `color.status.failed.fg` | `--lc-color-status-failed-fg` | `tokens.color.status.failed.fg` |
| `color/status/failed-bg` | `color.status.failed.bg` | `--lc-color-status-failed-bg` | `tokens.color.status.failed.bg` |
| `color/status/refunded-fg` | `color.status.refunded.fg` | `--lc-color-status-refunded-fg` | `tokens.color.status.refunded.fg` |
| `color/status/refunded-bg` | `color.status.refunded.bg` | `--lc-color-status-refunded-bg` | `tokens.color.status.refunded.bg` |
| `color/status/pending-fg` | `color.status.pending.fg` | `--lc-color-status-pending-fg` | `tokens.color.status.pending.fg` |
| `color/status/pending-bg` | `color.status.pending.bg` | `--lc-color-status-pending-bg` | `tokens.color.status.pending.bg` |
| `color/text/primary` | `color.text.primary` | `--lc-color-text-primary` | `tokens.color.text.primary` |
| `color/text/secondary` | `color.text.secondary` | `--lc-color-text-secondary` | `tokens.color.text.secondary` |
| `color/text/inverse` | `color.text.inverse` | `--lc-color-text-inverse` | `tokens.color.text.inverse` |
| `color/surface/page` | `color.surface.page` | `--lc-color-surface-page` | `tokens.color.surface.page` |
| `color/surface/raised` | `color.surface.raised` | `--lc-color-surface-raised` | `tokens.color.surface.raised` |
| `color/surface/sunken` | `color.surface.sunken` | `--lc-color-surface-sunken` | `tokens.color.surface.sunken` |
| `color/surface/overlay-scrim` | `color.surface.overlay-scrim` | `--lc-color-surface-overlay-scrim` | `tokens.color.surface['overlay-scrim']` |
| `color/border/default` | `color.border.default` | `--lc-color-border-default` | `tokens.color.border.default` |
| `color/border/strong` | `color.border.strong` | `--lc-color-border-strong` | `tokens.color.border.strong` |
| `color/interactive/primary` | `color.interactive.primary` | `--lc-color-interactive-primary` | `tokens.color.interactive.primary` |
| `color/interactive/primary-hover` | `color.interactive.primary-hover` | `--lc-color-interactive-primary-hover` | `tokens.color.interactive['primary-hover']` |
| `color/interactive/on-primary` | `color.interactive.on-primary` | `--lc-color-interactive-on-primary` | `tokens.color.interactive['on-primary']` |
| `color/interactive/subtle-bg` | `color.interactive.subtle-bg` | `--lc-color-interactive-subtle-bg` | `tokens.color.interactive['subtle-bg']` |
| `color/focus/ring` | `color.focus.ring` | `--lc-color-focus-ring` | `tokens.color.focus.ring` |
| `color/feedback/error-fg` | `color.feedback.error-fg` | `--lc-color-feedback-error-fg` | `tokens.color.feedback['error-fg']` |
| `color/feedback/error-bg` | `color.feedback.error-bg` | `--lc-color-feedback-error-bg` | `tokens.color.feedback['error-bg']` |

## Primitives

Palette colors follow the same rule: `color/palette/green-900` ↔
`color.palette.green-900` ↔ `--lc-color-palette-green-900`. Semantic tokens alias
primitives with DTCG `{...}` references; the build script resolves them.

| Proposed Figma Variable | tokens.json path | CSS variable |
|---|---|---|
| `space/1` … `space/8` | `space.1` … `space.8` | `--lc-space-1` … `--lc-space-8` |
| `font/family/base`, `font/family/mono` | `font.family.base`, `font.family.mono` | `--lc-font-family-base`, `--lc-font-family-mono` |
| `font/size/xs` … `font/size/2xl` | `font.size.xs` … `font.size.2xl` | `--lc-font-size-xs` … `--lc-font-size-2xl` |
| `font/weight/regular|medium|semibold` | `font.weight.regular|medium|semibold` | `--lc-font-weight-*` |
| `radius/sm|md|lg|pill` | `radius.sm|md|lg|pill` | `--lc-radius-*` |
| `duration/fast|normal|slow` | `duration.fast|normal|slow` | `--lc-duration-*` |
| `easing/standard|emphasized` | `easing.standard|emphasized` | `--lc-easing-*` |
| `z-index/sticky|overlay|drawer` | `z-index.sticky|overlay|drawer` | `--lc-z-index-*` |

## Mode strategy

- **Default mode only** in this demo. The token graph is mode-ready: dark mode
  would be a second *mode* of the same tokens (re-pointing semantic aliases at
  different primitives), never a parallel set of token names. Component CSS only
  ever references semantic variables, so adding a mode touches zero components.
- **RTL is a direction dimension, not a token mode.** No `*-left`/`*-right`
  tokens exist; all spacing in component CSS uses logical properties
  (`margin-inline-start`, `inset-inline-end`, `padding-block-*`), so flipping
  `dir="rtl"` mirrors the layout without any token or stylesheet change.

Light theme overrides are maintained in `src/styles/themes.css`; the generated base token files describe the dark foundation. Component/variant parity and automatic Code Connect synchronization are not claimed.
