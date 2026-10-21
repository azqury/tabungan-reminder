import { Suspense } from "react";
import { db } from "@/lib/supabase";
import { addGoal, deposit, deleteGoal, updateGoal, saveSettings } from "./actions";
import { daysToPayday } from "@/lib/payday";
import DeleteButton from "@/components/DeleteButton";
import Piggy from "@/components/Piggy";
import GoalIcon from "@/components/GoalIcon";
import Tilt from "@/components/Tilt";
import CurrencyInput from "@/components/CurrencyInput";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";

type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  amount_per_period: number;
  frequency: "daily" | "weekly" | "monthly" | "payday";
};
type Settings = { payday_day: number | null; salary: number | null };
type Color = { a: string; b: string };

const rp = (n: number) => "Rp" + Number(n).toLocaleString("id-ID");
const freq = {
  daily: "Harian",
  weekly: "Mingguan",
  monthly: "Bulanan",
  payday: "Tiap gajian",
} as const;

const palette: Color[] = [
  { a: "#34d399", b: "#22d3ee" },
  { a: "#a78bfa", b: "#f472b6" },
  { a: "#fbbf24", b: "#fb7185" },
  { a: "#38bdf8", b: "#818cf8" },
  { a: "#a3e635", b: "#34d399" },
  { a: "#e879f9", b: "#fb923c" },
];
const g90 = (c: Color) => `linear-gradient(90deg, ${c.a}, ${c.b})`;
const g135 = (c: Color) => `linear-gradient(135deg, ${c.a}, ${c.b})`;

const icons: [RegExp, string][] = [
  [/laptop|komputer|pc/i, "💻"],
  [/hp|iphone|ponsel|handphone/i, "📱"],
  [/motor|mobil|kendaraan/i, "🏍️"],
  [/rumah|tanah|kos/i, "🏠"],
  [/umroh|haji/i, "🕋"],
  [/liburan|jalan|trip|wisata|tiket/i, "✈️"],
  [/nikah|kawin|wedding/i, "💍"],
  [/kuliah|sekolah|kursus|buku/i, "🎓"],
  [/darurat|dana/i, "🛟"],
  [/kamera|foto/i, "📷"],
  [/game|ps5|konsol/i, "🎮"],
];
const iconFor = (name: string) => icons.find(([r]) => r.test(name))?.[1] ?? "🎯";

const input =
  "w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-fuchsia-300/70 focus:ring-2 focus:ring-fuchsia-300/25";

function Stat({ label, children, hint, c }: { label: string; children: React.ReactNode; hint?: string; c: Color }) {
  return (
    <div className="card rounded-2xl p-4 text-slate-900 shadow-lg" style={{ background: g135(c) }}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-xl font-extrabold sm:text-2xl">{children}</p>
      {hint && <p className="mt-0.5 text-xs font-medium opacity-80">{hint}</p>}
    </div>
  );
}

function Marquee() {
  const items = [
    "Konsisten itu kunci",
    "Satu setoran sekali waktu",
    "Bayar dirimu sendiri dulu",
    "Impian butuh langkah kecil",
    "Sabar, hasilnya nyata",
  ];
  const row = items.map((t, i) => (
    <span key={i} className="mx-6 whitespace-nowrap">✦ {t}</span>
  ));
  return (
    <div className="overflow-hidden rounded-full border border-white/10 bg-white/5 py-2 text-sm text-slate-300">
      <div className="marquee flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}

function PaydayPanel({ s, goals }: { s: Settings | null; goals: Goal[] }) {
  const day = s?.payday_day ?? null;
  const salary = s?.salary ? Number(s.salary) : 0;
  const list = goals.filter((g) => g.frequency === "payday" && Number(g.saved) < Number(g.target));
  const total = list.reduce((a, g) => a + Number(g.amount_per_period), 0);
  const pctSalary = salary ? Math.round((total / salary) * 100) : null;
  const left = day ? daysToPayday(day) : null;

  return (
    <section
      className="space-y-4 rounded-2xl border p-5"
      style={{
        borderColor: "#fbbf2466",
        background: "linear-gradient(135deg, #fbbf2428, #fb718522 60%, rgba(255,255,255,0.05))",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Mode Gajian 💵</h2>
          <p className="text-xs text-slate-300">
            Tentukan berapa yang langsung disisihkan begitu gajian masuk.
          </p>
        </div>
        {left !== null && (
          <span className={`rounded-full bg-amber-300/20 px-3 py-1 text-xs font-bold text-amber-200 ${left === 0 ? "pop" : ""}`}>
            {left === 0 ? "Hari ini gajian! 🎉" : `${left} hari lagi`}
          </span>
        )}
      </div>

      {day && (
        <div className="rounded-xl bg-black/25 p-4">
          <p className="text-xs text-slate-300">Saat gajian tanggal {day}, sisihkan</p>
          <p className="text-2xl font-extrabold text-amber-200 sm:text-3xl">{rp(total)}</p>

          {list.length > 0 ? (
            <ul className="mt-3 space-y-1.5 text-sm">
              {list.map((g) => (
                <li key={g.id} className="flex justify-between gap-3">
                  <span>{iconFor(g.name)} {g.name}</span>
                  <span className="font-semibold">{rp(g.amount_per_period)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-300">
              Belum ada target bertipe &quot;Tiap gajian&quot;. Pilih frekuensi itu saat membuat atau mengubah target.
            </p>
          )}

          {pctSalary !== null && (
            <p className="mt-3 text-sm text-slate-200">
              📌 Sekitar <b>{pctSalary}%</b> dari gaji, sisa <b>{rp(Math.max(0, salary - total))}</b> untuk kebutuhan.
              {total > salary && <span className="text-rose-300"> ⚠️ Total tabungan melebihi gaji.</span>}
            </p>
          )}
        </div>
      )}

      <form action={saveSettings} className="grid gap-2 sm:grid-cols-3">
        <input
          name="payday_day"
          type="number"
          min="1"
          max="31"
          defaultValue={day ?? undefined}
          placeholder="Tanggal gajian (1-31)"
          required
          className={input}
        />
        <CurrencyInput name="salary" defaultValue={s?.salary ?? undefined} placeholder="Gaji bulanan (opsional)" className={input} />
        <button className="rounded-xl bg-white/15 py-2.5 text-sm font-bold transition hover:bg-white/20 active:scale-95">
          Simpan
        </button>
      </form>
    </section>
  );
}

async function Dashboard() {
  const supa = db();
  const [{ data }, { data: st }] = await Promise.all([
    supa.from("goals").select("*").order("created_at", { ascending: false }),
    supa.from("settings").select("*").eq("id", 1).maybeSingle(),
  ]);
  const goals = (data ?? []) as Goal[];
  const settings = (st ?? null) as Settings | null;

  const totalTarget = goals.reduce((a, g) => a + Number(g.target), 0);
  const totalSaved = goals.reduce((a, g) => a + Number(g.saved), 0);
  const done = goals.filter((g) => Number(g.saved) >= Number(g.target)).length;
  const overall = totalTarget ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  return (
    <>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Reveal from="zoom" delay={0}>
          <Stat c={palette[0]} label="Total terkumpul" hint={`${overall}% dari semua target`}>
            <CountUp value={totalSaved} prefix="Rp" />
          </Stat>
        </Reveal>
        <Reveal from="zoom" delay={90}>
          <Stat c={palette[1]} label="Total target">
            <CountUp value={totalTarget} prefix="Rp" />
          </Stat>
        </Reveal>
        <Reveal from="zoom" delay={180}>
          <Stat c={palette[2]} label="Target tercapai">
            {done} / {goals.length}
          </Stat>
        </Reveal>
      </section>

      <Reveal from="left">
        <PaydayPanel s={settings} goals={goals} />
      </Reveal>

      <section className="space-y-4">
        <Reveal>
          <h2 className="text-xl font-bold">Target kamu ✨</h2>
        </Reveal>

        {goals.length === 0 && (
          <Reveal from="zoom">
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-slate-300">
              <div className="bob mb-2 text-4xl">🐷</div>
              Belum ada target. Buat target pertamamu di atas!
            </div>
          </Reveal>
        )}

        {goals.map((g, i) => {
          const p = palette[i % palette.length];
          const target = Number(g.target);
          const saved = Number(g.saved);
          const pct = Math.min(100, Math.round((saved / target) * 100));
          const finished = saved >= target;

          return (
            <Reveal key={g.id} from={i % 2 === 0 ? "left" : "right"}>
              <Tilt>
              <article
                className={`card space-y-4 rounded-2xl border p-5 ${finished ? "glow" : ""}`}
                style={{
                  borderColor: `${p.a}66`,
                  background: `linear-gradient(135deg, ${p.a}2e, rgba(20,26,46,0.85) 62%)`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <GoalIcon id={g.id} icon={iconFor(g.name)} pct={pct} a={p.a} b={p.b} />
                    <div>
                      <h3 className="text-lg font-bold leading-tight">{g.name}</h3>
                      <p className="text-xs text-slate-300">
                        Setor {rp(g.amount_per_period)} · {freq[g.frequency]}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${finished ? "pop text-slate-900" : "bg-white/15 text-white"}`}
                    style={finished ? { background: g90(p) } : undefined}
                  >
                    {finished ? "🎉 Tercapai" : `${pct}%`}
                  </span>
                </div>

                <div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="bar h-full rounded-full" style={{ width: `${pct}%`, background: g90(p) }} />
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="font-semibold">{rp(saved)}</span>
                    <span className="text-slate-300">
                      {finished ? "Selesai, selamat! 🥳" : `Sisa ${rp(target - saved)}`}
                    </span>
                  </div>
                </div>

                <form action={deposit} className="flex gap-2">
                  <input type="hidden" name="id" value={g.id} />
                  <CurrencyInput name="amount" placeholder="Nominal setoran (Rp)" required className={input} />
                  <button
                    className="shrink-0 rounded-xl px-5 text-sm font-bold text-slate-900 shadow-md transition hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
                    style={{ background: g90(p) }}
                  >
                    Setor 💸
                  </button>
                </form>

                <div className="flex items-start justify-between gap-3">
                  <details className="flex-1">
                    <summary className="inline-block cursor-pointer rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10">
                      ✏️ Ubah
                    </summary>
                    <form action={updateGoal} className="mt-3 grid gap-2">
                      <input type="hidden" name="id" value={g.id} />
                      <input name="name" defaultValue={g.name} required className={input} />
                      <CurrencyInput name="target" defaultValue={target} required className={input} />
                      <CurrencyInput name="amount" defaultValue={g.amount_per_period} required className={input} />
                      <select name="frequency" defaultValue={g.frequency} className={input}>
                        <option value="daily">Harian</option>
                        <option value="weekly">Mingguan</option>
                        <option value="monthly">Bulanan</option>
                        <option value="payday">Tiap gajian</option>
                      </select>
                      <button className="rounded-xl bg-white/15 py-2 text-sm font-semibold transition hover:bg-white/20">
                        Simpan perubahan
                      </button>
                    </form>
                  </details>
                  <DeleteButton action={deleteGoal} id={g.id} />
                </div>
              </article>
            </Tilt>
            </Reveal>
          );
        })}
      </section>
    </>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <Reveal>
        <header className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-amber-200">
              🪙 Tabungan Impian
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Wujudkan targetmu,{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #34d399, #38bdf8, #e879f9, #fbbf24)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                satu setoran
              </span>{" "}
              sekali waktu
            </h1>
            <p className="text-slate-300">
              Pantau progres tabungan dan dapat pengingat seru langsung di Telegram.
            </p>
          </div>
          <div className="relative shrink-0">
            <Piggy className="bob w-36 drop-shadow-2xl sm:w-52" />
            <span className="bob-slow absolute -left-2 top-2 text-2xl" style={{ animationDelay: "-1s" }}>✨</span>
            <span className="bob-slow absolute -right-1 bottom-6 text-2xl" style={{ animationDelay: "-3s" }}>🪙</span>
            <span className="bob absolute -top-3 right-8 text-xl" style={{ animationDelay: "-2s" }}>💎</span>
          </div>
        </header>
      </Reveal>

      <Reveal from="zoom">
        <Marquee />
      </Reveal>

      <Reveal from="right">
        <section className="glow-border p-5">
          <h2 className="mb-3 text-lg font-bold">Buat target baru 🎯</h2>
          <form action={addGoal} className="grid gap-3 sm:grid-cols-2">
            <input name="name" placeholder="Nama target (mis. Beli laptop)" required className={`${input} sm:col-span-2`} />
            <CurrencyInput name="target" placeholder="Target (Rp)" required className={input} />
            <CurrencyInput name="amount" placeholder="Setoran per periode (Rp)" required className={input} />
            <select name="frequency" className={`${input} sm:col-span-2`}>
              <option value="daily">Pengingat harian</option>
              <option value="weekly">Pengingat mingguan</option>
              <option value="monthly">Pengingat bulanan</option>
              <option value="payday">Tiap gajian</option>
            </select>
            <button
              className="rounded-xl py-3 text-sm font-extrabold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 active:scale-95 sm:col-span-2"
              style={{ background: "linear-gradient(90deg, #34d399, #38bdf8, #e879f9)" }}
            >
              + Tambah target
            </button>
          </form>
        </section>
      </Reveal>

      <Suspense fallback={<p className="text-slate-300">Memuat target...</p>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}
