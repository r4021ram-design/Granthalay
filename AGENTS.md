# Workspace Rules & Environment Constraints

## Critical Tooling Constraint: Browser Subagent Disabled
- **NEVER use the `browser_subagent` tool** in this workspace.
- **Reason**: Playwright driver installation consistently fails with a `404 Not Found` from `https://playwright.azureedge.net/builds/driver/playwright-*-win32_x64.zip` in this Windows environment. Calling `browser_subagent` always causes a breakdown and wastes time.
- **Verification Alternatives**:
  1. Automated testing via Vitest: `npm test` or `npx vitest run <test-path>`.
  2. Build & TypeScript compilation: `npm run build` (`tsc -b && vite build`).
  3. Server / API verification: direct requests via curl / node scripts if needed.
  4. Prompt the user to inspect the running app directly at `http://localhost:5173` in their own browser.
