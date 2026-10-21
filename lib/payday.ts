const WIB = 7 * 3600 * 1000;
const dim = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();

export const wibDateStr = () => new Date(Date.now() + WIB).toISOString().slice(0, 10);

export function isPaydayToday(day: number) {
  const n = new Date(Date.now() + WIB);
  return n.getUTCDate() === Math.min(day, dim(n.getUTCFullYear(), n.getUTCMonth()));
}

export function daysToPayday(day: number) {
  const n = new Date(Date.now() + WIB);
  const y = n.getUTCFullYear();
  const m = n.getUTCMonth();
  const today = Date.UTC(y, m, n.getUTCDate());
  let t = Date.UTC(y, m, Math.min(day, dim(y, m)));
  if (t < today) {
    const ny = m === 11 ? y + 1 : y;
    const nm = (m + 1) % 12;
    t = Date.UTC(ny, nm, Math.min(day, dim(ny, nm)));
  }
  return Math.round((t - today) / 86400000);
}
