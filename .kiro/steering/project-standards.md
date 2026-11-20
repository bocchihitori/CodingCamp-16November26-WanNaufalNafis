# Project Standards — To-Do Life Dashboard

## Overview
RevoU CodingCamp assignment project.
Repository: `CodingCamp-16November26-WanNaufalNafis`

## Technology Constraints
- **HTML** — structure only (`index.html` at repository root)
- **CSS** — styling only (exactly one file: `css/style.css`)
- **JavaScript** — vanilla only, no frameworks (exactly one file: `js/script.js`)
- **No backend** — static files only, deployable to GitHub Pages
- **Persistence** — browser `localStorage` exclusively

## File Structure Rules
```
/
├── index.html          ← entry point, must stay at root
├── css/
│   └── style.css       ← single CSS file
├── js/
│   └── script.js       ← single JS file
├── .kiro/              ← Kiro IDE configuration (preserve for submission)
├── .gitignore
└── README.md
```

## Coding Standards
- All asset paths must be relative (e.g. `css/style.css`, `js/script.js`)
- No absolute local paths (no `C:\`, `D:\`, `file://`)
- No CDN links (no Google Fonts, Font Awesome, external JS libraries)
- System font stack only: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- CSS custom properties for theming (`[data-theme="light"]` / `[data-theme="dark"]`)
- All `localStorage` reads wrapped in `try/catch` with safe fallbacks
- No `console.log` left in production code

## localStorage Keys
| Key        | Type         | Purpose                        |
|------------|--------------|--------------------------------|
| `tasks`    | JSON array   | To-Do task objects             |
| `theme`    | string       | `"light"` or `"dark"`          |
| `userName` | string       | Custom greeting name           |
| `links`    | JSON array   | Quick Link objects             |

## Forbidden
- React, Vue, Angular, Svelte, or any JS framework
- jQuery or any external JS library
- Any backend (Node.js, Express, PHP, etc.)
- Any external database (Firebase, Supabase, MongoDB, etc.)
- `fetch()` calls to remote APIs
- Additional CSS or JS files beyond the one allowed each
