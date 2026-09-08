import type {
  CalendarizationResult,
  CurriculumLesson,
  TeachingAssignment,
  Term,
  TimetableSlot,
} from "../types";

import { generateDatedSlotsForAssignment } from "./generate-dated-slots-for-assignment";

type GenerateCalendarizationArgs = {
  term: Term;
  assignment: TeachingAssignment;
  timetableSlots: TimetableSlot[];
  curriculumLessons: CurriculumLesson[];
};

export function generateCalendarization({
  term,
  assignment,
  timetableSlots,
  curriculumLessons,
}: GenerateCalendarizationArgs): CalendarizationResult {
  const datedSlots = generateDatedSlotsForAssignment(
    term,
    timetableSlots,
    assignment.id,
  );

  const lessons = [...curriculumLessons].sort((a, b) => a.order - b.order);

  const scheduledCount = Math.min(lessons.length, datedSlots.length);

  const rows = lessons.slice(0, scheduledCount).map((lesson, index) => {
    const slot = datedSlots[index];

    return {
      lessonOrder: lesson.order,
      date: slot.date,
      pairNumber: slot.pairNumber,
      type: lesson.type,
      topic: lesson.topic,
    };
  });

  const warnings: CalendarizationResult["warnings"] = [];

  if (lessons.length > datedSlots.length) {
    warnings.push({
      type: "unscheduled-lessons",
      count: lessons.length - datedSlots.length,
    });
  }

  if (datedSlots.length > lessons.length) {
    warnings.push({
      type: "unused-slots",
      count: datedSlots.length - lessons.length,
    });
  }

  return {
    teachingAssignmentId: assignment.id,
    groupId: assignment.groupId,
    subjectId: assignment.subjectId,
    rows,
    warnings,
  };
}
