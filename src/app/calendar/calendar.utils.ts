export function getLocalDateTimeString(date = new Date()): string {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

export function generateWeek(startDate = new Date()): Date[] {
  const startOfWeek = new Date(startDate);
  startOfWeek.setDate(startDate.getDate() - startDate.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
}
