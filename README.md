# Arrow's Impossibility Theorem

An interactive exploration of fairness in voting systems.

This single-page web app walks through Arrow's Impossibility Theorem with interactive visualizations. Drag-and-drop preference orderings, compare voting methods side by side, and try to build a voting rule that satisfies all four fairness criteria at once.

## What's inside

- **Voting algorithms** - Plurality, Borda Count, Instant Runoff, Condorcet, and Approval voting, implemented as pure functions with full test coverage.
- **Criteria checkers** - Automated verification of Arrow's four criteria (unrestricted domain, unanimity, independence of irrelevant alternatives, non-dictatorship) against any social welfare function.
- **Interactive sandbox** - Build your own voting rule and watch the criteria checker test it in real time.
- **Proof walkthrough** - A visual sketch of Arrow's proof in four steps.

## Development

```bash
pnpm install
pnpm dev
```

## Testing

```bash
pnpm test          # Unit tests
pnpm test:e2e      # Playwright E2E tests
pnpm lint          # ESLint
pnpm typecheck     # TypeScript strict mode
```

## Tech stack

Vite, React, TypeScript, Tailwind CSS v4, Motion, dnd-kit.

## License

MIT
