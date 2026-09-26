# dharalanddev.com

Static site for Dhara Land & Development LLP. Plain HTML/CSS/JS — no build step.
Push to `main` → GitHub Actions mirrors the repo to MilesWeb `public_html` over SFTP
(`.github/workflows/deploy.yml`). `.htaccess`, `.well-known/` and `cgi-bin/` on the
server are never touched.

## Pages
index · dhara-model · upcoming-projects (waitlist form) · land-advisory · why-nilgiris ·
about · contact (enquiry form) · privacy · thank-you · 404

Header and footer are repeated in every page — change all pages together.

## Before launch
1. **Zoho forms** - DONE 26 Sep 2026. One Leads webform "Dhara Website" in Dhara's CRM
   (org 60073533465); both site forms post to it (IDs in upcoming-projects.html / contact.html).
   Fields: Company (hidden, "Website enquiry" - mandatory in Zoho), First/Last Name, Email, Phone,
   Description. Country / location / size / budget / purpose / timeline / message and the
   originating form ("Submitted from: Waitlist|Contact") are folded into Description by
   assets/js/site.js. Redirect: https://dharalanddev.com/thank-you.html.
2. **Photos** — search for `PHOTO:` comments and `.hero-photo` in site.css. Real Nilgiris
   photography only (see Dhara Website Blueprint §6).
3. **404 page** — `.htaccess` is not deployed (server-managed). Add `ErrorDocument 404 /404.html` to it once via mPanel File Manager.
4. **WhatsApp** — intentionally hidden until the number is decided.

## Wording guardrails
- Never say a Dhara project *is* DTCP-approved until the sanction is in hand.
- No survey/patta numbers, exact villages or prices on the public site.
- No return/appreciation promises. No bookings, pricing or allotment language
  before TNRERA registration.
