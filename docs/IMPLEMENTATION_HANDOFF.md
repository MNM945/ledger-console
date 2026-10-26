# Ledger Console implementation handoff

## Scope

One personal concept ledger page. Fictional data, no payment execution, wallet integration, real authentication or production customer results.

## Entry points

- `src/App.tsx`: page state, filters, sorting and selection.
- `src/data/transactions.ts`: 42 deterministic fixtures, six currencies, full/partial refund data.
- `src/data/api.ts`: local network/permission/session state simulation.
- `src/money.ts`: decimal normalization and integer minor-unit addition.
- `src/i18n.tsx`: English and Arabic labels and timeline content.
- `src/styles/themes.css`: light-mode semantic overrides and shared surfaces.
- `tokens/tokens.json`: base token source; generated CSS/TS must be rebuilt with `npm run build`.
- `.storybook/`: component catalogue configuration.
- `docs/DELIVERABLES.md`: all seven role-aligned deliverables and the review walkthrough.
- `docs/COMPONENT_GUIDE.md`: variants, financial/form contracts and honest Figma reference coverage.
- `docs/I18N_ACCESSIBILITY.md`: locale conventions and keyboard / RTL review matrix.

## Contracts

Money values are display/demo data, never instructions to execute a payment. All fixture currencies use two decimals. Refund credit equals principal returned plus fee returned; net debit equals original debit minus refund credit. The demo retains original fees. All dates display UTC. Currency sorting groups codes and does not perform FX conversion.

The drawer traps focus, supports Escape and restores the selected row. Statuses include text and icons. Blocked states suppress rows and filters. Recovery resets the local demo scenario and retains the user's filters.

The header also provides no-data, persistent-loading and long-text scenarios. Persistent loading is held in page state without leaving a request pending; choosing another scenario exits it. The Controls Storybook example demonstrates validation only and is not an execution form. Both themes are available through the Storybook toolbar.

## Build and delivery

`npm run build` regenerates tokens, checks TypeScript, builds the app, and emits both `Ledger Console.html` and `docs/index.html`. Both HTML files inline the same built JavaScript and CSS. `npm test` runs the money/refund checks. `npm run build-storybook` builds the component catalogue when development dependencies are installed.

`node scripts/sync-portfolio.mjs --portfolio /path/to/portfolio_01` updates only the Ledger Console article module, demo and selected screenshots in that portfolio. Its article source is `docs/portfolio.json`; other project articles are not rewritten.

## Verification limits

See `VALIDATION.md` and `UI_AUDIT_EN.md`. No production financial, legal, comprehensive accessibility or business-impact claim is implied by the demo.
