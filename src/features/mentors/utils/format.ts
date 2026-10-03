const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Chat timestamps: time of day today, weekday within the week, short date beyond. */
export function formatChatTime(at: number): string {
  const date = new Date(at);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const hour = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
    return `${hour}:${minutes} ${ampm}`;
  }
  const msPerDay = 86_400_000;
  if (now.getTime() - date.getTime() < 6 * msPerDay) {
    return WEEKDAYS[date.getDay()] ?? '';
  }
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
