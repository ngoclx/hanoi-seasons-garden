// Vercel Node serverless function — accepts lead form POST from /js/main.js
// and forwards a formatted message to a Telegram bot.
//
// Required env vars (set in Vercel project → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN  — full token, e.g. "8861260540:AAG..."
//   TELEGRAM_CHAT_ID    — numeric chat ID (private or group)
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

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('lead.js: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env');
    res.status(500).json({ error: 'misconfigured' });
    return;
  }

  const lines = [
    '🏠 <b>Lead mới — LUMIÈRE HSG</b>',
    `👤 <b>Tên:</b> ${esc(name)}`,
    `📞 <b>SĐT:</b> ${esc(phone)}`,
  ];
  if (message) lines.push(`💬 <b>Nội dung:</b> ${esc(message)}`);
  lines.push(`📋 <b>Yêu cầu bảng giá:</b> ${wantPricelist ? 'Có' : 'Không'}`);
  lines.push('');
  lines.push(`📲 Zalo: https://zalo.me/${encodeURIComponent(phone)}`);
  lines.push(`☎️  Gọi: tel:${phone}`);
  const text = lines.join('\n');

  try {
    const tgResp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    if (!tgResp.ok) {
      const errBody = await tgResp.text().catch(() => '');
      console.error('lead.js: telegram returned', tgResp.status, errBody.slice(0, 400));
      res.status(502).json({ error: 'notify_failed' });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('lead.js: fetch threw', err);
    res.status(502).json({ error: 'notify_failed' });
  }
};

// Telegram HTML parse-mode requires <, >, & escaped.
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
