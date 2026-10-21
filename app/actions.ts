"use server";
import { db } from "@/lib/supabase";
import { sendTelegram } from "@/lib/telegram";
import { newGoalMsg, depositMsg, deleteMsg } from "@/lib/messages";
import { revalidatePath } from "next/cache";

export async function addGoal(fd: FormData) {
  const goal = {
    name: String(fd.get("name") ?? "").trim(),
    target: Number(fd.get("target")),
    amount_per_period: Number(fd.get("amount")),
    frequency: String(fd.get("frequency")),
  };
  if (!goal.name || !(goal.target > 0) || !(goal.amount_per_period > 0)) return;

  const { error } = await db().from("goals").insert(goal);
  if (error) {
    console.error("Gagal simpan target:", error.message);
    return;
  }
  await sendTelegram(newGoalMsg(goal));
  revalidatePath("/");
}

export async function updateGoal(fd: FormData) {
  const id = String(fd.get("id"));
  const patch = {
    name: String(fd.get("name") ?? "").trim(),
    target: Number(fd.get("target")),
    amount_per_period: Number(fd.get("amount")),
    frequency: String(fd.get("frequency")),
  };
  if (!patch.name || !(patch.target > 0) || !(patch.amount_per_period > 0)) return;

  const { error } = await db().from("goals").update(patch).eq("id", id);
  if (error) console.error("Gagal ubah target:", error.message);
  revalidatePath("/");
}

export async function deposit(fd: FormData) {
  const id = String(fd.get("id"));
  const amt = Number(fd.get("amount"));
  if (!(amt > 0)) return;

  const supa = db();
  const { data } = await supa.from("goals").select("*").eq("id", id).single();
  if (!data) return;

  const saved = Number(data.saved) + amt;
  const { error } = await supa.from("goals").update({ saved }).eq("id", id);
  if (error) {
    console.error("Gagal simpan setoran:", error.message);
    return;
  }
  await sendTelegram(depositMsg({ ...data, saved }, amt));
  revalidatePath("/");
}

export async function deleteGoal(fd: FormData) {
  const id = String(fd.get("id"));
  const supa = db();
  const { data } = await supa.from("goals").select("name").eq("id", id).single();
  const { error } = await supa.from("goals").delete().eq("id", id);
  if (error) {
    console.error("Gagal hapus target:", error.message);
    return;
  }
  if (data) await sendTelegram(deleteMsg(data.name));
  revalidatePath("/");
}

export async function saveSettings(fd: FormData) {
  const day = Math.round(Number(fd.get("payday_day")));
  const salary = Number(fd.get("salary"));
  if (!(day >= 1 && day <= 31)) return;

  const { error } = await db()
    .from("settings")
    .upsert({ id: 1, payday_day: day, salary: salary > 0 ? salary : null });
  if (error) console.error("Gagal simpan pengaturan:", error.message);
  revalidatePath("/");
}
