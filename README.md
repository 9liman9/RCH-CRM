# RCH Finance Department — CRM System Vision

> **Prepared by:** Suleiman Mussa, Finance Department  
> **Date:** March 2026  
> **Status:** Vision Document + Interactive Prototype  
> **Confidential** — For IT & Management Reference

---

## Overview

This repository contains the complete vision document, interactive prototype, and supporting assets for the proposed CRM system for the Finance Department at **Rapid Clearing House (RCH)** and **RCH Business Solutions W.L.L. (RCHBS)**.

The goal of this project is to replace the current paper-based, manual finance processes with a digital CRM system that:

- Eliminates paper dependency (receipts, invoices, PVs, binders)
- Automates invoice creation with a 2-step drag-and-drop workflow
- Provides real-time visibility into spending, receivables, and card balances
- Introduces client spending limits visible to Account Managers
- Syncs all data to the accounting software automatically (no double entry)
- Supports VAT readiness (Qatar VAT: June 2026 intro, Jan 2027 implementation)

---

## Repository Structure

```
RCH-CRM/
├── README.md                              # This file
├── CHANGELOG.md                           # Version history (semver)
├── CLAUDE.md                              # AI assistant guide for this codebase
├── package.json                           # Node.js deps (docx only)
├── .gitignore
│
├── docs/
│   ├── index.html                         # GitHub Pages site (mirrors prototype)
│   ├── .nojekyll                          # Prevents GitHub Pages Jekyll processing
│   ├── RCH_CRM_System_Vision.docx         # Generated Word vision document
│   ├── RCH - price list 2025.pdf
│   ├── RCHBS - price list 2024.pdf
│   ├── RCH Invoice Template.pdf
│   ├── RCHBS Invoice Template.pdf
│   └── *.xlsm                             # Macro-enabled invoice Excel templates
│
├── prototype/
│   └── index.html                         # Interactive SPA prototype (~5000 lines)
│
├── flowcharts/
│   ├── src/                               # Graphviz DOT source files (editable)
│   │   ├── ideal_system.dot
│   │   ├── current_invoice_lifecycle.dot
│   │   └── current_money_flow.dot
│   └── rendered/                          # PNG renders at 200 DPI
│       ├── ideal_system.png
│       ├── current_invoice_lifecycle.png
│       └── current_money_flow.png
│
├── scripts/
│   └── generate_document.js               # Node.js script — generates the .docx file
│
└── assets/
    └── rch_logo.jpg                       # RCH brand logo
```

---

## Documents

### Vision Document (`docs/RCH_CRM_System_Vision.docx`)

The main deliverable. 17 sections covering:

| # | Section | Description |
|---|---------|-------------|
| 1 | Where We Are Today | Brief current-state summary with pain points |
| 2 | What We Want to Achieve | CFO's 4 goals: zero errors, finance autonomy, real-time visibility, spending limits |
| 3 | The Ideal System: Overview | High-level flow diagram with all roles |
| 4 | Client Setup | Onboarding wizard, retainer vs per-job, agreements, custom invoice fields |
| 5 | Services Offered | Service categories for Rapid and RCHBS |
| 6 | Service Flow | Client → AM → OPs → AM logs → Elena → Gabi → Verified (with Elena bypass for Finance/TL) |
| 7 | Invoicing | Batch generation, invoice approval workflow (accountant → manager), 3 invoice types |
| 8 | Price List Management | Managed by Elena, auto-applied, custom rates per client |
| 9 | Card Management | Dynamic card CRUD, per-card transaction ledgers, payment method tracking |
| 10 | Payment Tracking | Opening balances, payment matching, receivables, proactive follow-up |
| 11 | PVs and RVs | Semi-automatic creation with Finance approval |
| 12 | Bank Reconciliation | Auto-match with exception handling, paper card statement limitation |
| 13 | Filing and Archiving | Digital-first with paper savings, minimal physical backup |
| 14 | Accounting Software + VAT | Software-agnostic integration, VAT readiness for Jan 2027 |
| 15 | Dashboards | 5 role-based views: Finance, AM, Elena, Gabi, Management/CFO |
| 16 | Permissions & Roles | Tag-based permission system with 23 tags, role management UI, per-user overrides |
| 17 | Glossary | All terms and abbreviations |

### Interactive Prototype (`prototype/index.html`)

A fully clickable HTML prototype demonstrating the key CRM screens. **Just double-click to open in any browser** — no installation needed.

Screens included:
- **Dashboard** — Finance home screen with uninvoiced services, overdue alerts, invoice status
- **Invoicing** — Batch invoice workflow with client-grouped selection and invoice approval/rejection
- **Clients** — Spending limits with progress bars, retainer/per-job badges, custom invoice flags
- **Client Onboarding** — Step-by-step wizard for AMs/TL to register new clients
- **Cards** — Dynamic card management with per-card transaction ledgers, add/edit/deactivate
- **Schedule** — Visual timeline for recurring and annual invoices
- **Role Management** — Create/edit roles, assign permission tags per role or per user
- **AM View** — Account Manager service logging flow with multi-service support and completion stage
- **Elena View** — AM Team Leader approval queue for submitted services
- **Gabi View** — Expense tracking with compact Card Health summary and top-up management
- **CFO View** — Management dashboard with pipeline metrics

Mock data includes 4 seed clients (Al Jazeera Trading, Gulf Pearl Marine, DAE, Crescent Bay Hospitality) with realistic service data.

**Demo logins** (select user from dropdown — no real authentication):

| User | Role |
|------|------|
| Admin | Super Admin (all permissions) |
| Violetta A. | Account Manager |
| Vongai K. | Account Manager |
| Elena F. | Team Leader |
| Gabi D. | Expense Tracker |
| Arlene M. | Accounting Manager |
| Suleiman M. | Accountant |
| CFO | CFO |

---

## Flowcharts

Source files are in Graphviz DOT format. To re-render after editing:

```bash
# Install graphviz if needed
# Ubuntu: sudo apt install graphviz
# Mac: brew install graphviz

# Render all flowcharts
dot -Tpng -Gdpi=200 flowcharts/src/ideal_system.dot -o flowcharts/rendered/ideal_system.png
dot -Tpng -Gdpi=200 flowcharts/src/current_invoice_lifecycle.dot -o flowcharts/rendered/current_invoice_lifecycle.png
dot -Tpng -Gdpi=200 flowcharts/src/current_money_flow.dot -o flowcharts/rendered/current_money_flow.png
```

### Flowchart Descriptions

| File | Description |
|------|-------------|
| `ideal_system` | 3-phase layout: Request & Execution → Logging & Verification → Invoicing. Shows all roles (AM, OPs, Elena, Gabi, Finance, System). |
| `current_invoice_lifecycle` | Current weekly process from receipt printing through Gabi's check to Thursday sending + QuickBooks double-entry. |
| `current_money_flow` | How money flows out (bank → cards → govt fees), daily tracking (Gabi's Excel), and back in (client payments → bank recon → binders). |

---

## Regenerating the Vision Document

The Word document is generated programmatically using `docx-js`. To rebuild after editing:

```bash
# Prerequisites
npm install docx

# The script expects these files in the same directory:
# - rch_logo.jpg (from assets/)
# - flowchart_ideal_v3.png (from flowcharts/rendered/)
# - flowchart_invoice_v2.png (from flowcharts/rendered/)
# - flowchart_money_v2.png (from flowcharts/rendered/)

# Copy assets to working directory
cp assets/rch_logo.jpg .
cp flowcharts/rendered/ideal_system.png flowchart_ideal_v3.png
cp flowcharts/rendered/current_invoice_lifecycle.png flowchart_invoice_v2.png
cp flowcharts/rendered/current_money_flow.png flowchart_money_v2.png

# Generate
node scripts/generate_document.js
```

The script outputs `RCH_CRM_Vision_v2.docx` in the current directory.

---

## Key People

| Name | Role | System Role |
|------|------|-------------|
| **CFO** | Chief Financial Officer | Sets goals, approves strategy, management dashboard |
| **Arlene** | Accounting Manager | Finance Department — invoice creation, PVs, bank recon |
| **Suleiman** | Finance Department | Invoice creation, PVs, bank recon, document author |
| **Elena** | AM Team Leader | Reviews AM submissions, manages price lists |
| **Gabi** | Expense Tracking | Daily card expense logging, payment verification via SMS |
| **Account Managers** | Client-facing | Log service requests, upload receipts, client communication |
| **Operations** | Execution | Visit government offices, pay fees, collect receipts |

---

## Company Structure

| Entity | Full Name | Bank | CR No. |
|--------|-----------|------|--------|
| **Rapid** | Rapid Clearing House W.L.L. | QNB (Corniche Road) | 51552 |
| **RCHBS** | RCH Business Solution W.L.L. | QNB (Salwa Corporate) | 109455 |

**Cards:**
- Rapid: 3 QNB Credit Cards
- RCHBS: 1 QNB Credit Card + 3 QNB Himyan Prepaid Cards

---

## Upcoming Considerations

- **VAT**: Qatar introducing June 2026, implementation January 2027. System must be VAT-ready.
- **Accounting Software Migration**: Likely moving away from QuickBooks. CRM integration should be software-agnostic.
- **OPs Direct Entry**: Future phase — OPs logging services directly from phones at government offices.
- **Automated Invoice Sending**: Delivery method (manual email vs system-automated) TBD.

---

## Tech Stack (Document Generation)

- **Document**: [docx-js](https://github.com/dolanmiu/docx) (Node.js)
- **Flowcharts**: [Graphviz](https://graphviz.org/) DOT format
- **Prototype**: Vanilla HTML/CSS/JS (zero npm dependencies)
- **PDF export**: html2pdf.js (CDN) — download invoices as PDF
- **PDF preview**: PDF.js (CDN) — render PDF receipts inline
- **Brand**: RCH logo, Navy #1B2D5E, Magenta #C4006A

---

## License

**CONFIDENTIAL** — Internal use only. All contents are proprietary to Rapid Clearing House and RCH Business Solutions W.L.L.
