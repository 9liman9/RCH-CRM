# Changelog

All notable changes to the RCH CRM System Vision project.

## [0.6.0] - 2026-03-15

### Added
- **Role-based permission system** with 23 granular tags across Navigation, Actions, and Data Scope categories
- **Role Management UI** — create/edit roles, toggle permission tags per role or per user override
- **Admin super user** (`admin`/`admin`) with all permissions for system administration
- **Invoice approval workflow** — accountant-generated invoices require accounting manager approval; manager-generated invoices are auto-approved
- **Invoice rejection** reverts linked service logs to `expensed` status for re-invoicing; rejected invoices kept for audit trail
- **Dynamic card management** — cards moved from static array to localStorage (`rch_cards_v1`) with full CRUD: add, edit, deactivate
- **Per-card transaction ledger** showing debit/credit history with running balance
- **4 sample seed clients** — Al Jazeera Trading (Rapid/retainer), Gulf Pearl Marine (RCHBS/per-job), DAE (Rapid/per-job), Crescent Bay Hospitality (RCHBS/retainer)

### Changed
- Permission checks migrated from hardcoded role-type lookups to flexible tag-based system (`hasTag()`)
- Default role presets maintain backward-compatible behavior for all existing users
- Gabi dashboard redesigned — replaced cluttered card grid with compact Card Health summary using color-coded dot indicators
- Finance and Elena (TL) now bypass Elena's approval queue when completing services (status set directly to `approved`)
- Client data schema bumped to `rch_clients_v3`; service logs bumped to `rch_logs_v8`; invoices bumped to `rch_invoices_v2`

### Removed
- **Service line field** removed from service log form, state schema, and all data paths

### Fixed
- Gov fee input reset — multi-unit inputs now use `updateGovFeeTotal()` instead of full re-render on each keystroke
- Retainer client professional fee — distinguish empty string from zero so `unitPrice=0` is preserved instead of falling back to list price
- Receipt printing — heading and image wrapped in `.receipt-section` div with `page-break-inside:avoid` to prevent orphaned heading
- PDF/print quality — force exact color rendering, add orphan/widow controls, prevent row splitting, fix transparent backgrounds in downloaded PDFs

## [0.5.0] - 2026-03-12

### Added
- **PDF export** via html2pdf.js — download invoices as PDF directly from the browser
- **Receipt preview modal** with full-size view and download capability
- **Per-employee government fee inputs** when employee quantity exceeds 1
- **Invoice amendment** feature allowing accountants and AMs to edit submitted invoices
- **Purchase Order (PO) number** field on invoices, displayed in client info block
- **Multi-page invoice** support with automatic A4 pagination (up to 15 items on first page, 25 on continuation pages)
- **PDF.js canvas rendering** for PDF receipts attached to invoice line items
- **BU/CC pill tags** rendering business unit and cost centre as styled badges

### Changed
- Seed data updated to v7 with Al Meera Consumer Goods invoice (~40k, 11 varied service lines)
- Invoice service lines now sorted by total amount (highest first)
- VAT row made more prominent (bold navy text)
- Retainer clients: RCH professional fees auto-set to 0 in service log workflow
- Client dropdown in service wizard shows `· Retainer` or `· Per-Job` suffix

### Fixed
- Invoice print layout — fixed A4 page margins and overflow clipping
- Invoice totals computed live from line items for retainer clients

## [0.4.0] - 2026-03-10

### Added
- **Batch invoice generation** with client-grouped selection UI for efficient bulk invoicing workflows
- **Multi-service support** in service logging workflow with enhanced Account Manager (AM) completion stage
- **AM completion stage** improvements enabling Account Managers to mark services as complete with multiple services per session

### Changed
- Service logging workflow refactored to support simultaneous multi-service logging from Account Managers
- Invoice generation process streamlined with grouped client selection for improved usability

## [0.3.0] - 2026-03-05

### Added
- **Section 5: Services Offered** — service categories for Rapid (PRO, company formation, virtual address) and RCHBS (PRO, accounting, rent, legal, sponsors, HR)
- **Section 4.3: Custom Invoice Requirements** — cost codes, business units, tax PINs, custom addressee lines (EY example)
- **Section 14.1: VAT Readiness** — Qatar VAT timeline (June 2026 / January 2027) with system requirements
- **Paper savings callout** in Filing section
- **Visual schedule timeline** for scheduled/recurring invoices
- **Interactive HTML prototype** with 6 screens (Dashboard, Invoicing, Clients, Cards, Schedule, AM Demo)
- Per-job clients can now upload service agreements (not just retainer clients)
- Price list detail: 60+ services, variable pricing, "starting from" rates

### Changed
- **Gabi's role corrected throughout** — she logs daily expenses in Excel and prepares expense reports (1st/2nd half of month), does NOT reconcile cards. Finance does the actual recon.
- **Price list ownership** changed from Finance to Elena (AM Team Leader)
- **Accounting software section** made software-agnostic (likely migration from QuickBooks)
- **Proactive follow-up** section significantly expanded
- **PV section** updated with actual format details from real PV examples
- **Flowcharts redesigned** — wider, more compact layouts that fit on one page
- All QuickBooks references in ideal-system sections replaced with "accounting software"

## [0.2.0] - 2026-03-04

### Added
- Full service flow from CFO meeting: Client → AM → OPs → AM logs → Elena reviews → Gabi verifies → Finance invoices
- New ideal system flowchart showing all 12 steps with role color-coding
- Client setup section (retainer vs per-job, agreement upload, auto-scheduling)
- Three invoice triggers: Thursday cycle, spending limit hit, 20-day uninvoiced rule
- Invoice goes to DRAFT status before approval
- AM is the one who uploads receipts (not OPs, for now)
- Two verification steps: Elena (AM Team Leader) + Gabi (payment verification)
- Payment method tracking: Rapid cards / RCHBS cards / Cash / Other with explanation
- Opening balances needed for system go-live
- CFO's "stock market ticker" vision for real-time dashboards
- 5 role-based dashboard views (Finance, AM, Elena, Gabi, Management)
- Elena as a named role (AM Team Leader)

### Changed
- Report completely restructured: brief current state → goals → full ideal system
- Invoicing no longer just Thursdays — immediate invoicing when limits hit
- Service dashboard sorted by highest government fees first
- Invoice sending method left as TBD per CFO direction
- Prepared by changed to "Suleiman Mussa"

## [0.1.0] - 2026-03-04

### Added
- Initial current-state process documentation (13 sections)
- Credit card details: Rapid 3 CCs, RCHBS 1 CC + 3 Himyan prepaid
- CFO objectives: zero errors, keep work in finance, real-time visibility
- Client spending limits concept
- Per-client spending tracking with 30-minute binder-digging problem statement
- Weekly invoice lifecycle flowchart
- Money flow and document trail flowchart
- RCH branding (logo, navy #1B3A5C, magenta #A3195B)
- Glossary of all terms and abbreviations
