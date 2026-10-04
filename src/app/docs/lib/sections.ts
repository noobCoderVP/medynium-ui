import type { DocSection } from "../types";
import { PLATFORM_SECTIONS } from "./sections-platform";
import { TRUST_SECTIONS } from "./sections-trust";

/** User-facing guide, written for clinicians. Keep it in step with the screens; it is not developer documentation. */
export const DOC_SECTIONS: DocSection[] = [
  {
    id: "getting-started",
    group: "guide",
    title: "Getting started",
    summary: "What Medynium is and how the workspace is laid out.",
    topics: [
      {
        title: "What is Medynium?",
        body: "Medynium brings one patient's record together (encounters, medications, labs, claims and notes) and adds an assistant that answers questions about it with sources. It supports your decisions; it does not diagnose or replace clinical judgement. All data in this environment is synthetic.",
      },
      {
        title: "Understanding the workspace",
        body: "The sidebar switches between Dashboard, Patients, Pending work, Knowledge, Activity log and Documentation (Admin appears for administrators). Pending work lists what is waiting on you across your patients, most urgent first. The assistant panel can be collapsed, and everything it does can also be done by hand.",
      },
      {
        title: "Your first patient review",
        body: "Open Patients, search by name, id or condition, and open a row. Start on Overview for recent changes, then move through the tabs. Ask the assistant a question, and open Why? on any statement to see its evidence.",
      },
    ],
  },
  {
    id: "dashboard",
    group: "guide",
    title: "Dashboard",
    summary: "Your worklist and utilisation at a glance.",
    topics: [
      {
        title: "Patients needing attention",
        body: "The main list shows who changed since the last visit. It is ranked by a fixed rule, applied before the list is cut to ten: a recent emergency visit outranks everything else, then new lab results, then a medicine change, then a new document; ties go to the patient with more changes, then the most recent change. Click a column header to re-sort; each patient name opens the workspace. Brief me, beside the list, summarises the changes on request; the dashboard works without it.",
      },
      {
        title: "Utilisation and data freshness",
        body: 'The strip above the list gives headline counts for your patients over the stated period. "Data updated" under the title is the date the figures are current to. Recent lab results on the right show the latest value, whether it is high or low, and the previous value.',
      },
    ],
  },
  {
    id: "patients",
    group: "guide",
    title: "Patients",
    summary: "Finding a patient and reading the record.",
    topics: [
      {
        title: "Finding a patient",
        body: "Use the search box and the Sex, Visit type and Flag filters. Results are filtered and sorted across every patient you can see, 10 rows to a page by default (choose 10, 25, 50 or 100). The filters are kept in the address, so a filtered view can be shared and the back button works.",
      },
      {
        title: "Patient 360 and its tabs",
        body: "Overview, Timeline, Medications, Labs, Safety, Claims, Notes, Reports and Similar patients each show one slice of the record. On Reports you can upload a lab report or prescription, check what was read from it, and approve the rows that are right; nothing reaches the record until a doctor approves it. The header always names the patient and the date the record is current to.",
      },
      {
        title: "A patient you cannot find",
        body: "If a patient does not exist or you are not entitled to see them, the screen looks the same in both cases. This is deliberate.",
      },
    ],
  },
  {
    id: "assistant",
    group: "guide",
    title: "AI assistant",
    summary: "Asking questions, and what the answers mean.",
    topics: [
      {
        title: "Asking questions",
        body: "Ask in plain language about the patient on screen. The assistant is scoped to that patient, and the scope is shown in the panel.",
      },
      {
        title: "Evidence and citations",
        body: "Every statement carries a tag: Patient fact (from the record), Retrieved source (from a drug label) or AI synthesis (the assistant's own reasoning). Open Why? beside a statement to see the supporting items. It opens on click or key press, never only on hover.",
      },
      {
        title: "Safety review",
        body: "The Safety review tab runs a medication safety review for the patient and lists statements with their evidence. Choose Add to findings on a conclusion to record it, then acknowledge it, set a follow-up date, escalate it to a colleague who has the patient, or dismiss it with a reason. Each decision is recorded with your name and the time. Only you change a finding; the assistant cannot. Review everything yourself before acting.",
      },
      {
        title: "What the AI does not do",
        body: "It does not diagnose, prescribe or act on a patient. It can be wrong or unavailable; when it is, the workspace keeps working and you can use the manual controls.",
      },
    ],
  },
  {
    id: "knowledge",
    group: "guide",
    title: "Knowledge",
    summary: "Searching drug labels.",
    topics: [
      {
        title: "Searching drug labels",
        body: "Search by generic name, Indian brand name or topic, optionally narrowed by drug or section. Results are passages from the label, not generated text.",
      },
      {
        title: "Citations and source dates",
        body: "Each result shows its source, section, version, effective date and retrieved date. When sources conflict, both are listed. The index status card shows what is covered.",
      },
    ],
  },
  {
    id: "activity",
    group: "guide",
    title: "Activity log",
    summary: "Who looked at what, and when.",
    topics: [
      {
        title: "Understanding audit history",
        body: "The log records what you did, with time and subject: questions to the assistant, safety reviews, saved views, emailed summaries, and each time you open a patient's chart. Use the filters and date range to narrow it. Records cannot be edited from here.",
      },
    ],
  },
  {
    id: "admin",
    group: "guide",
    title: "Administration",
    summary: "For administrators only.",
    topics: [
      {
        title: "Users, entitlements and invitations",
        body: "Administrators manage who has access, which patients each doctor may see, and invitations for new users. The server enforces these rules whatever the screen shows.",
      },
    ],
  },
  ...PLATFORM_SECTIONS,
  ...TRUST_SECTIONS,
  {
    id: "interface",
    group: "reference",
    title: "Interface and accessibility",
    summary: "Shortcuts and display options.",
    topics: [
      {
        title: "Keyboard shortcuts",
        body: "Ctrl/Cmd + K opens the command palette. Ctrl/Cmd + B collapses or expands the sidebar. Ctrl/Cmd + Shift + F turns focus mode on or off.",
      },
      {
        title: "Sidebar, focus mode and theme",
        body: "The sidebar choice is remembered in this browser. Focus mode hides the surrounding chrome so the record fills the screen. Light and dark themes are available.",
      },
    ],
  },
];
