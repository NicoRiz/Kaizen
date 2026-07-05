export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatTimeRemaining(deadline: string, now = Date.now()) {
  const remainingMs = new Date(deadline).getTime() - now;

  if (remainingMs <= 0) {
    return "scaduta";
  }

  const totalMinutes = Math.max(1, Math.ceil(remainingMs / 60000));

  if (totalMinutes < 60) {
    return `scade tra ${totalMinutes}min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours < 24) {
    return minutes > 0 ? `mancano ${hours}h ${minutes}min` : `mancano ${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const restHours = hours % 24;

  return restHours > 0 ? `mancano ${days}g ${restHours}h` : `mancano ${days}g`;
}

export function toDateTimeLocalValue(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);

  return localDate.toISOString().slice(0, 16);
}

export function fromDateTimeLocalValue(value: string) {
  return new Date(value).toISOString();
}

export function getArchiveDate(value: { archivedAt: string | null; completedAt: string | null; deadline: string }) {
  return value.archivedAt ?? value.completedAt ?? value.deadline;
}

export function isInCurrentWeek(value: string, now = new Date()) {
  const date = new Date(value);
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const distanceFromMonday = day === 0 ? 6 : day - 1;

  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - distanceFromMonday);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return date >= startOfWeek && date < endOfWeek;
}
