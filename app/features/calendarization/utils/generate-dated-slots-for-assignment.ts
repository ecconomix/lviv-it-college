import type { Term, TimetableSlot } from "../types";
import {
  generateDatedSlots,
  type DatedTimetableSlot,
} from "./generate-dated-slots";

export function generateDatedSlotsForAssignment(
  term: Term,
  timetableSlots: TimetableSlot[],
  teachingAssignmentId: string,
): DatedTimetableSlot[] {
  return timetableSlots
    .filter((slot) => slot.teachingAssignmentId === teachingAssignmentId)
    .flatMap((slot) => generateDatedSlots(term, slot))
    .sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }

      return a.pairNumber - b.pairNumber;
    });
}
