const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, ImageRun,
  TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader
} = require("docx");

const NAVY = "1B3A5C";
const MAGENTA = "A3195B";
const DARK_GRAY = "333333";
const MED_GRAY = "666666";
const LIGHT_BG = "F5F0F5";
const GREEN_BG = "E8F5E9";
const GREEN_DARK = "2E7D32";
const WHITE = "FFFFFF";

const BASE = __dirname + "/..";
const logoBuffer = fs.readFileSync(BASE + "/assets/rch_logo.jpg");
const idealFlowBuffer = fs.readFileSync(BASE + "/flowcharts/rendered/ideal_system.png");
const invoiceFlowBuffer = fs.readFileSync(BASE + "/flowcharts/rendered/current_invoice_lifecycle.png");
const moneyFlowBuffer = fs.readFileSync(BASE + "/flowcharts/rendered/current_money_flow.png");

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] });
}
function para(text) {
  return new Paragraph({
    spacing: { after: 180, line: 320 },
    children: [new TextRun({ font: "Arial", size: 22, color: DARK_GRAY, text })],
  });
}
function callout(title, text, color = MAGENTA, bg = LIGHT_BG) {
  return new Paragraph({
    spacing: { before: 140, after: 220 },
    shading: { fill: bg, type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 14, color: color, space: 8 } },
    indent: { left: 200, right: 200 },
    children: [
      new TextRun({ font: "Arial", size: 22, bold: true, color: color, text: title + "  " }),
      new TextRun({ font: "Arial", size: 22, color: DARK_GRAY, text }),
    ],
  });
}
function greenCallout(title, text) {
  return callout(title, text, GREEN_DARK, GREEN_BG);
}
function spacer(pts = 100) {
  return new Paragraph({ spacing: { before: pts, after: pts }, children: [] });
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}
function bulletItem(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 100, line: 300 },
    children: [new TextRun({ font: "Arial", size: 22, color: DARK_GRAY, text })],
  });
}
function numItem(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { after: 100, line: 300 },
    children: [new TextRun({ font: "Arial", size: 22, color: DARK_GRAY, text })],
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: DARK_GRAY } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MAGENTA, space: 4 } } },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: MAGENTA },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [

    // ==================== TITLE PAGE ====================
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      children: [
        spacer(1200),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 600 },
          children: [new ImageRun({ data: logoBuffer, transformation: { width: 280, height: 86 }, type: "jpg" })],
        }),
        spacer(400),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ font: "Arial", size: 56, bold: true, color: NAVY, text: "Finance Department" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 80 },
          children: [new TextRun({ font: "Arial", size: 40, color: MAGENTA, text: "CRM System Vision" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 40 },
          children: [new TextRun({ font: "Arial", size: 28, color: MED_GRAY, text: "From Current State to Ideal System" })],
        }),
        spacer(200),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: MAGENTA, space: 12 },
                    bottom: { style: BorderStyle.SINGLE, size: 4, color: MAGENTA, space: 12 } },
          spacing: { before: 200, after: 200 },
          children: [new TextRun({ font: "Arial", size: 26, color: MED_GRAY, text: "Rapid Clearing House  |  RCH Business Solutions W.L.L." })],
        }),
        spacer(400),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ font: "Arial", size: 22, color: MED_GRAY, text: "Prepared by: Suleiman Mussa" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 80 },
          children: [new TextRun({ font: "Arial", size: 22, color: MED_GRAY, text: "Date: March 2026" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ font: "Arial", size: 20, italics: true, color: MED_GRAY, text: "CONFIDENTIAL \u2014 For IT & Management Reference" })],
        }),
      ],
    },

    // ==================== TOC ====================
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      children: [
        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({ font: "Arial", size: 36, bold: true, color: NAVY, text: "Table of Contents" })],
        }),
        new TableOfContents("TOC", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({
          spacing: { before: 300 },
          children: [new TextRun({ font: "Arial", size: 20, italics: true, color: MED_GRAY, text: "Note: Right-click the table above and select \u201CUpdate Field\u201D to refresh page numbers after editing." })],
        }),
      ],
    },

    // ==================== MAIN CONTENT ====================
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MAGENTA, space: 4 } },
              children: [
                new ImageRun({ data: logoBuffer, transformation: { width: 90, height: 28 }, type: "jpg" }),
                new TextRun({ font: "Arial", size: 16, color: MED_GRAY, text: "   Finance Department \u2014 CRM System Vision" }),
                new TextRun({ font: "Arial", size: 16, color: MED_GRAY, children: [
                  new PositionalTab({ alignment: PositionalTabAlignment.RIGHT, relativeTo: PositionalTabRelativeTo.MARGIN, leader: PositionalTabLeader.NONE }),
                  "March 2026",
                ]}),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } },
              children: [
                new TextRun({ font: "Arial", size: 16, color: MED_GRAY, text: "Page " }),
                new TextRun({ font: "Arial", size: 16, color: MED_GRAY, children: [PageNumber.CURRENT] }),
                new TextRun({ font: "Arial", size: 16, color: MED_GRAY, text: " of " }),
                new TextRun({ font: "Arial", size: 16, color: MED_GRAY, children: [PageNumber.TOTAL_PAGES] }),
              ],
            }),
          ],
        }),
      },
      children: [

        // ========== SECTION 1: CURRENT CHALLENGES ==========
        h1("1. Where We Are Today"),

        para("RCH operates as two separate legal companies \u2014 Rapid Clearing House (\u201CRapid\u201D) and RCH Business Solutions W.L.L. (\u201CRCHBS\u201D) \u2014 sharing one office, one team, and the same daily operations. The Finance Department has two people who handle all invoicing, payment vouchers, bank reconciliation, payment tracking, and filing for both companies. Because the companies are legally separate, almost every process is done twice."),

        para("Today, the Finance Department depends entirely on physical paper to do its work. When the Operations team completes a government service for a client, the Account Manager prints two copies of the government receipt, writes the service details and fee information on it in pencil, and places one copy on the Finance Department\u2019s tray. The other copy goes to Gabi, who logs daily card expenses into an Excel spreadsheet using SMS bank alerts and paper receipts, and prepares expense reports (split into first and second halves of the month, both delivered at month-end). This paper receipt is the only way Finance learns that a service has been completed. There is no digital notification, no shared system, and no real-time visibility."),

        para("Every week, the Finance Department manually sorts through all collected receipts, groups them by company and client, and builds each invoice by hand in Microsoft Excel. These draft invoices are then checked by Gabi against her own independent records to catch missing receipts, wrong fees, or incorrect company assignments. After corrections, the invoices are reviewed again within the Finance Department for wording and accuracy, then printed, scanned alongside their government receipts, and emailed to clients. The same invoice data is then manually typed into QuickBooks, creating complete duplication of work."),

        para("Credit card management is also paper-based. Rapid has 3 credit cards and RCHBS has 1 credit card plus 3 Himyan prepaid cards, all from QNB. Card statements are only available on paper \u2014 QNB does not provide them as digital files. Gabi logs all card transactions daily in Excel and prepares expense reports split into the first and second halves of each month. The Finance Department uses these reports along with bank statements to perform the monthly bank reconciliation. Payment Vouchers are created by hand for every card top-up and outgoing payment. At the end of each month, all documents are organized into roughly eight physical binders and filed in cabinets."),

        callout("The core problems:", "Paper-dependent processes lead to lost receipts and missed invoices. A single person is the only check on invoice accuracy. Manual invoice creation in Excel is slow and error-prone. Double data entry into QuickBooks wastes time. The Finance Department has no real-time information about completed services or spending. If someone asks how much has been spent on a specific client, it takes 30 minutes of digging through binders to find the answer. Everything takes longer than it should because every step is done by hand, and every step is done twice."),

        para("The following diagrams show how the current weekly invoice process and money flow work today."),

        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 200, after: 100 },
          children: [new ImageRun({ data: invoiceFlowBuffer, transformation: { width: 468, height: 429 }, type: "png" })],
        }),

        pageBreak(),

        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 100, after: 200 },
          children: [new ImageRun({ data: moneyFlowBuffer, transformation: { width: 468, height: 300 }, type: "png" })],
        }),

        pageBreak(),

        // ========== SECTION 2: GOALS ==========
        h1("2. What We Want to Achieve"),

        para("The CFO has set four clear goals for the new system. Every feature and process described in this document works toward these goals."),

        h2("2.1 Zero Human Errors"),

        para("Too many steps in the current process depend on people doing things perfectly every time. Papers get lost, numbers get typed wrong, and invoices go out with mistakes. The goal is to reduce human error as close to zero as possible by automating data entry, eliminating paper handoffs, and building checks into the system itself so that mistakes are caught before they happen \u2014 not after."),

        h2("2.2 Keep Financial Work Inside the Finance Department"),

        para("Today, the Finance Department depends on Account Managers to print and deliver receipts, and on a separate person to check every invoice against independent records. If any of these people are busy, absent, or make a mistake, Finance gets stuck. The goal is to give the Finance Department direct access to all the information it needs through the system, so it does not have to wait for other people to hand over papers."),

        h2("2.3 Real-Time Visibility for Everyone"),

        para("Nobody in the company can currently see the full picture at a glance. Finance does not know what services have been completed until papers show up. Management cannot see outstanding balances, pending invoices, or spending trends without asking someone to compile a report. The CFO wants to be able to see all transactions in real time, like a stock market ticker \u2014 every service, every payment, every day. Every role in the company should see what is relevant to them, updated live."),

        h2("2.4 Client Spending Limits and Receivables Control"),

        para("The system should track every payment made for each client in real time. When a client reaches or is nearing a spending limit, the Account Manager should see a warning before accepting new service requests. Additionally, no service should sit uninvoiced for more than approximately 20 days. The system should alert Finance when uninvoiced services are getting old. The specific rules and amounts for spending limits will be decided later; the system must support this kind of control from the start."),

        pageBreak(),

        // ========== SECTION 3: IDEAL SYSTEM OVERVIEW ==========
        h1("3. The Ideal System: Overview"),

        para("The following diagram shows the full flow of the new system, from the moment a client contacts RCH to the moment an invoice is sent and synced to the accounting software. Every person involved is shown, along with the two verification steps and the automation that happens behind the scenes."),

        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 },
          children: [new ImageRun({ data: idealFlowBuffer, transformation: { width: 468, height: 328 }, type: "png" })],
        }),

        para("The rest of this document describes each part of this system in detail."),

        pageBreak(),

        // ========== SECTION 4: CLIENT SETUP ==========
        h1("4. Client Setup"),

        para("Before any services can be logged, the client must exist in the system. If the client is new, the Account Manager creates a new client profile. If the client already exists, the AM selects them from the list."),

        h2("4.1 Creating a New Client"),

        para("When an Account Manager creates a new client, the system collects the following information:"),

        bulletItem("Company name"),
        bulletItem("Contact person name"),
        bulletItem("Email address and phone number"),
        bulletItem("Location (city, country)"),
        bulletItem("Any special invoicing dates or payment terms"),

        para("After entering the basic details, the system asks a key question: is this client on a retainer agreement, or are they per-job?"),

        h3("Retainer Clients"),

        para("If the client is on a retainer, the AM is required to upload the service agreement (the contract). Once uploaded, the system automatically sets professional fees to zero for all services and creates a recurring invoice schedule based on the agreement terms. This scheduled invoice is added to the Finance Department\u2019s approval queue each month (or whatever the frequency is). The retainer amount, frequency, and agreement dates are all stored in the system."),

        h3("Per-Job Clients"),

        para("If the client is per-job, the AM can also upload the service agreement for reference. Professional fees are automatically filled from the price list when services are logged. If a client has a special negotiated rate (for example, a discount arrangement), the AM can adjust the professional fee when logging the service. For clients with permanent special rates, the system can store a custom price list so the correct rate is applied automatically every time."),

        h2("4.2 Client Assignment to Account Managers"),

        para("Every client in the system is assigned to one Account Manager. When an AM logs into the system, they only see the clients assigned to them \u2014 this keeps each AM\u2019s workspace clean and focused. The AM Team Leader (Elena) can reassign any client to a different AM directly from the client list with a single click, without needing to open the full client profile."),

        h2("4.3 Clients Across Both Companies"),

        para("Each client profile has a primary company \u2014 either Rapid Clearing House or RCH Business Solutions (RCHBS). When an Account Manager logs a service for a client, the system automatically uses that client\u2019s company to determine the correct price list and which credit cards are available for the government fee. There is no manual company selection during service logging; the correct company is set from the client profile and confirmed to the AM via a colour-coded indicator on the form. Invoices are always generated under the company the service was logged against."),

        h2("4.4 Custom Invoice Requirements"),

        para("Some clients \u2014 especially larger companies under Rapid like EY, ABB, and Hitachi \u2014 require extra information on their invoices that standard clients do not need. Examples include cost codes, business unit references, tax PINs, and custom addressee lines (for example, EY requires invoices addressed to a specific service line such as \u201CAssurance Service Line\u201D). The system must support per-client invoice customization so that these fields are stored in the client profile and automatically included on every invoice for that client."),

        // ========== SECTION 5: SERVICE CATEGORIES ==========
        h1("5. Services Offered"),

        para("RCH offers a wide range of services through both companies. Each company has its own price list, and the rates differ between Rapid and RCHBS. The service list in the CRM must be comprehensive enough to cover all of these categories, and the system must allow admin users to add new services or modify existing ones as the business evolves."),

        h2("5.1 Rapid Clearing House"),

        para("Rapid mainly offers PRO services and company formation. The key service categories are:"),

        bulletItem("Company Documents \u2014 renewals, obtainment, amendments, adding/removing signatories, and document extraction for Company Registration (CR), Municipality License (ML), Computer Card (CC), Articles of Association (AOA), Classification Certificates, and Chamber of Commerce"),
        bulletItem("Immigration Services \u2014 residence permits (new issuance and renewals), work visas, medical tests, fingerprinting, labor contract attestation, QID card issuance and renewal, return permits, transfer of sponsorship, visa cancellations, and related services"),
        bulletItem("Traffic Department Services \u2014 driving license assistance, vehicle registration (Istimara), penalty settlements, FAHES inspections, exit/entry permits"),
        bulletItem("Administrative Services \u2014 employment contract attestation, MOFA attestation, Chamber of Commerce attestation, labor quota management, gate passes (offshore and onshore), company ban removal, and general letters and certificates"),
        bulletItem("Virtual Address services"),

        para("A small number of Rapid clients also receive accounting, rent, or legal services, which are normally offered through RCHBS. These are special cases."),

        h2("5.2 RCH Business Solutions (RCHBS)"),

        para("RCHBS offers a broader range of services:"),

        bulletItem("PRO Services \u2014 the same range of immigration, company documents, traffic, and administrative services as Rapid, but at different (generally lower) professional fee rates"),
        bulletItem("Accounting Services \u2014 bookkeeping, financial reporting, and related services"),
        bulletItem("Rent and Virtual Address \u2014 office space and registered address services"),
        bulletItem("Legal Services"),
        bulletItem("Sponsor Services \u2014 sponsorship management and related fees"),
        bulletItem("HR Services \u2014 payroll via WPS, employment contracts, and other HR functions"),

        para("The complete price lists for both companies are maintained separately and contain over 60 individual service types with their standard government charges and professional fees. These lists are the source data for the CRM\u2019s pricing engine."),

        // ========== SECTION 5: SERVICE FLOW ==========
        h1("6. Service Flow: From Request to Verified"),

        para("This section describes the full journey of a service request, step by step."),

        h2("5.1 Step 1: Client Contacts RCH"),

        para("The client contacts RCH by phone or email to request a service. This could be anything from a QID renewal to a company formation to a visa application."),

        h2("5.2 Step 2: Account Manager Logs the Request"),

        para("The Account Manager logs the service request in the CRM. At this stage, the AM enters:"),

        bulletItem("The client (selected from their personal client list \u2014 each AM only sees the clients assigned to them)"),
        bulletItem("The type of service (selected from a list \u2014 e.g. QID Renewal, Gate Passes, Company Documents Amendment, Visa Issuance). Once the client is selected, the system automatically determines whether this is a Rapid or RCHBS service based on the client\u2019s profile and shows this as a colour-coded indicator."),
        bulletItem("The number of people the service is for"),
        bulletItem("The names of the employees or individuals involved"),

        para("The AM then forwards the request to the Operations team for execution."),

        h2("5.3 Step 3: Operations Executes the Service"),

        para("The Operations team goes to the relevant government office or portal and completes the service. During execution, OPs notes down the following:"),

        bulletItem("How the government fee was paid. The options are organized by company: under Rapid, the OP selects from the 3 Rapid credit cards or cash. Under RCHBS, the OP selects from the 1 RCHBS credit card, the 3 Himyan prepaid cards, or cash. There is also an \u201COther\u201D option, which requires a written explanation (for example, \u201Ccard did not work, paid from personal funds\u201D)."),
        bulletItem("The government receipt and any other supporting documents (printed receipt, POS slip, etc.)"),

        para("Once the service is done, OPs returns all receipts and payment details to the Account Manager."),

        h2("5.4 Step 4: Account Manager Informs the Client and Logs Completion"),

        para("The Account Manager contacts the client to let them know the service is completed and any documents are ready for collection. Then the AM logs the completion in the CRM by entering:"),

        bulletItem("The government fee amount (as shown on the receipt)"),
        bulletItem("Which card was used (selected from the list of active cards for the correct company)"),
        bulletItem("A digital upload of the government receipt (photo or PDF)"),
        bulletItem("The date the service was completed"),
        bulletItem("Cost center, if the client requires it on their invoices"),
        bulletItem("Business unit, if the client requires it on their invoices"),
        bulletItem("Professional fees \u2014 these are automatically filled from the price list for per-job clients (zero for retainer clients), but the AM can adjust them if there is a special arrangement"),

        para("There is no paper in this process. No printing, no pencil notes, no trays. Everything goes directly into the system."),

        greenCallout("Future improvement:", "As the Operations team becomes more familiar with the system, they may be given direct access to log service completion from their phones. An OP would open the CRM, upload the receipt, enter the payment details, and mark the service as done \u2014 all in real time from the government office. This would reduce the time between service completion and data entry from hours to minutes. For now, the AM handles this step."),

        h2("5.5 Step 5: Elena (AM Team Leader) Reviews"),

        para("Every submission by an Account Manager is reviewed by Elena, the AM Team Leader. Elena checks that the information is complete and correct: the right client, the right company, the right service type, the right amounts, and the receipt is properly uploaded. If something is wrong or missing, she sends it back to the AM for correction. If everything is correct, she approves the submission."),

        h2("5.6 Step 6: Gabi Verifies the Payment"),

        para("After Elena\u2019s approval, the submission goes to Gabi for payment verification. Gabi checks her phone for the SMS bank alerts to confirm that the payment actually happened on the correct card for the correct amount. This step ensures that what was entered into the system matches what actually happened at the bank level."),

        para("This is an important change from the current process. Today, Gabi\u2019s verification happens later, during invoice creation, which means problems are caught late and cause delays. In the new system, Gabi\u2019s check happens immediately after the service is completed, so any issues are caught early and do not delay Thursday invoicing."),

        h2("5.7 Service Status: Verified"),

        para("Once both Elena and Gabi have approved, the service is marked as \u201CVerified\u201D in the system. At this point:"),

        bulletItem("The service appears on the Finance Department\u2019s dashboard as ready to be invoiced"),
        bulletItem("The client\u2019s running spending total is updated automatically"),
        bulletItem("The system checks the client\u2019s spending limit and shows a warning if they are near or over"),
        bulletItem("The transaction is visible on the real-time dashboard for all roles"),

        // ========== SECTION 6: INVOICING ==========
        h1("7. Invoicing"),

        para("Invoicing is the most important process for the Finance Department. The new system changes it from a manual, paper-based task into a fast, mostly automated process with just two steps: choose the client, and choose the services. There are three types of invoices."),

        h2("6.1 Weekly Service Invoices (Every Thursday)"),

        h3("Invoice Triggers"),

        para("Thursday is the standard invoicing day. However, the system also triggers invoicing in two other cases: when a client hits their spending limit (Finance should invoice immediately rather than wait), and when a verified service has been sitting uninvoiced for more than approximately 20 days (the system shows a persistent alert until it is dealt with)."),

        h3("What Finance Sees on Thursday"),

        para("The Finance Department opens the CRM and sees a dashboard of all verified services that have not yet been invoiced. The dashboard is sorted so that clients with the highest total government fees appear at the top \u2014 this helps Finance prioritize the most important invoices first. Services are grouped by client, showing the total amount of uninvoiced government fees per client."),

        h3("Creating an Invoice: Two Steps"),

        para("The Finance Department selects a client from the dashboard. The system shows all uninvoiced services for that client. Finance picks which services to include (they can select all of them or just some). The system then generates a draft invoice automatically. It fills in everything:"),

        bulletItem("Numbered description lines with service type, employee name, and date \u2014 matching the current invoice format (e.g. \u201C1) QID Renewal for the following on 21.01.2026\u201D followed by names)"),
        bulletItem("Government fees for each line (taken from the receipt data entered by the AM)"),
        bulletItem("Professional fees for each line (from the price list, or zero for retainer clients)"),
        bulletItem("Line totals and grand total"),
        bulletItem("Total amount in words (generated automatically)"),
        bulletItem("The correct bank payment details for the right company (Rapid or RCHBS, each with different account numbers and bank addresses)"),
        bulletItem("The due date based on the client\u2019s payment terms"),
        bulletItem("The next invoice number in sequence (INV/RCH/#### or INV/RCHBS/####)"),
        bulletItem("Cost center and business unit columns, if the client requires them"),
        bulletItem("Tax PIN and custom addressee lines for clients that need them (e.g. EY\u2019s \u201CAssurance Service Line\u201D)"),
        bulletItem("Standard notes (bank transfer charges borne by client, all payments non-refundable)"),

        h3("Review, Approve, and Send"),

        para("The generated invoice goes into \u201CDraft\u201D status. The Finance Department reviews it on screen. Once confirmed, it is approved and the status changes to ready for sending. The method of delivery (manual email or system-automated) will be decided during implementation. Once the invoice is sent, all the services included on it are marked as \u201CInvoiced\u201D in the CRM, and the invoice data is automatically synced to the accounting software. No manual re-entry is needed."),

        greenCallout("What disappears:", "No more building invoices line by line in Excel. No more Wednesday paper sorting. No more printing, scanning, or pairing receipts. No more typing the same data into the accounting software by hand. The process that currently takes two full days (Wednesday and Thursday) is reduced to a review-and-approve task on Thursday."),

        h2("6.2 Scheduled Invoices (Monthly Retainers and Recurring Charges)"),

        para("Some clients pay a fixed monthly retainer fee under a service agreement. Other recurring charges include accounting fees, rent, salary-related charges, and sponsor fees. When a retainer client is created in the system and the service agreement is uploaded, the system automatically creates the recurring invoice schedule."),

        para("When a scheduled invoice is due, the system automatically creates a draft and places it in the Finance Department\u2019s approval queue. Finance reviews and approves it, and the system sends it and syncs it to the accounting software. When agreements change or end, admin users update the schedule in the CRM. The system can send reminders when agreements are approaching their end date."),

        para("The system should include a visual schedule or timeline view that shows all upcoming scheduled invoices, currently due invoices, and past-due invoices on a single screen. This gives the Finance Department an at-a-glance picture of what needs attention this week, this month, and in the months ahead. The timeline should be filterable by company, client, and invoice type (retainer, recurring, annual)."),

        h2("6.3 Annual Invoices"),

        para("Certain charges are invoiced once a year, such as sponsorship fees and legal address fees. Currently, the Finance Department looks back at the same month from the previous year to identify which annual invoices are due. In the new system, this lookback is automatic. Each month, the system checks last year\u2019s records and flags any annual invoices that may need to be reissued. The Finance Department reviews the list and creates the invoices for approval."),

        // ========== SECTION 7: THE PRICE LIST ==========
        h1("8. Price List Management"),

        para("The system stores a master price list of all service types and their standard professional fees, separately for Rapid and RCHBS. When an Account Manager logs a per-job service, the professional fee is automatically filled in from this list."),

        para("The price list is managed by Elena (AM Team Leader). If rates change in the future, Elena updates the price list in one place, and the new rates are automatically applied for all Account Managers going forward. Historical invoices are not affected \u2014 they keep the rate that was in effect when they were created."),

        para("For clients with special negotiated rates, the system supports custom price lists per client. When a service is logged for a client with a custom rate, the system uses the custom rate instead of the standard rate. The AM can also override the rate manually for one-off adjustments, which would be visible to Elena during her review step."),

        para("The price list currently contains over 60 service types per company, with government charges that are either fixed amounts or marked as \u201Cas per government receipt\u201D (meaning the actual amount varies and is entered by the AM based on the receipt). Professional fees are fixed amounts that can range from QAR 100 to QAR 5,000 depending on the service. Some services have variable pricing (e.g. \u201Cstarting from QAR 2,000\u201D) which the AM adjusts per case."),

        // ========== SECTION 8: CARD MANAGEMENT ==========
        h1("9. Card Management and Spending Tracking"),

        h2("9.1 Current Card Setup"),

        para("Rapid currently uses 3 credit cards. RCHBS uses 1 credit card and 3 Himyan prepaid cards. All cards are from QNB and are held by the Operations team. The number and type of cards may change in the future, so the system must allow admin users to add, remove, or update cards at any time."),

        h2("9.2 Payment Method Tracking"),

        para("When an Account Manager logs a completed service, they select how the government fee was paid. The payment options are organized by company:"),

        bulletItem("Rapid: Rapid Credit Card 1, Rapid Credit Card 2, Rapid Credit Card 3, or Cash"),
        bulletItem("RCHBS: RCHBS Credit Card, Himyan Card 1, Himyan Card 2, Himyan Card 3, or Cash"),
        bulletItem("Other: requires a written explanation (e.g. \u201Cpaid from personal funds because card was not working\u201D)"),

        para("This structure makes it easy to track exactly which card was used for every transaction, which is essential for card reconciliation."),

        h2("9.3 Automatic Spending Tracking"),

        para("Every verified service in the system has a card payment linked to it. This means the system can show at any moment: the total spent on each card for any time period, every transaction on each card with dates and client details, and a breakdown of spending per client, per company, and per card. This replaces the current process where Gabi manually logs card transactions in Excel using SMS alerts and paper receipts."),

        h2("9.4 Card Balances and Top-Ups"),

        para("Gabi currently manages card balances and top-ups. In the new system, the dashboard shows card spending totals so that Gabi (or whoever manages the cards) can see when a card is getting low and needs to be topped up. When a top-up happens, it is recorded in the system and flagged for Payment Voucher creation."),

        h2("9.5 Card Reconciliation"),

        para("QNB currently provides credit card statements only on paper \u2014 there is no digital export available. The statements cover the master card and all sub-cards together. This means card reconciliation cannot be fully automated. However, because the CRM already has every card transaction logged (from the service completion entries), the process is much easier: the Finance Department compares the paper statement line by line against the system\u2019s records, and the system highlights any differences. This is a significant improvement over the current process of matching paper against paper with Gabi\u2019s Excel logs as the only reference."),

        // ========== SECTION 9: PAYMENT TRACKING ==========
        h1("10. Payment Tracking and Receivables"),

        h2("10.1 Opening Balances"),

        para("When the system is first set up, existing client balances need to be entered so that receivables tracking is accurate from day one. For each client, the Finance Department enters the opening balance \u2014 the total amount the client currently owes across all outstanding invoices. From that point forward, every new invoice increases the balance and every received payment decreases it."),

        h2("10.2 Matching Payments to Invoices"),

        para("When a payment is received (via bank transfer or cheque), the system suggests which invoice it matches based on the amount, the client, and the timing. The Finance Department reviews the suggestion and confirms the match. Once confirmed, the invoice status changes from \u201CPending\u201D to \u201CPaid\u201D and the data is synced to the accounting software."),

        h2("10.3 Receivables Dashboard"),

        para("The system tracks the full receivables picture in real time. At any moment, the Finance Department or Management can see: total outstanding receivables per company, outstanding balance per client, aging of each invoice (how many days overdue), and the complete payment history for any client. If someone asks \u201Chow much does Client X owe us,\u201D the answer is available instantly \u2014 no binder-digging required."),

        h2("10.4 Proactive Follow-Up"),

        para("Proactive follow-up is one of the most important features of the new system. Today, overdue invoices often go unnoticed until someone happens to check, or until a client\u2019s balance grows so large it becomes a problem. The new system changes this completely."),

        para("The system automatically tracks the aging of every invoice from the moment it is sent. When an invoice is approaching its due date, the system sends a reminder to the Finance Department so that follow-up can happen before the invoice is overdue \u2014 not after. When invoices do become overdue, the system flags them prominently on the dashboard and keeps flagging them until they are resolved."),

        para("The Finance Department can generate and send a Statement of Account (SOA) directly from the system with one click. The system stores a complete history of all follow-up actions taken for each client \u2014 when reminders were sent, when SOAs were issued, and any notes from conversations. This way, if a client claims they never received a follow-up, or if a different team member needs to take over, the full history is available."),

        para("Combined with the spending limit feature (where AMs can see when a client is near their limit and decline new services until payment is received), proactive follow-up gives RCH much tighter control over its receivables and cash flow."),

        // ========== SECTION 10: PVs AND RVs ==========
        h1("11. Payment Vouchers and Receipt Vouchers"),

        h2("11.1 Payment Vouchers (PVs)"),

        para("A Payment Voucher is created for every outgoing payment: credit card top-ups, cheque payments, salaries, loan repayments, rent, sponsor payments, and other expenses. Each company has its own PV numbering sequence: Rapid uses the format RCH-PV-2026-XXXX and RCHBS uses RCHBS-PV-2026-XXXX. Each PV records the date, the payee name, the particulars (description of what the payment is for), the amount in QAR, and the payment method (bank transfer, cash, or cheque \u2014 and if cheque, the bank name, cheque number, and cheque date). The PV also records who prepared it and who approved it."),

        para("In the new system, PV creation is semi-automatic. When the system detects an outgoing transaction (such as a card top-up or a cheque clearing), it flags it and prepares a draft PV with the correct details already filled in: the payee, the amount, the date, the next PV number in sequence, the payment method, and the description. The Finance Department reviews the draft, makes any adjustments, and approves it. The approved PV is stored digitally in the system."),

        h2("11.2 Receipt Vouchers (RVs)"),

        para("Receipt Vouchers are less common and are mainly used when a client pays the wrong company. The system handles these the same way as PVs: semi-automatic creation with Finance approval, and separate sequential numbering."),

        // ========== SECTION 11: BANK RECON ==========
        h1("12. Bank Reconciliation"),

        para("Bank reconciliation currently happens monthly and involves manually matching every line on the bank statement to PVs, invoices, and cheques. Each company has its own bank account at QNB, so this is done separately for Rapid and RCHBS."),

        para("In the new system, the CRM already tracks all card spending, all invoices, all PVs, and all incoming payments. It can automatically match most bank statement lines to their corresponding records. The Finance Department\u2019s job becomes reviewing the exceptions \u2014 the transactions that the system could not match automatically."),

        callout("Note on card statements:", "Because QNB provides credit card statements only on paper (with master card and sub-card details combined), card reconciliation will remain semi-manual. The system helps by having all transaction data already logged, but the matching against the paper statement still requires a person. This is a known limitation that may change if QNB offers digital exports in the future."),

        greenCallout("Before vs. After:", "Today, bank reconciliation means checking every single line manually. In the new system, the majority of lines are matched automatically, and Finance only handles the exceptions. What currently takes hours becomes a focused review of a much shorter list."),

        // ========== SECTION 12: FILING ==========
        h1("13. Filing and Archiving"),

        para("In the new system, all records are digital. Government receipts are uploaded when the AM logs service completion. Invoices are generated and stored digitally. PVs and RVs are created and stored in the system. Every document is linked to the right client, the right company, and the right time period, and can be found instantly through search."),

        para("For legal or audit purposes, a small number of physical backups may still be kept. But the system is the primary record, and the monthly eight-binder filing exercise is either eliminated or reduced to a minimal backup process."),

        greenCallout("Paper savings:", "The move to a digital system will save a large amount of paper. Today, every government receipt is printed twice, every invoice is printed and paired with its receipts, every PV is printed in duplicate, and everything is filed into physical binders. Across two companies, this adds up to thousands of printed pages every month. The new system eliminates the need for most of this printing. Receipts are uploaded digitally, invoices are created and stored in the system, and PVs are generated on screen. The environmental and cost savings from reduced paper and printing alone will be significant."),

        // ========== SECTION 13: QUICKBOOKS ==========
        h1("14. Accounting Software Integration and VAT Readiness"),

        para("Both companies currently use separate QuickBooks installations. Today, every invoice is manually typed into QuickBooks after being created in Excel. In the new system, the CRM handles all invoice creation and data is synced to the accounting software automatically. When an invoice is approved, the system pushes the data directly into the correct accounting system (Rapid or RCHBS). The same applies to payment records, PVs, and other financial entries."),

        para("There is a likely migration to a new accounting software in the near future. For this reason, the CRM\u2019s integration layer should be designed to be software-agnostic \u2014 capable of connecting to QuickBooks today, but easily adapted to work with a different system (such as Xero, Zoho Books, or an ERP) when the migration happens. The goal remains the same regardless of which software is used: data is entered once in the CRM and flows automatically to the accounting system with no manual re-entry."),

        h2("14.1 VAT Readiness"),

        para("Qatar is introducing VAT in June 2026, with implementation expected in January 2027. The CRM must be designed with VAT in mind from the start. This means:"),

        bulletItem("The system must support adding a VAT percentage to invoices (applied to professional fees, government fees, or both, depending on the final regulations)"),
        bulletItem("Invoice templates must be able to show VAT as a separate line item, with the VAT registration number"),
        bulletItem("The price list must support VAT-inclusive or VAT-exclusive pricing, with the system calculating the correct amounts"),
        bulletItem("Reporting must be able to generate VAT summaries for filing purposes"),
        bulletItem("The accounting software integration must sync VAT data correctly"),

        para("The exact VAT rules and rates will be finalized by the Qatari government. The system does not need to implement VAT today, but it must be structured so that adding VAT support is straightforward when the time comes."),

        // ========== SECTION 14: DASHBOARDS ==========
        h1("15. Dashboards and Role-Based Views"),

        para("The new system provides a real-time dashboard with different views for different roles. Each role sees the information that is most relevant to their work. The CFO described this as being like a stock market screen \u2014 live data, updating constantly, showing every transaction as it happens."),

        h2("15.1 Finance Department View"),

        bulletItem("All verified services waiting to be invoiced, sorted by client and by total government fees"),
        bulletItem("Status of all invoices: draft, sent, overdue, paid"),
        bulletItem("Aging report: which clients owe money and for how long"),
        bulletItem("PV and RV queue: flagged transactions waiting for approval"),
        bulletItem("Bank reconciliation status: matched vs. unmatched items"),
        bulletItem("Upcoming scheduled invoices (retainers, recurring, annual) displayed on a visual timeline showing what is coming, what is due now, and what is past due"),
        bulletItem("Alerts for services sitting uninvoiced for more than 20 days"),

        h2("15.2 Account Manager View"),

        bulletItem("Status of all service requests for their clients (pending, in progress, completed, verified, invoiced)"),
        bulletItem("Client spending total vs. spending limit (with visual warnings when near or over)"),
        bulletItem("Outstanding balance per client"),
        bulletItem("Whether invoices have been sent and whether they have been paid"),

        h2("15.3 Elena (AM Team Leader) View"),

        bulletItem("All AM submissions awaiting her review and approval"),
        bulletItem("History of approved and rejected submissions"),
        bulletItem("Overview of AM activity and workload"),

        h2("15.4 Gabi View"),

        bulletItem("All submissions awaiting her payment verification"),
        bulletItem("Card spending per card, per day, per company"),
        bulletItem("Card balance indicators (low balance warnings for top-ups)"),
        bulletItem("Daily expense log (replacing the current Excel tracking)"),
        bulletItem("Expense report preparation tools (first half and second half of month)"),
        bulletItem("Transaction history with uploaded receipts"),

        h2("15.5 Management / CFO View"),

        bulletItem("Total revenue by company, by period"),
        bulletItem("Total outstanding receivables"),
        bulletItem("Client spending trends and patterns"),
        bulletItem("Overdue invoice summary"),
        bulletItem("All transactions in real time, like a live ticker"),
        bulletItem("Service volume and workload trends"),

        para("All data on every dashboard is live. There is no need to ask someone to compile a report or dig through binders. Any question about a client, an invoice, a payment, or a card balance can be answered in seconds."),

        // ========== SECTION 15: GLOSSARY ==========
        h1("16. Glossary"),

        para("This section explains the terms and abbreviations used in this document."),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2800, 6560],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders, width: { size: 2800, type: WidthType.DXA },
                  shading: { fill: NAVY, type: ShadingType.CLEAR },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ font: "Arial", size: 20, bold: true, color: WHITE, text: "Term" })] })],
                }),
                new TableCell({
                  borders: cellBorders, width: { size: 6560, type: WidthType.DXA },
                  shading: { fill: NAVY, type: ShadingType.CLEAR },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ font: "Arial", size: 20, bold: true, color: WHITE, text: "What It Means" })] })],
                }),
              ],
            }),
            ...([
              ["Rapid", "Rapid Clearing House \u2014 one of the two companies"],
              ["RCHBS", "RCH Business Solutions W.L.L. \u2014 the second company"],
              ["CRM", "Customer Relationship Management system \u2014 the new software described in this document"],
              ["AM", "Account Manager \u2014 the person who talks to clients, logs service requests, and uploads receipts"],
              ["Elena", "AM Team Leader \u2014 reviews and approves all AM submissions before they reach Finance; manages the price lists for both companies"],
              ["Operations (OP)", "The team that goes to government offices and pays fees using company cards"],
              ["Gabi", "Currently logs daily card expenses in Excel, prepares expense reports (first and second halves of each month), and verifies payments via SMS bank alerts"],
              ["Arlene", "Accounting Manager \u2014 part of the two-person Finance Department"],
              ["PV", "Payment Voucher \u2014 a document created for every outgoing payment (e.g. PV2026-1259)"],
              ["RV", "Receipt Voucher \u2014 a document created for incoming payments or intercompany corrections"],
              ["SOA", "Statement of Account \u2014 a summary of what a client owes, sent when payments are overdue"],
              ["QNB", "Qatar National Bank \u2014 the bank used for all company accounts, credit cards, and Himyan cards"],
              ["Himyan Card", "A QNB prepaid card used by RCHBS Operations for government payments"],
              ["QuickBooks", "The current accounting software used to record invoices and payments \u2014 separate systems for each company; likely to be migrated to a new system"],
              ["Price List", "A list of standard service fees that RCH charges per service type \u2014 managed by Elena (AM Team Leader)"],
              ["Retainer", "A fixed monthly fee that a client pays under a service agreement instead of paying per service"],
              ["Per-Job", "A client that pays professional fees for each individual service, based on the price list"],
              ["PRO", "Public Relations Officer services \u2014 the broad category covering immigration, company documents, traffic, and administrative government services"],
              ["VAT", "Value Added Tax \u2014 Qatar is introducing VAT in June 2026 with implementation in January 2027; the system must be VAT-ready"],
              ["Verified", "A service that has been approved by both Elena and Gabi and is ready to be invoiced"],
            ]).map((row, i) =>
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorders, width: { size: 2800, type: WidthType.DXA },
                    shading: i % 2 === 0 ? { fill: LIGHT_BG, type: ShadingType.CLEAR } : undefined,
                    margins: { top: 60, bottom: 60, left: 120, right: 120 },
                    children: [new Paragraph({ children: [new TextRun({ font: "Arial", size: 20, bold: true, color: DARK_GRAY, text: row[0] })] })],
                  }),
                  new TableCell({
                    borders: cellBorders, width: { size: 6560, type: WidthType.DXA },
                    shading: i % 2 === 0 ? { fill: LIGHT_BG, type: ShadingType.CLEAR } : undefined,
                    margins: { top: 60, bottom: 60, left: 120, right: 120 },
                    children: [new Paragraph({ children: [new TextRun({ font: "Arial", size: 20, color: DARK_GRAY, text: row[1] })] })],
                  }),
                ],
              })
            ),
          ],
        }),

        spacer(300),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: MAGENTA, space: 12 } },
          spacing: { before: 200 },
          children: [new TextRun({ font: "Arial", size: 20, italics: true, color: MED_GRAY, text: "End of Document" })],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(BASE + "/docs/RCH_CRM_System_Vision.docx", buffer);
  console.log("Document created successfully.");
});
