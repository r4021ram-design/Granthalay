# Environment Rule: No Browser Subagent

- **NEVER attempt to call `browser_subagent` in this workspace.**
- Playwright driver download is blocked/404 on Windows in this environment.
- Rely strictly on `npm test`, `npm run build`, or instruct the user to view in their already running browser at `http://localhost:5173`.
