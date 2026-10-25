export function dateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return dateISO(new Date());
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function addDaysISO(iso: string, n: number): string {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return dateISO(d);
}

export function weekdayOfISO(iso: string): number {
  return fromISO(iso).getDay();
}

export function fmtFriendlyDate(iso: string): string {
  return fromISO(iso).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function greetingForHour(hour: number): string {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
