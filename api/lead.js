// Vercel Node serverless function — accepts lead form POST from /js/main.js
// and fans the lead out to two channels IN PARALLEL:
//   1. Telegram bot  (instant phone notification)
//   2. Resend email  (durable record / inbox backup)
//
// The request succeeds (200) if AT LEAST ONE channel delivers, so a hiccup
// on one channel never loses a lead. It fails (502) only if every configured
// channel fails, and 500 only if no channel is configured at all.
//
// Required env vars (Vercel → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN  — full bot token
//   TELEGRAM_CHAT_ID    — numeric chat ID (private or group)
//   RESEND_API_KEY      — Resend API key (re_...)          [email channel]
//   LEAD_EMAIL_TO       — recipient(s), comma-separated     [email channel]
//   LEAD_EMAIL_FROM     — verified sender, e.g. "LUMIÈRE HSG <lead@pkdhanoiseasonsgarden.com>"
//                         (optional; defaults to onboarding@resend.dev for testing)
//
// A channel is only attempted when its env vars are present, so you can run
// Telegram-only, email-only, or both.
//
// Client posts application/x-www-form-urlencoded (Vercel auto-parses to req.body).
// Replies with JSON { ok: true } on success.

module.exports = async function handler(req, res) {
  // Always set no-store on the response — leads are PII-adjacent.
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const body = req.body || {};

  // Honeypot — bots that fill every field get a silent 200.
  if (body._gotcha) {
    res.status(200).json({ ok: true });
    return;
  }

  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').trim();
  const message = String(body.message || '').trim().slice(0, 1000);
  const wantPricelist = body.want_pricelist === '1' || body.want_pricelist === 'on';

  if (name.length < 2 || name.length > 100) {
    res.status(400).json({ error: 'invalid_name' });
    return;
  }
  if (!/^0\d{9}$/.test(phone)) {
    res.status(400).json({ error: 'invalid_phone' });
    return;
  }

  // Build the notification tasks for every configured channel.
  const tasks = [];

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    tasks.push(sendTelegram({ token, chatId, name, phone, message, wantPricelist }));
  }

  const resendKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.LEAD_EMAIL_TO;
  if (resendKey && emailTo) {
    tasks.push(sendEmail({ resendKey, emailTo, name, phone, message, wantPricelist }));
  }

  if (tasks.length === 0) {
    console.error('lead.js: no notification channel configured (Telegram/Resend env missing)');
    res.status(500).json({ error: 'misconfigured' });
    return;
  }

  // Fire all channels concurrently; a failure in one must not abort the other.
  const results = await Promise.allSettled(tasks);
  let anyOk = false;
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value && r.value.ok) {
      anyOk = true;
    } else {
      const detail = r.status === 'rejected' ? r.reason : r.value;
      console.error('lead.js: channel failed', safeStr(detail));
    }
  }

  if (anyOk) {
    res.status(200).json({ ok: true });
  } else {
    res.status(502).json({ error: 'notify_failed' });
  }
};

// ---- Telegram channel -------------------------------------------------------

async function sendTelegram({ token, chatId, name, phone, message, wantPricelist }) {
  const lines = [
    '🏠 <b>Lead mới — LUMIÈRE HSG</b>',
    `👤 <b>Tên:</b> ${escHtml(name)}`,
    `📞 <b>SĐT:</b> ${escHtml(phone)}`,
  ];
  if (message) lines.push(`💬 <b>Nội dung:</b> ${escHtml(message)}`);
  lines.push(`📋 <b>Yêu cầu bảng giá:</b> ${wantPricelist ? 'Có' : 'Không'}`);
  lines.push('');
  lines.push(`📲 Zalo: https://zalo.me/${encodeURIComponent(phone)}`);
  lines.push(`☎️  Gọi: tel:${phone}`);

  try {
    const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    if (!resp.ok) {
      const errBody = await resp.text().catch(() => '');
      return { ok: false, channel: 'telegram', status: resp.status, detail: errBody.slice(0, 400) };
    }
    return { ok: true, channel: 'telegram' };
  } catch (err) {
    return { ok: false, channel: 'telegram', detail: String(err) };
  }
}

// ---- Resend email channel ---------------------------------------------------

async function sendEmail({ resendKey, emailTo, name, phone, message, wantPricelist }) {
  const from = process.env.LEAD_EMAIL_FROM || 'LUMIÈRE HSG <onboarding@resend.dev>';
  const to = emailTo.split(',').map((s) => s.trim()).filter(Boolean);
  const subject = `Lead mới — LUMIÈRE HSG: ${name.slice(0, 60)} (${phone})`;

  const rows = [['Tên', name], ['Số điện thoại', phone]];
  if (message) rows.push(['Nội dung', message]);
  rows.push(['Yêu cầu bảng giá', wantPricelist ? 'Có' : 'Không']);

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#F1EFE8;font-family:Arial,Helvetica,sans-serif;color:#30413B;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;padding:24px;">
    <h2 style="color:#455F39;margin:0 0 16px;font-size:20px;">🏠 Lead mới — LUMIÈRE Hanoi Seasons Garden</h2>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:15px;width:100%;">
      ${rows.map(([k, v]) => `<tr>
        <td style="font-weight:bold;padding:6px 12px 6px 0;vertical-align:top;white-space:nowrap;">${escHtml(k)}</td>
        <td style="padding:6px 0;">${escHtml(v)}</td>
      </tr>`).join('')}
    </table>
    <p style="margin:18px 0 0;font-size:14px;">
      📲 Zalo: <a href="https://zalo.me/${encodeURIComponent(phone)}" style="color:#455F39;">zalo.me/${escHtml(phone)}</a><br>
      ☎️ Gọi: <a href="tel:${encodeURIComponent(phone)}" style="color:#455F39;">${escHtml(phone)}</a>
    </p>
    <p style="color:#9aa093;font-size:12px;margin-top:22px;">Gửi tự động từ form đăng ký pkdhanoiseasonsgarden.com</p>
  </div>
  </body></html>`;

  const textLines = [
    'Lead mới — LUMIÈRE HSG',
    `Tên: ${name}`,
    `SĐT: ${phone}`,
  ];
  if (message) textLines.push(`Nội dung: ${message}`);
  textLines.push(`Yêu cầu bảng giá: ${wantPricelist ? 'Có' : 'Không'}`);
  textLines.push(`Zalo: https://zalo.me/${phone}`);

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html, text: textLines.join('\n') }),
    });
    if (!resp.ok) {
      const errBody = await resp.text().catch(() => '');
      return { ok: false, channel: 'email', status: resp.status, detail: errBody.slice(0, 400) };
    }
    return { ok: true, channel: 'email' };
  } catch (err) {
    return { ok: false, channel: 'email', detail: String(err) };
  }
}

// ---- helpers ----------------------------------------------------------------

// Telegram HTML parse-mode + HTML email body both require <, >, & escaped.
function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function safeStr(v) {
  try {
    return typeof v === 'string' ? v : JSON.stringify(v);
  } catch {
    return String(v);
  }
}
