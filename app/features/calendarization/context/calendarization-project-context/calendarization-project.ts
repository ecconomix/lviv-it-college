import type { CalendarizationProject } from "~/features/calendarization/types";

export function createEmptyCalendarizationProject(): CalendarizationProject {
  return {
    term: {
      startDate: "",
      endDate: "",
    },
    subjects: [],
    groups: [],
    assignments: [],
    timetableSlots: [],
  };
}
