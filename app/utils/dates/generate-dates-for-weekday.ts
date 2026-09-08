import { addDays, formatISO, getISODay, isAfter, parseISO } from "date-fns";

export function generateDatesForWeekday(
  dateRange: { startDate: string; endDate: string },
  weekday: number,
): string[] {
  const start = parseISO(dateRange.startDate);
  const end = parseISO(dateRange.endDate);

  const startWeekday = getISODay(start);
  const daysUntilTarget = (weekday - startWeekday + 7) % 7;

  let current = addDays(start, daysUntilTarget);

  const dates: string[] = [];

  while (!isAfter(current, end)) {
    dates.push(formatISO(current, { representation: "date" }));
    current = addDays(current, 7);
  }

  return dates;
}
