# Send website form submissions to a Microsoft Excel file (Power Automate)

Every submission from the **homepage form**, the **Contact** page and **Consultants → Apply** becomes a new row in an Excel workbook stored in your Microsoft 365 account (OneDrive or SharePoint).

```
Website form ──► /api/submit (Vercel function) ──► Power Automate flow ──► Excel table (new row)
                  checks, blocks spam,              "When an HTTP request       "Add a row into
                  hides the flow's secret URL        is received"                a table"
```

The website part is already built. You do the Microsoft part once (about 15 minutes), signed in to the Microsoft 365 account that should own the data.

## Before you start: licence check
The flow starts with **"When an HTTP request is received"**, which Microsoft classes as a **Premium** trigger. It needs a **Power Automate Premium** licence (or a per-flow plan) on the account that owns the flow. A plain Microsoft 365 Business licence usually does **not** include it.
If you can't get Premium, tell us. There is a no-Premium alternative (the website function writes to Excel directly through Microsoft Graph), but it needs an Azure app registration and an admin to approve it.

---

## Step 1. The Excel file (already created for you)
A ready-made workbook called **CCAS Tech - website enquiries.xlsx** was created in the OneDrive of the Microsoft 365 account that was connected during setup. It has:
- a sheet named **Enquiries**
- an Excel **table** named `Submissions`, with these 10 headings in row 1 (A to J):

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Submitted (UTC) | Submitted (local) | Type | Name | Email | Company | LinkedIn / portfolio | Role / skill | Message | Page |

- one **SAMPLE ROW** (an Excel table must contain at least one data row). **Delete that row after your first real test** (right-click it → Delete → Table Rows).

Need it elsewhere (e.g. a shared SharePoint site so the whole team can open it)? Just move or copy the file there in OneDrive/SharePoint; the flow in Step 3 points at wherever the file lives when you pick it.

<details><summary>Making the workbook yourself instead</summary>

1. Create a workbook in OneDrive for Business or a SharePoint library.
2. Type the 10 headings above in row 1, select them, **Insert → Table** (tick *My table has headers*).
3. **Table Design → Table Name** → `Submissions`. Close the file.

The flow writes into a **table**, not a plain range.
</details>

## Step 2. Create the flow
1. Go to <https://make.powerautomate.com>, then **Create → Instant cloud flow**.
2. Name it **CCAS website enquiries → Excel**. Under triggers choose **When an HTTP request is received**, then **Create**.
3. In the trigger, set **Who can trigger the flow?** to **Anyone**.
   (The URL contains a secret signature. Only your website's server function knows it.)
4. Click **Use sample payload to generate schema**, paste this, then **Done**:

```json
{
  "submittedAtUtc": "2026-10-08T21:00:00.000Z",
  "submittedAtLocal": "2026-10-08 17:00",
  "type": "Hiring talent",
  "name": "Jane Cooper",
  "email": "jane@acme.com",
  "company": "Acme",
  "profileUrl": "",
  "role": "DevOps Engineer",
  "message": "We need two engineers for three months.",
  "page": "/contact/"
}
```

## Step 3. Add the Excel action
1. **+ New step → Excel Online (Business) → Add a row into a table**.
2. Fill in:
   - **Location:** OneDrive for Business (or your SharePoint site)
   - **Document Library:** OneDrive (or the SharePoint library)
   - **File:** pick the workbook from Step 1
   - **Table:** `Submissions`
3. The column boxes appear. Click each box and choose the matching item from **Dynamic content**:

   | Excel column | Dynamic content |
   |---|---|
   | Submitted (UTC) | `submittedAtUtc` |
   | Submitted (local) | `submittedAtLocal` |
   | Type | `type` |
   | Name | `name` |
   | Email | `email` |
   | Company | `company` |
   | LinkedIn / portfolio | `profileUrl` |
   | Role / skill | `role` |
   | Message | `message` |
   | Page | `page` |

## Step 4. Reply to the website
1. **+ New step → Response** (the "Request" connector).
2. **Status Code:** `200`. **Body:** `{"ok": true}`.
   (Keep the Response **after** the Excel step, so the website only says "Thanks" once the row has been saved.)

## Step 5. Stop simultaneous submissions colliding
Excel files lock while being written, so two submissions at the same instant can fail.
1. Click the **three dots (⋯)** on the **trigger** → **Settings**.
2. Turn **Concurrency control** **On**, set **Degree of Parallelism** to `1`, **Done**.

## Step 6. Save and copy the URL
1. **Save**. The trigger now shows **HTTP POST URL**. Click the copy icon.
2. Treat this URL like a password. Anyone who has it can add rows to your workbook.

## Step 7. Connect the website
1. Vercel → your project → **Settings → Environment Variables**.
2. Add:
   - **Name:** `POWER_AUTOMATE_URL`  **Value:** the URL from Step 6 (all environments)
   - *(optional)* **Name:** `FORM_TIMEZONE`  **Value:** e.g. `America/Chicago`. Sets the "Submitted (local)" column (default `America/New_York`).
3. Do **not** add `PUBLIC_` to the name. That would publish the URL to every visitor.
4. **Deployments → ⋯ → Redeploy** the latest deployment.

## Step 8. Test
1. Open your live site → **Contact** → fill in and send the form. You should see "Thanks — a specialist will reply…".
2. Open the Excel file (refresh). A new row appears within a few seconds.
3. If not, open Power Automate → your flow → **28-day run history** to see which step failed.

---

## Good to know
- **Where it lives:** the Excel file is in your Microsoft 365 storage. Share it with colleagues with Excel's normal **Share** button.
- **Email alerts (optional):** add **Send an email (V2)** after the Excel step to notify `info@ccastech.com` for every enquiry.
- **Spam protection:** hidden trap field (bots are discarded), per-visitor rate limit (best-effort), cross-site posts blocked, 3,000 characters per field.
- **Formula safety:** any value starting with `=`, `+`, `-` or `@` is stored with a leading `'` so it can't run as an Excel formula.
- **Rotating the secret URL:** in the flow, edit the trigger and regenerate the URL (or delete and re-add the trigger), then update `POWER_AUTOMATE_URL` in Vercel and redeploy.
- **Until it's set up:** if `POWER_AUTOMATE_URL` isn't set, the form opens the visitor's email app with their details instead of losing them.
- **Testing locally:** `npm run dev` doesn't run the `api/` folder, so the form falls back to email. To test the function locally, run `npx vercel dev` with `POWER_AUTOMATE_URL` in `.env`.
