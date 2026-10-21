export async function sendTelegram(text: string) {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
        }),
      }
    );
    if (!res.ok) console.error("Telegram menolak:", res.status, await res.text());
    return res.ok;
  } catch (e: any) {
    console.error("Telegram gagal tersambung:", e?.cause?.code ?? e?.cause ?? e);
    return false;
  }
}
