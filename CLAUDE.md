# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static bilingual website for **Further Finance (鉴远金融)**, an Australian financial services company.

- Reference site: https://furtherfinance.com.au/
- GitHub repo: https://github.com/gavinw2006/FurtherFinance (branch: `main`)
- Git identity: `user.name = 3WE`, `user.email = 3w2026@gmail.com` — set locally in repo after `git init`
- Push auth: `gh` CLI — run `gh auth setup-git` if push fails

## Dev Commands

```bash
open index.html          # preview English root
open cn/index.html       # preview Chinese root
```

No build step, no package manager. All files are served directly from disk.

## Structure

```
FF/
├── index.html / about.html / contact.html   # English root pages
├── services/                                 # English service pages
├── cn/                                       # Simplified Chinese mirror (identical structure)
│   ├── index.html / about.html / contact.html
│   └── services/
├── css/style.css                            # Single shared stylesheet
├── js/main.js                               # Single shared script
└── images/                                  # Logo and assets
```

## Relative Path Rules

Every page must reference CSS, JS, and logo hrefs using paths relative to its own depth:

| Page location               | CSS/JS path             | Logo href          |
|-----------------------------|-------------------------|--------------------|
| Root EN (`*.html`)          | `css/style.css`         | `index.html`       |
| Service EN (`services/`)    | `../css/style.css`      | `../index.html`    |
| Root CN (`cn/`)             | `../css/style.css`      | `../index.html`    |
| Service CN (`cn/services/`) | `../../css/style.css`   | `../../index.html` |

## Bilingual Sync Rule

English (root) and Chinese (`cn/`) must stay in sync at all times — identical structure, fonts, colors, and layout. Any change to an EN page must be mirrored to the corresponding CN page with fully translated content. No mixed-language pages.

## Code Rules

- Pure static HTML/CSS/JS — no framework, no build tool, no package manager
- One stylesheet (`css/style.css`), one script (`js/main.js`)
- Keep the company logo unchanged
- Keep code minimal — no unused CSS/JS, no abstractions beyond what is needed

## Git Rules

- Always ask permission before `git push`
- `git init` the repo locally, set the remote to `https://github.com/gavinw2006/FurtherFinance`, and set local git identity before first push
