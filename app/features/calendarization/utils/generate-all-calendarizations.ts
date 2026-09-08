import type { CalendarizationProject, CalendarizationResult } from "../types";

import { generateCalendarization } from "./generate-calendarization";

export function generateAllCalendarizations(
  project: CalendarizationProject,
): CalendarizationResult[] {
  return project.assignments.map((assignment) => {
    const subject = project.subjects.find(
      (subject) => subject.id === assignment.subjectId,
    );

    if (!subject) {
      throw new Error(`Subject not found for assignment "${assignment.id}"`);
    }

    return generateCalendarization({
      term: project.term,
      assignment,
      timetableSlots: project.timetableSlots,
      curriculumLessons: subject.lessons,
    });
  });
}
