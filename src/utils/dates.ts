const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSunday(date: Date) {
  return date.getDay() === 0;
}

export function isPastDay(date: Date, today = new Date()) {
  return startOfDay(date).getTime() < startOfDay(today).getTime();
}

export function monthLabel(date: Date) {
  const label = new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric",
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatLongDate(date: Date) {
  const label = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function calendarCells(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const first = new Date(year, monthIndex, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, monthIndex, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function secondWednesday(year: number, month: number) {
  const date = new Date(year, month, 1);
  let count = 0;
  while (count < 2) {
    if (date.getDay() === 3) count += 1;
    if (count < 2) date.setDate(date.getDate() + 1);
  }
  return date;
}

export function defaultBookingDate(today = new Date()) {
  let year = today.getFullYear();
  let month = today.getMonth();
  let date = secondWednesday(year, month);
  if (startOfDay(date).getTime() < startOfDay(today).getTime()) {
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    date = secondWednesday(year, month);
  }
  return date;
}

export function parseSlot(label: string, date: Date) {
  const match = label.match(/(\d+):(\d+)\s*(a\.m\.|p\.m\.)/i);
  const next = new Date(date);
  if (!match) return next;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toLowerCase();
  if (meridiem.startsWith("p") && hours !== 12) hours += 12;
  if (meridiem.startsWith("a") && hours === 12) hours = 0;
  next.setHours(hours, minutes, 0, 0);
  return next;
}

export function toIcsStamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    "00"
  );
}

export { weekdays };

export function formatPrice(price: number) {
  return `$${price.toLocaleString("es-CO")}`;
}
