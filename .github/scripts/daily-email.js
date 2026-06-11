#!/usr/bin/env node
'use strict';

// ============================================================
//  Triple Challenge — daily email
//  Sends a morning email (motivational quote + today's workout +
//  a dad joke) to Mark and Shelley via SendGrid. Run by the
//  .github/workflows/daily-email.yml workflow at 06:30 UTC.
//
//  Env:
//    SENDGRID_API_KEY     (required to actually send)
//    SENDGRID_FROM_EMAIL  (sender; must be a SendGrid-verified sender.
//                          Falls back to MARK_EMAIL if unset.)
//    MARK_EMAIL, SHELLEY_EMAIL  (recipients)
//    DRY_RUN=1            (build + log, do not send)
//    DUMP_HTML=1          (with DRY_RUN, also print the HTML)
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';

// ---- Load the app's challenge data (single source of truth) ----
function loadChallenge() {
  const file = path.join(__dirname, '..', '..', 'content', 'challengeData.js');
  const code = fs.readFileSync(file, 'utf8');
  const ctx = { __exports: {} };
  vm.createContext(ctx);
  // Top-level const/function bindings aren't exposed on the context global,
  // so capture the functions we need from inside the same script scope.
  vm.runInContext(
    code + '\n;Object.assign(__exports, { getTodayProgress, getDayData });',
    ctx
  );
  return ctx.__exports;
}

function getWorkout(challenge) {
  const progress = challenge.getTodayProgress(); // { month, day } or null
  if (!progress) return null;
  const d = challenge.getDayData(progress.month, progress.day);
  if (!d) return null;
  return { month: progress.month, day: progress.day, plank: d.plank, pushups: d.pushups, situps: d.situps };
}

// ---- External content (with graceful fallbacks) ----
async function fetchQuote() {
  try {
    const res = await fetch('https://zenquotes.io/api/today', { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('status ' + res.status);
    const data = await res.json();
    const q = Array.isArray(data) ? data[0] : null;
    if (q && q.q) return { text: q.q, author: q.a || 'Unknown' };
    throw new Error('unexpected response shape');
  } catch (e) {
    console.warn('Quote API failed, using fallback:', e.message);
    return { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' };
  }
}

async function fetchJoke() {
  try {
    const res = await fetch('https://icanhazdadjoke.com/', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Triple Challenge (https://github.com/Learning-Development667/Triple-Challenge)',
      },
    });
    if (!res.ok) throw new Error('status ' + res.status);
    const data = await res.json();
    if (data && data.joke) return data.joke;
    throw new Error('unexpected response shape');
  } catch (e) {
    console.warn('Joke API failed, using fallback:', e.message);
    return "I only know 25 letters of the alphabet. I don't know y.";
  }
}

// ---- Email HTML (navy + electric blue, mobile-friendly) ----
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function fmtTarget(v, unit) {
  if (v === null || v === undefined) return 'Rest day';
  return unit ? `${v}${unit}` : String(v);
}

function buildEmailHtml(name, w, quote, joke) {
  const NAVY_BG = '#061021';
  const CARD = '#0b1e3b';
  const CARD2 = '#10294f';
  const BORDER = '#1b3a6b';
  const BLUE = '#2f9bff';
  const BLUE_BRIGHT = '#4cc2ff';
  const TEXT = '#eaf2ff';
  const MUTED = '#8fb4e8';

  const stat = (label, value) => `
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid ${BORDER};font-family:Arial,Helvetica,sans-serif;color:${MUTED};font-size:14px;">${label}</td>
            <td align="right" style="padding:12px 0;border-bottom:1px solid ${BORDER};font-family:Arial,Helvetica,sans-serif;color:${TEXT};font-size:18px;font-weight:bold;">${esc(value)}</td>
          </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<title>Triple Challenge</title>
</head>
<body style="margin:0;padding:0;background:${NAVY_BG};-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NAVY_BG};margin:0;padding:0;">
  <tr><td align="center" style="padding:20px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:${CARD};border:1px solid ${BORDER};border-radius:18px;overflow:hidden;">
      <tr><td style="padding:30px 26px 18px;text-align:center;border-bottom:2px solid ${BLUE};">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:4px;color:${BLUE_BRIGHT};text-transform:uppercase;font-weight:bold;">&#9889; Triple Challenge</div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;color:${TEXT};margin-top:10px;">Good morning, ${esc(name)}!</div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${MUTED};margin-top:6px;">Day ${w.day} &middot; Month ${w.month}</div>
      </td></tr>

      <tr><td style="padding:22px 26px 6px;">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:2px;color:${BLUE_BRIGHT};text-transform:uppercase;font-weight:bold;margin-bottom:4px;">Today's Workout</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stat('Plank', fmtTarget(w.plank, ''))}${stat('Push-ups', fmtTarget(w.pushups, ' reps'))}${stat('Sit-ups', fmtTarget(w.situps, ' reps'))}
        </table>
      </td></tr>

      <tr><td style="padding:18px 26px 6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD2};border-left:4px solid ${BLUE};border-radius:10px;">
          <tr><td style="padding:16px 18px;">
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;font-style:italic;color:${TEXT};line-height:1.5;">&ldquo;${esc(quote.text)}&rdquo;</div>
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${BLUE_BRIGHT};margin-top:10px;">&mdash; ${esc(quote.author)}</div>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:14px 26px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CARD2};border-radius:10px;">
          <tr><td style="padding:16px 18px;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:2px;color:${BLUE_BRIGHT};text-transform:uppercase;font-weight:bold;margin-bottom:8px;">&#128514; Dad Joke of the Day</div>
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${TEXT};line-height:1.5;">${esc(joke)}</div>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:16px 26px 26px;text-align:center;border-top:1px solid ${BORDER};">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${TEXT};font-weight:bold;">Now go and earn it. &#128170;</div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#5b80b5;margin-top:8px;">Triple Challenge &middot; quotes by ZenQuotes.io</div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ---- SendGrid ----
async function sendEmail({ apiKey, from, to, subject, html }) {
  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from, name: 'Triple Challenge' },
    subject,
    content: [{ type: 'text/html', value: html }],
  };
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.status !== 202) {
    const text = await res.text().catch(() => '');
    throw new Error(`SendGrid responded ${res.status}: ${text}`);
  }
}

async function main() {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL || process.env.MARK_EMAIL;
  const recipients = [
    { name: 'Mark', email: process.env.MARK_EMAIL },
    { name: 'Shelley', email: process.env.SHELLEY_EMAIL },
  ];

  if (!DRY_RUN) {
    if (!apiKey) throw new Error('SENDGRID_API_KEY is not set');
    if (!from) throw new Error('No sender address (set SENDGRID_FROM_EMAIL or MARK_EMAIL)');
  }

  const challenge = loadChallenge();
  const workout = getWorkout(challenge);
  if (!workout) {
    console.log('Today is outside the 90-day challenge window — no email sent.');
    return;
  }

  const [quote, joke] = await Promise.all([fetchQuote(), fetchJoke()]);
  const subject = `Triple Challenge — Day ${workout.day}, Month ${workout.month} \u{1F4AA}`;

  let failures = 0;
  for (const r of recipients) {
    if (!r.email) { console.warn(`No email address for ${r.name} — skipping.`); continue; }
    const html = buildEmailHtml(r.name, workout, quote, joke);
    if (DRY_RUN) {
      console.log(`--- DRY RUN: would email ${r.name} <${r.email}> from <${from || '(unset)'}>`);
      console.log(`    Subject: ${subject}`);
      console.log(`    Workout: Day ${workout.day} / Month ${workout.month} · plank=${workout.plank} pushups=${workout.pushups} situps=${workout.situps}`);
      console.log(`    Quote: "${quote.text}" — ${quote.author}`);
      console.log(`    Joke: ${joke}`);
      if (process.env.DUMP_HTML === '1') console.log(html);
      continue;
    }
    try {
      await sendEmail({ apiKey, from, to: r.email, subject, html });
      console.log(`Sent to ${r.name} <${r.email}>`);
    } catch (e) {
      failures++;
      console.error(`Failed to send to ${r.name} <${r.email}>:`, e.message);
    }
  }

  if (failures > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
