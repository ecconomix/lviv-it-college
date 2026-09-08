import { createEmptyCalendarizationProject } from "./calendarization-project";
import type { CalendarizationProject } from "~/features/calendarization/types";

import type { CalendarizationProjectAction } from "./calendarization-project-actions";

export function calendarizationProjectReducer(
  state: CalendarizationProject,
  action: CalendarizationProjectAction,
): CalendarizationProject {
  switch (action.type) {
    case "subject/add":
      return {
        ...state,
        subjects: [...state.subjects, action.subject],
      };

    case "subject/update":
      return {
        ...state,
        subjects: state.subjects.map((subject) =>
          subject.id === action.subject.id ? action.subject : subject,
        ),
      };

    case "subject/remove": {
      const removedAssignmentIds = new Set(
        state.assignments
          .filter((assignment) => assignment.subjectId === action.subjectId)
          .map((assignment) => assignment.id),
      );

      return {
        ...state,

        subjects: state.subjects.filter(
          (subject) => subject.id !== action.subjectId,
        ),

        assignments: state.assignments.filter(
          (assignment) => assignment.subjectId !== action.subjectId,
        ),

        timetableSlots: state.timetableSlots.filter(
          (slot) => !removedAssignmentIds.has(slot.teachingAssignmentId),
        ),
      };
    }

    case "group/add":
      return {
        ...state,
        groups: [...state.groups, action.group],
      };

    case "group/update":
      return {
        ...state,
        groups: state.groups.map((group) =>
          group.id === action.group.id ? action.group : group,
        ),
      };

    case "group/remove": {
      const removedAssignmentIds = new Set(
        state.assignments
          .filter((assignment) => assignment.groupId === action.groupId)
          .map((assignment) => assignment.id),
      );

      return {
        ...state,

        groups: state.groups.filter((group) => group.id !== action.groupId),

        assignments: state.assignments.filter(
          (assignment) => assignment.groupId !== action.groupId,
        ),

        timetableSlots: state.timetableSlots.filter(
          (slot) => !removedAssignmentIds.has(slot.teachingAssignmentId),
        ),
      };
    }

    case "assignment/add": {
      const alreadyExists = state.assignments.some(
        (assignment) =>
          assignment.groupId === action.assignment.groupId &&
          assignment.subjectId === action.assignment.subjectId,
      );

      if (alreadyExists) {
        return state;
      }

      return {
        ...state,
        assignments: [...state.assignments, action.assignment],
      };
    }

    case "assignment/remove":
      return {
        ...state,

        assignments: state.assignments.filter(
          (assignment) => assignment.id !== action.assignmentId,
        ),

        timetableSlots: state.timetableSlots.filter(
          (slot) => slot.teachingAssignmentId !== action.assignmentId,
        ),
      };

    case "term/set":
      return {
        ...state,
        term: action.term,
      };

    case "timetable/set":
      return {
        ...state,

        timetableSlots: [
          ...state.timetableSlots.filter(
            (slot) =>
              slot.weekday !== action.slot.weekday ||
              slot.pairNumber !== action.slot.pairNumber,
          ),
          action.slot,
        ],
      };

    case "timetable/clear":
      return {
        ...state,

        timetableSlots: state.timetableSlots.filter(
          (slot) =>
            slot.weekday !== action.weekday ||
            slot.pairNumber !== action.pairNumber,
        ),
      };

    case "project/replace":
      return action.project;

    case "project/reset":
      return createEmptyCalendarizationProject();

    default:
      return state;
  }
}
