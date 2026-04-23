---
name: Skip build verification
description: Don't run npm run build to verify after edits unless explicitly asked
type: feedback
---

Do not run `npm run build` (or `tsc -b`) to verify changes after editing files unless the user explicitly asks for it.

**Why:** User finds it unnecessary and interrupts those tool calls.
**How to apply:** After writing/editing code files, just report what was done without running a build step.
