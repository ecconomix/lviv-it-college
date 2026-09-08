import type { Term, TimetableSlot } from "../types";
import { generateDatesForWeekday } from "./generate-dates-for-weekday";

export type DatedTimetableSlot = {
  date: string;
  pairNumber: number;
  teachingAssignmentId: string;
};

export function generateDatedSlots(
  term: Term,
  slot: TimetableSlot,
): DatedTimetableSlot[] {
  return generateDatesForWeekday(term, slot.weekday).map((date) => ({
    date,
    pairNumber: slot.pairNumber,
    teachingAssignmentId: slot.teachingAssignmentId,
  }));
}
