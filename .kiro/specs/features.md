# Feature Specification — To-Do Life Dashboard

## Implemented MVP Features

### 1. Greeting, Clock & Date
- Time-based greeting phrase (Good morning / Good afternoon / Good evening)
  - 05:00–11:59 → Good morning
  - 12:00–17:59 → Good afternoon
  - 18:00–04:59 → Good evening
- 24-hour live clock in `HH:MM:SS` format, updated every second via `setInterval`
- Current date in Indonesian format using `Intl.DateTimeFormat("id-ID")`
  - Example: `Kamis, 19 November 2026`

### 2. Focus Timer
- Default duration: 25 minutes (1500 seconds)
- Display: `MM:SS` format
- Controls: Start, Pause, Reset
- Guard against multiple simultaneous `setInterval` instances
- Auto-stops and locks at `00:00`
- Visual state: `.timer--running` (blue) and `.timer--finished` (green) CSS classes

### 3. To-Do List
- **Add**: text input + button (also triggers on Enter key)
- **Edit**: inline edit mode — pencil button swaps text for input + Save/Cancel
- **Mark done**: checkbox toggles `completed` state with strikethrough styling
- **Delete**: ✕ button removes task
- **Filter**: All / Active / Completed filter buttons
- **Persist**: saved to `localStorage` key `"tasks"` as JSON array `[{id, text, completed}]`
- **Duplicate prevention** (Challenge C3): case-insensitive trimmed comparison on add and edit

### 4. Quick Links
- **Add**: name input + URL input + button
- **Open**: `<a target="_blank" rel="noopener noreferrer">` — opens in new tab
- **Delete**: ✕ button
- **URL normalisation**: auto-prepends `https://` if missing
- **Persist**: saved to `localStorage` key `"links"` as JSON array `[{id, name, url}]`

## Implemented Challenges (exactly 3)

### C1 — Light / Dark Mode
- Toggle button in header switches `data-theme` attribute on `<html>`
- Theme persisted to `localStorage` key `"theme"`
- Restored on page load
- Icon changes: 🌙 (light mode) / ☀️ (dark mode)

### C2 — Custom Name in Greeting
- Name input + Save button in header
- Saved to `localStorage` key `"userName"`
- Restored on page load
- Defaults to "Friend" when empty
- Save also triggers on Enter key

### C3 — Prevent Duplicate Tasks
- On **add**: `isDuplicate()` checks all existing tasks (case-insensitive, trimmed)
- On **edit**: `doSave()` checks all tasks except the one being edited
- Animated inline error message shown; clears on next keystroke
- Duplicate is blocked — task is not added or saved

## Not Implemented (intentionally excluded)
- Challenges 4 and 5 from the brief (not selected)
- Backend, server-side code, or remote database
- Any external library or framework
