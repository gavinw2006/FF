# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static bilingual website for **Further Finance Group (鉴远金融)**, an Australian mortgage broker in Camberwell, Melbourne.

- GitHub repo: <https://github.com/gavinw2006/FF> (branch: `main`)
- Git identity: `user.name = 3WE`, `user.email = 3w2026@gmail.com` (set locally)
- Auto-deploy: Hostinger webhook fires on every push to `main`
- Always ask permission before `git push`

## Dev Commands

```bash
open index.html        # preview English root
open cn/index.html     # preview Chinese root
```

No build step, no package manager.

## Structure

```
FF/
├── index.html / about.html / contact.html / interest-rates.html  # EN root pages
├── services/          # 6 EN service pages
├── tools/             # property-valuation.html
├── cn/                # Full Chinese mirror — same structure as root
│   ├── services/
│   └── tools/
├── css/style.css      # Single shared stylesheet
├── js/main.js         # Single shared script (nav, tabs, form AJAX)
└── images/            # logo-ff.png (PNG wordmark)
```

## Relative Path Rules

Every page must use depth-correct relative paths for CSS, JS, and logo:

| Location                       | CSS/JS path             | Logo/nav root href   |
|--------------------------------|-------------------------|----------------------|
| Root EN (`*.html`)             | `css/style.css`         | `index.html`         |
| `services/` or `tools/`        | `../css/style.css`      | `../index.html`      |
| Root CN (`cn/`)                | `../css/style.css`      | `../index.html`      |
| `cn/services/` or `cn/tools/`  | `../../css/style.css`   | `../../index.html`   |

Footer Company section uses the same depth rules for internal links (e.g. `tools/property-valuation.html` from root, `../tools/property-valuation.html` from `services/`).

## Bilingual Sync Rule

EN and CN must stay in sync — identical structure, layout, and CSS classes. Any change to an EN page must be mirrored to the corresponding CN page with fully translated content. Use Python batch scripts for changes that span many files.

## Forms

All `<form class="enquiry-form">` elements are handled by `js/main.js`, which POSTs field data as JSON to `https://formsubmit.co/ajax/info@furtherfinance.com.au`. Requirements for each form:

- `name` attribute on every `<input>`, `<select>`, `<textarea>`
- `<input type="hidden" name="_subject" value="…">` to set the email subject
- Submit button must have `type="submit"` and a `data-success="…"` attribute for the confirmation message

## Nav Dropdown Behaviour

The Services and Tools dropdowns use a CSS `::after` pseudo-element bridge on `.nav-dropdown` to keep hover active across the gap between the trigger link and the panel. Do not remove it — the submenu becomes unreachable by mouse without it.
