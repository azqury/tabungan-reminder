"use client";

export default function DeleteButton({
  action,
  id,
}: {
  action: (fd: FormData) => void | Promise<void>;
  id: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Hapus target ini? Data tidak bisa dikembalikan.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/10">
        🗑️ Hapus
      </button>
    </form>
  );
}
