# CLAUDE.md — RCH-CRM Repository Guide

> For AI assistants working on this codebase. Keep this file updated as the project evolves.

---

## What This Project Is

This is a **vision document + interactive prototype** for a proposed CRM system for the Finance Department at **Rapid Clearing House (RCH)** and **RCH Business Solutions W.L.L. (RCHBS)**, two related Qatari legal entities.

**It is NOT a production application.** There is no backend, no database, no authentication system, and no deployment pipeline. The prototype is a single self-contained HTML file opened directly in a browser. The purpose is to communicate requirements to the IT team and management stakeholders.

Current version: **v0.6.0** (see `CHANGELOG.md` for history).

---

## Repository Structure

```
RCH-CRM/
├── CLAUDE.md                              # This file
├── README.md                              # Human-readable project overview
├── CHANGELOG.md                           # Version history (semver)
├── package.json                           # Node.js deps (docx only)
├── package-lock.json
├── .gitignore
├── assets/
│   └── rch_logo.jpg                       # Brand logo (used in Word doc)
├── docs/
│   ├── index.html                         # GitHub Pages site (mirrors prototype)
│   ├── .nojekyll                          # Prevents GitHub Pages Jekyll processing
│   ├── RCH_CRM_System_Vision.docx         # Generated Word vision document
│   ├── RCH - price list 2025.pdf
│   ├── RCHBS - price list 2024.pdf
│   ├── RCH Invoice Template.pdf
│   ├── RCHBS Invoice Template.pdf
│   └── *.xlsm                             # Macro-enabled invoice Excel templates
├── prototype/
│   └── index.html                         # Interactive SPA prototype (~5000 lines)
├── flowcharts/
│   ├── src/
│   │   ├── ideal_system.dot               # Graphviz source — proposed future state
│   │   ├── current_invoice_lifecycle.dot  # Graphviz source — current weekly process
│   │   └── current_money_flow.dot         # Graphviz source — current money flow
│   └── rendered/
│       ├── ideal_system.png               # 200 DPI PNG (committed to git)
│       ├── current_invoice_lifecycle.png
│       └── current_money_flow.png
└── scripts/
    └── generate_document.js               # Node.js script — generates the .docx file
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Prototype / GitHub Pages | Vanilla HTML5 + CSS3 + JavaScript (zero npm dependencies) |
| Data persistence | Browser `localStorage` only |
| Document generation | Node.js + [`docx`](https://github.com/dolanmiu/docx) v9.6.1 |
| Flowcharts | [Graphviz](https://graphviz.org/) DOT format |
| Fonts | Google Fonts — Inter family (loaded via CDN in prototype) |
| PDF export | html2pdf.js (loaded via CDN in prototype) |
| PDF preview | PDF.js (loaded via CDN in prototype) |

**Only npm dependency:** `docx@^9.6.1` — used exclusively in `scripts/generate_document.js`.

---

## Critical Rule: Keep Prototype and GitHub Pages in Sync

**Whenever `prototype/index.html` is changed, `docs/index.html` MUST also be updated in the same commit.**

These two files are identical in content. `docs/index.html` is the GitHub Pages deployment of the prototype. They must always stay in sync. Never commit a change to one without updating the other.

---

## Document Regeneration Policy

The Word document (`docs/RCH_CRM_System_Vision.docx`) is generated from `scripts/generate_document.js`. It should be **regenerated at version milestones** (new CHANGELOG entry with a version bump), not on every prototype change.

Steps to regenerate:
```bash
npm install   # ensures docx is installed

# Copy assets to the project root (script looks for them here)
cp assets/rch_logo.jpg .
cp flowcharts/rendered/ideal_system.png flowchart_ideal_v3.png
cp flowcharts/rendered/current_invoice_lifecycle.png flowchart_invoice_v2.png
cp flowcharts/rendered/current_money_flow.png flowchart_money_v2.png

# Generate
node scripts/generate_document.js
# Outputs: RCH_CRM_Vision_v2.docx in the project root

# Move to docs/
mv RCH_CRM_Vision_v2.docx docs/RCH_CRM_System_Vision.docx

# Clean up temp copies
rm rch_logo.jpg flowchart_*.png
```

---

## Flowchart Rendering

To re-render flowcharts after editing `.dot` source files:
```bash
# Requires Graphviz: sudo apt install graphviz  OR  brew install graphviz
dot -Tpng -Gdpi=200 flowcharts/src/ideal_system.dot -o flowcharts/rendered/ideal_system.png
dot -Tpng -Gdpi=200 flowcharts/src/current_invoice_lifecycle.dot -o flowcharts/rendered/current_invoice_lifecycle.png
dot -Tpng -Gdpi=200 flowcharts/src/current_money_flow.dot -o flowcharts/rendered/current_money_flow.png
```

PNG renders are committed to git (see `.gitignore`).

---

## Running the Prototype

No build step. Just open the file:
```bash
open prototype/index.html   # macOS
xdg-open prototype/index.html   # Linux
# Or double-click the file in Finder/Explorer
```

The prototype loads fully from localStorage seed data. No network required after initial load (fonts/CDN assets load from internet).

**Demo logins** (no real authentication — select user from dropdown, password `rch2026` for all except admin):
| ID | Name | Role |
|----|------|------|
| `admin` | Admin | Super Admin (all permissions) |
| `violetta` | Violetta A. | Account Manager |
| `vongai` | Vongai K. | Account Manager |
| `elena` | Elena F. | Team Leader |
| `gabi` | Gabi D. | Expense Tracker |
| `arlene` | Arlene M. | Accounting Manager |
| `suleiman` | Suleiman M. | Accountant |
| `cfo` | CFO | CFO |

---

## Prototype Architecture

### Single-File SPA
`prototype/index.html` is a single ~5000-line file containing all HTML, CSS, and JavaScript. This is intentional — makes it trivially shareable and editable by non-developers.

### State Management
A global state object `S` with a reactive `.set(patch)` method:
```javascript
S.set({ page: 'invoicing', user: 'arn' })  // triggers re-render
```

### Role-Based Views
Each user role maps to a dedicated view function:
- `vFinance()` — Invoice queue, dashboard, batch operations
- `vAM()` — Service logging, client management, multi-service completion
- `vElena()` — AM submission review and approval
- `vGabi()` — Expense/payment verification dashboard
- `vCFO()` — Management overview with pipeline metrics

### Permission System
A tag-based permission system with 23 granular tags across three categories:
- **Navigation** — controls which views a user can access (`view-dashboard`, `view-finance`, etc.)
- **Actions** — controls what a user can do (`can-approve`, `can-invoice`, `can-manage-roles`, etc.)
- **Data Scope** — controls data visibility (`scope-own-clients`, `scope-all-logs`, etc.)

Roles define default tag sets. Per-user tag overrides are stored separately. The `hasTag(tag)` helper checks the current user's effective tags.

### LocalStorage Schema
Data is stored with version-pinned keys to allow schema migration:
| Key | Contents |
|-----|----------|
| `rch_logs_v8` | Service logs array |
| `rch_invoices_v2` | Generated invoices array (with approval status) |
| `rch_clients_v3` | Client directory array |
| `rch_cards_v1` | Company cards (dynamic, seeded from static `CARDS`) |
| `rch_topups_v1` | Card top-up transactions |
| `rch_receipts_v1` | Receipt attachments |
| `rch_roles_v1` | Custom role definitions |
| `rch_user_tags_v1` | Per-user permission tag overrides |
| `rch_services_custom_v1` | Custom service definitions |

**Never change a version key without also writing a migration function** (`migrateInvoices()` pattern exists for reference).

### Rendering Pattern
Template literals + `.map()` for lists, assigned to `innerHTML`:
```javascript
container.innerHTML = items.map(i => `<div class="card">${i.name}</div>`).join('')
```

Inline CSS custom properties for per-instance theming:
```javascript
`<div class="stat" style="--sc:var(--navy)">`
```

---

## ID & Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Service log IDs | `LOG-###-XXXX` | `LOG-001-ABC5` |
| Request IDs | `REQ-{timestamp}` | `REQ-1741776000000` |
| Client IDs | `c-{8chars}` | `c-3f9a1b2d` |
| Service IDs | kebab-case | `prem-reg-entity` |
| Card IDs | `card-{n}` | `card-1` |
| Timestamps | ISO 8601 | `2026-03-12T09:00:00.000Z` |

**JavaScript functions:**
- View functions: `v{RoleName}()` — `vFinance`, `vAM`, `vElena`
- Event handlers: `handle{Action}()` — `handleLogin`, `handleLogout`
- Formatters: `fmt()`, `fmtDate()`, `fmtDT()`, `numToWords()`
- DB helpers: `dbLoad()`, `dbSave()`, `dbGet()`, `dbAdd()`, `dbUpdate()`, `dbReset()`
- Card helpers: `dbGetCards()`, `dbSaveCards()`, `dbAddCard()`, `dbUpdateCard()`
- Permission helpers: `hasTag()`, `getTagsForUser()`, `rolesGet()`, `userTagsGet()`

---

## Service Status Workflow

The canonical status progression for service logs:

```
ops_pending → am_completing → pending → approved → expensed → invoiced → paid
                                    ↘ rejected
```

| Status | Owner | Meaning |
|--------|-------|---------|
| `ops_pending` | Operations | Awaiting physical execution |
| `am_completing` | Account Manager | AM adding service details/receipts |
| `pending` | Elena | Submitted, awaiting Elena's review |
| `approved` | Gabi | Elena approved; awaiting Gabi expense verification |
| `expensed` | Finance | Gabi verified; ready for invoicing |
| `pending_approval` | Accounting Manager | Invoice created by accountant, awaiting manager approval |
| `invoiced` | Finance | Invoice approved (or auto-approved if created by manager) |
| `paid` | Finance | Payment received |
| `rejected` | — | Rejected at `pending` stage by Elena |

---

## CSS Conventions

### Color Variables (defined in `:root`)
```css
--navy:    #1B2D5E    /* Primary brand — RCH navy */
--magenta: #C4006A    /* Secondary brand — RCH magenta */
--green:   #1a7a4a    /* Success / approved */
--orange:  #c97000    /* Warning / pending */
--red:     #c0272d    /* Error / rejected */
--purple:  #5c3d9e    /* Special states */
--g50 through --g900  /* Gray scale */
```

### Button Classes
`btn-primary`, `btn-navy`, `btn-success`, `btn-danger`, `btn-ghost`

### Status Badge Classes
`b-pending`, `b-approved`, `b-invoiced`, `b-paid`, `b-rejected`, `b-expensed`

### Key Component Classes
- `.card` — White card container with shadow
- `.stats-row` / `.stat` — Dashboard metric tiles
- `.stepper` — Multi-step workflow indicator
- `.log-card` — Service log entry card
- `.invoice-box` / `.inv-wrap` — Invoice display
- `.kanban-wrap` — Kanban board column layout

---

## Business Domain Reference

### Two Legal Entities
| Entity | Short Name | Bank Account | CR No. |
|--------|-----------|-------------|--------|
| Rapid Clearing House W.L.L. | Rapid | QNB Corniche Road | 51552 |
| RCH Business Solutions W.L.L. | RCHBS | QNB Salwa Corporate | 109455 |

All services, invoices, cards, and accounts must differentiate by company. This is a core architectural constraint throughout the prototype.

### Company Cards
- **Rapid**: 3 QNB Credit Cards (`card-1`, `card-2`, `card-3`)
- **RCHBS**: 1 QNB Credit Card (`card-4`) + 3 QNB Himyan Prepaid Cards (`card-5`, `card-6`, `card-7`)

### Client Types
- **Retainer** — Fixed monthly fee; RCH professional fee auto-set to 0 in service log
- **Per-Job** — Billed per service rendered

### Invoice Triggers
1. **Thursday weekly cycle** — Batch all uninvoiced services
2. **Spending limit reached** — Immediate invoice when client's limit is hit
3. **20-day uninvoiced rule** — Any service uninvoiced for 20+ days triggers immediate invoice

### Key People
| Name | Role | System Role |
|------|------|-------------|
| CFO | Chief Financial Officer | Management dashboard, goals |
| Arlene | Accounting Manager | Finance — invoicing, PVs, bank recon |
| Suleiman | Finance | Invoice creation, document author |
| Elena | AM Team Leader | Reviews AM submissions, manages price lists |
| Gabi | Expense Tracking | Daily card expense logging, payment verification |
| AMs | Account Managers | Log service requests, upload receipts |
| Operations | Execution | Visit government offices, pay fees |

---

## What NOT To Do

- **Do not add npm packages to the prototype.** It must remain zero-dependency and openable by double-clicking.
- **Do not introduce a backend, database, or server.** This is a prototype/vision document, not production software.
- **Do not change localStorage version keys** (`v8`, `v3`, `v2`, `v1`) without writing a migration function — changing keys silently drops all existing data.
- **Do not split `prototype/index.html` into multiple files.** Single-file portability is an intentional design constraint.
- **Do not regenerate the Word doc on every change** — only at version milestones.
- **Do not forget to update `docs/index.html`** whenever `prototype/index.html` changes.

---

## Git & Branch Conventions

- Main branch: `main` (remote) / `master` (local legacy)
- Feature branches: `claude/{description}-{session-id}` for AI-assisted work
- Commit style: imperative, lowercase, descriptive (e.g., `Add per-employee gov fee inputs`)
- PRs are squash-merged; CHANGELOG updated with each version bump

---

## Upcoming Considerations (from CHANGELOG & README)

- **VAT**: Qatar introducing June 2026, implementing January 2027. Prototype already includes VAT row on invoices.
- **Accounting Software**: Likely migrating from QuickBooks. CRM integration is designed software-agnostic.
- **OPs Direct Entry**: Future phase — Operations logging services directly from phones.
- **Automated Invoice Sending**: Delivery method (manual email vs system-automated) is still TBD.
