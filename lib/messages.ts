const rp = (n: number) => "Rp" + Number(n).toLocaleString("id-ID");
export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const pick = <T>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const bar = (pct: number) => {
  const f = Math.round(pct / 10);
  return "▰".repeat(f) + "▱".repeat(10 - f);
};
const freqLabel = { daily: "harian", weekly: "mingguan", monthly: "bulanan", payday: "tiap gajian" } as const;

type G = {
  name: string;
  target: number;
  saved: number;
  amount_per_period: number;
  frequency: string;
};

const pctOf = (g: G) => Math.min(100, Math.round((Number(g.saved) / Number(g.target)) * 100));

const hype = (pct: number) =>
  pct >= 90
    ? "Garis finis sudah kelihatan, gas terus! 🏁"
    : pct >= 75
    ? "Tinggal sedikit lagi, jangan kendor! 🔥"
    : pct >= 50
    ? "Sudah lewat setengah jalan, hebat! 💪"
    : pct >= 25
    ? "Progres bagus, pertahankan ritmenya! ✨"
    : "Awal yang bagus, setiap rupiah berarti! 🌱";

export function reminderMsg(g: G) {
  const pct = pctOf(g);
  const sisa = Math.max(0, Number(g.target) - Number(g.saved));
  const opener = pick([
    "⏰ Waktunya nabung, bestie!",
    "💰 Psst... celengan kamu kangen nih!",
    "🚀 Satu langkah lagi menuju impianmu!",
    "🌟 Konsisten itu keren. Yuk nabung hari ini!",
    "🐷 Si celengan lagi nunggu setoran kamu!",
  ]);
  return (
    `${opener}\n\n` +
    `🎯 <b>${esc(g.name)}</b>\n` +
    `💵 Setor kali ini: <b>${rp(g.amount_per_period)}</b>\n\n` +
    `${bar(pct)} <b>${pct}%</b>\n` +
    `📊 Terkumpul ${rp(g.saved)} dari ${rp(g.target)}\n` +
    `🏁 Sisa ${rp(sisa)} lagi\n\n` +
    hype(pct)
  );
}

export function newGoalMsg(g: Omit<G, "saved">) {
  const f = freqLabel[g.frequency as keyof typeof freqLabel] ?? g.frequency;
  return (
    `🎯 <b>Target baru dibuat!</b>\n\n` +
    `✨ <b>${esc(g.name)}</b>\n` +
    `💎 Target: <b>${rp(g.target)}</b>\n` +
    `🔔 Pengingat ${f}: setor ${rp(g.amount_per_period)}\n\n` +
    `Perjalanan seribu langkah dimulai dari satu setoran. Semangat! 🚀`
  );
}

export function depositMsg(g: G, amt: number) {
  const pct = pctOf(g);
  if (Number(g.saved) >= Number(g.target)) {
    return (
      `🎉🎉 <b>TARGET TERCAPAI!</b> 🎉🎉\n\n` +
      `🏆 <b>${esc(g.name)}</b> sudah terkumpul <b>${rp(g.saved)}</b>\n\n` +
      `Kamu berhasil! Saatnya merayakan kerja kerasmu. 🥳`
    );
  }
  const opener = pick([
    "🎉 Mantap! Setoran masuk!",
    "💸 Yes, celengan makin gemuk!",
    "🔥 Konsisten banget, keren!",
    "👏 Satu setoran lagi tercatat!",
  ]);
  return (
    `${opener}\n\n` +
    `➕ <b>${rp(amt)}</b> untuk <b>${esc(g.name)}</b>\n\n` +
    `${bar(pct)} <b>${pct}%</b>\n` +
    `📊 ${rp(g.saved)} dari ${rp(g.target)}\n\n` +
    hype(pct)
  );
}

export function deleteMsg(name: string) {
  return `🗑️ Target <b>${esc(name)}</b> sudah dihapus.`;
}

export function paydayMsg(goals: G[], salary?: number | null) {
  const total = goals.reduce((a, g) => a + Number(g.amount_per_period), 0);
  const lines = goals
    .map((g) => `🎯 ${esc(g.name)} — <b>${rp(g.amount_per_period)}</b>`)
    .join("\n");
  const opener = pick([
    "💵 <b>GAJIAN DATANG!</b> 🎊",
    "🎉 <b>Yeay, gajian!</b> Dompet lagi senyum nih 😄",
    "💸 <b>Gajian hari ini!</b> Waktunya bayar diri sendiri dulu.",
  ]);
  const extra =
    salary && salary > 0
      ? `\n📌 Itu sekitar <b>${Math.round((total / salary) * 100)}%</b> dari gaji, sisa ${rp(Math.max(0, salary - total))} untuk kebutuhan.`
      : "";
  return (
    `${opener}\n\n` +
    `Sebelum dibelanjakan, sisihkan dulu ya:\n\n${lines}\n\n` +
    `💰 Total ditabung: <b>${rp(total)}</b>${extra}\n\n` +
    `Bayar dirimu sendiri dulu, baru yang lain. 💪`
  );
}
