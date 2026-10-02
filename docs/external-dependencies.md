# External dependencies (UI)

The full list for both repos, with the Snowflake, data and hosting items, is in `medynium-apis/docs/external-dependencies.md`. This page covers only what the UI needs.

| Item                                                           | Needed by    | Status   | From you                                                                                               |
| -------------------------------------------------------------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------ |
| Vercel account, repo connected                                 | First deploy | Needed   | Create the account, import `medynium-ui`                                                               |
| `BACKEND_URL`                                                  | First deploy | Needed   | The deployed API URL, once the Render service exists                                                   |
| Design direction (brand name, logo, colors, reference screens) | Slice 3      | Decision | The prototype is not the target look. Until you send something, the UI uses neutral shadcn/ui defaults |
| Locale and currency for claims                                 | Slice 3      | Decision | The prototype shows rupees; Synthea data is US and USD                                                 |
| Custom domain                                                  | Optional     | Optional | Not needed; the `/api` proxy keeps cookies first-party on the default Vercel URL                       |

Variables: see `.env.example`. `BACKEND_URL` is server-side only; `NEXT_PUBLIC_APP_NAME` is public.
