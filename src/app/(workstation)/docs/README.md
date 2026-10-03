# Documentation

**Purpose:** In-product user guide for clinicians: getting started, patients, the assistant and its limits, knowledge, activity, admin, shortcuts. Not developer documentation.

**Endpoints:** none. Static content in `lib/sections.ts`.

**Requirement IDs:** UI improvement plan P0.4.

**States handled:** static page, so no loading, empty or error state. It shows no patient data, so no synthetic banner is needed.

**Keyboard:** the contents list is plain anchor links; each section is a headed landmark.

**Keep current:** edit `lib/sections.ts` when a screen, shortcut or limitation changes.
