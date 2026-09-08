import type { CalendarizationProject } from "~/features/calendarization/types";

const STORAGE_KEY = "calendarization-project:v1";

export function loadCalendarizationProject(): CalendarizationProject | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as CalendarizationProject;
  } catch {
    return null;
  }
}

export function saveCalendarizationProject(project: CalendarizationProject) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch {
    // Ignore storage errors in V0.
  }
}

export function clearCalendarizationProjectStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors in V0.
  }
}
