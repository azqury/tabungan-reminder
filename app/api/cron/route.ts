import { db } from "@/lib/supabase";
import { sendTelegram } from "@/lib/telegram";
import { reminderMsg, paydayMsg } from "@/lib/messages";
import { isPaydayToday, wibDateStr } from "@/lib/payday";

const interval = { daily: 1, weekly: 7, monthly: 30 } as const;

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
    return new Response("Unauthorized", { status: 401 });

  const supa = db();
  const { data: goals } = await supa.from("goals").select("*");
  const { data: st } = await supa.from("settings").select("*").eq("id", 1).maybeSingle();
  const today = wibDateStr();
  let sent = 0;
  let failed = 0;

  // Pengingat berkala (harian / mingguan / bulanan)
  for (const g of goals ?? []) {
    if (g.frequency === "payday") continue;
    if (Number(g.saved) >= Number(g.target)) continue;
    const last = g.last_reminded ? new Date(g.last_reminded).getTime() : 0;
    const days = (Date.now() - last) / 86400000;
    if (days < interval[g.frequency as keyof typeof interval]) continue;

    const ok = await sendTelegram(reminderMsg(g));
    if (!ok) {
      failed++;
      continue;
    }
    await supa.from("goals").update({ last_reminded: today }).eq("id", g.id);
    sent++;
  }

  // Pengingat gajian: satu pesan ringkasan
  if (st?.payday_day && isPaydayToday(Number(st.payday_day))) {
    const due = (goals ?? []).filter(
      (g) =>
        g.frequency === "payday" &&
        Number(g.saved) < Number(g.target) &&
        g.last_reminded !== today
    );
    if (due.length) {
      const ok = await sendTelegram(paydayMsg(due, st.salary ? Number(st.salary) : null));
      if (ok) {
        await supa.from("goals").update({ last_reminded: today }).in("id", due.map((g) => g.id));
        sent += due.length;
      } else {
        failed += due.length;
      }
    }
  }

  return Response.json({ sent, failed });
}
