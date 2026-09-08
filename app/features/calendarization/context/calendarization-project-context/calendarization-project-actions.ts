import type {
  CalendarizationProject,
  Group,
  Subject,
  TeachingAssignment,
  Term,
  TimetableSlot,
  Weekday,
} from "~/features/calendarization/types";

export type CalendarizationProjectAction =
  | {
      type: "subject/add";
      subject: Subject;
    }
  | {
      type: "subject/update";
      subject: Subject;
    }
  | {
      type: "subject/remove";
      subjectId: string;
    }
  | {
      type: "group/add";
      group: Group;
    }
  | {
      type: "group/update";
      group: Group;
    }
  | {
      type: "group/remove";
      groupId: string;
    }
  | {
      type: "assignment/add";
      assignment: TeachingAssignment;
    }
  | {
      type: "assignment/remove";
      assignmentId: string;
    }
  | {
      type: "term/set";
      term: Term;
    }
  | {
      type: "timetable/set";
      slot: TimetableSlot;
    }
  | {
      type: "timetable/clear";
      weekday: Weekday;
      pairNumber: number;
    }
  | {
      type: "project/replace";
      project: CalendarizationProject;
    }
  | {
      type: "project/reset";
    };
