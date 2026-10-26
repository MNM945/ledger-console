# Internationalization and accessibility review guide

## Implemented behavior

- English and Arabic labels include filters, recovery, status names, timeline notes and the demo-state selector. Switching to Arabic sets document language and RTL; switching back to English restores LTR.
- Money uses Intl formatting with ISO currency codes and bidirectional isolation. Arabic currently uses Latin digits by deliberate demo convention. Names and references remain fixture content and are isolated using `bdi`.
- Dates are formatted for the selected locale with an explicit UTC label. There is no user-timezone preference in this prototype.
- Long counterparties and unbroken references wrap without truncating identifiers. The table retains horizontal scrolling within a labelled, keyboard-focusable region on narrow screens.
- Native controls have visible labels and a 44px minimum target. Status words and icons supplement colors. Visible focus, a skip link, polite result-count announcements and reduced-motion handling are provided.
- Rows open using Enter or Space. The details drawer contains Tab navigation, closes with Escape and restores focus to its invoking row. Loading exposes a busy status; errors use alerts.

## Manual review matrix

| Task | Expected behavior |
| --- | --- |
| Tab from page start | Skip link and controls have visible focus and a logical order |
| Change filters | Updated result count is announced without interrupting each keystroke |
| Enter / Space on a row | Drawer opens; Tab stays within it; Escape returns to the row |
| Select permission denied or expired session | No transaction rows or filters remain exposed; action explains local recovery |
| Choose persistent loading | Skeleton remains inspectable; the header still permits selecting Normal |
| Choose no transactions vs an unmatched query | Distinct explanations; only filtered empty offers clear filters |
| Choose long text at a narrow width | Full names and references remain available; page-level overflow is avoided |
| Arabic + RTL + light/dark | Labels mirror, identifiers remain readable and money retains an explicit currency |
| Submit an empty Controls story | The error is linked to the input and is announced; disabled form is inert |

This is a review checklist, not a claim that every task has been retested in every browser. Native-speaker proofreading, assistive-technology testing, zoom/high-contrast coverage and broader locale testing remain open. See VALIDATION.md for recorded checks. No WCAG certification is claimed.
