# Where website form submissions go

Every form (homepage, Contact Us, Careers → Apply) posts to `/api/submit`, which delivers each enquiry to HR in up to two ways. **You need at least one.** Turn both on for the best result.

| Destination | What HR gets | Needs | Environment variable (Vercel) |
|---|---|---|---|
| **Email to hr@ccas-tech.com** | One email per enquiry. Reply goes straight to the sender. | A free Resend account (5 minutes) | `RESEND_API_KEY` |
| **Excel table** | One new row per enquiry in `CCAS Tech - website enquiries.xlsx` | A Power Automate flow (needs a Premium licence) | `POWER_AUTOMATE_URL` |

If neither is set, the form falls back to opening the visitor's own email app, and most enquiries are lost. Check regularly that this has not happened (see "Test it").

---

## A. Email to HR (do this first, about 5 minutes)

1. Go to <https://resend.com> and sign up **using `hr@ccas-tech.com`** as the account email. (The free sender below can only deliver to the email the Resend account was created with, which is why it must be hr@.)
2. In Resend: **API Keys → Create API Key** (permission: *Sending access*). Copy the key. It starts with `re_`.
3. In Vercel: your project → **Settings → Environment Variables** → add
   - Name: `RESEND_API_KEY`  Value: the key  (all environments)
   - Do **not** put `PUBLIC_` in front of the name. That would publish the key.
4. **Deployments → ⋯ → Redeploy** the latest deployment.
5. Test it (below). The first email may land in Junk: open it and choose "Not junk", or add a mail rule for the sender `onboarding@resend.dev`.

### Later: send from your own domain (optional)
Verify `ccas-tech.com` in Resend (it shows DNS records to add at your domain provider). Then add `RESEND_FROM` = `CCAS Tech Website <forms@ccas-tech.com>` in Vercel and redeploy. After that you can also set `HR_EMAIL` to deliver somewhere other than hr@ (or to several people via a shared mailbox).

---

## B. Excel table (optional, needs Power Automate Premium)

Follow [`form-to-excel-power-automate.md`](form-to-excel-power-automate.md). The workbook already exists in the OneDrive of hr@ccas-tech.com. Add `POWER_AUTOMATE_URL` in Vercel and redeploy.

---

## Test it

Submit the Contact Us form on the live site with a real name and your own email.
- **Success:** the page says "Thanks — a specialist will reply within one business day", and the email arrives at hr@ (and a row appears in Excel if B is on).
- **"Your email app should open…":** neither variable is set (or the redeploy has not happened yet).
- **"Something went wrong sending that":** every destination you turned on failed. In Vercel → project → **Logs**, look for `email delivery failed` or `excel delivery failed`.

Delete any test rows or emails afterwards.

## How it protects you
Hidden trap field (bots are discarded silently), a per-visitor rate limit, a block on posts from other websites, a 3,000-character cap per field, plain-text email only (nothing a visitor types can run), and Excel-formula neutralising. If one destination is down but the other works, the visitor still sees success and nothing is lost.
