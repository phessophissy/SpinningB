# Explorer Metrics Collection

## Purpose
Define a repeatable process for Explorer Metrics Collection in the SpinningB repository.

## Why It Matters
- Keeps gameplay, contract, and frontend changes aligned with production behavior.
- Reduces regressions by using consistent checks before merge and release.
- Documents operational ownership for support and maintenance.

## Preconditions
- Repository cloned and dependencies installed (npm install).
- Clarinet available locally (clarinet --version).
- Branch context: docs/pr07-observability.

## Procedure
1. Review contract expectations in contracts/spinning-board.clar related to Explorer Metrics Collection.
2. Verify frontend behavior in frontend/app.js and matching UI cues in frontend/index.html.
3. Validate tests in tests/spinning-board_test.ts and add coverage if a gap exists.
4. Run npm run build and npm test before opening or updating a PR.
5. Record outcomes in PR notes with the exact commands and observed results.

## Validation Checklist
- [ ] Contract behavior for Explorer Metrics Collection is documented and verified.
- [ ] Frontend flow and contract calls stay consistent.
- [ ] Test coverage exists for happy-path and failure-path scenarios.
- [ ] README and contributor guidance remain accurate after changes.

## Related Files
- contracts/spinning-board.clar
- frontend/app.js
- frontend/index.html
- tests/spinning-board_test.ts
- README.md
- CONTRIBUTING.md

## Metadata
- Theme: Observability
- Topic number: 2
- Last updated via branch: docs/pr07-observability
