export type LessonType = "lecture" | "lab" | "practice";

export type CurriculumLesson = {
  id: string;
  order: number;
  type: LessonType;
  topic: string;
  hours: number;
};

export type Subject = {
  id: string;
  name: string;
  lessons: CurriculumLesson[];
};

export type Group = {
  id: string;
  name: string;
};

export type TeachingAssignment = {
  id: string;
  groupId: string;
  subjectId: string;
};

export type Weekday = 1 | 2 | 3 | 4 | 5;

export type TimetableSlot = {
  weekday: Weekday;
  pairNumber: number;
  teachingAssignmentId: string;
};

export type Term = {
  startDate: string;
  endDate: string;
};

export type CalendarizationRow = {
  lessonOrder: number;
  date: string;
  pairNumber: number;
  type: LessonType;
  topic: string;
};

export type CalendarizationWarning =
  | {
      type: "unscheduled-lessons";
      count: number;
    }
  | {
      type: "unused-slots";
      count: number;
    };

export type CalendarizationResult = {
  teachingAssignmentId: string;
  groupId: string;
  subjectId: string;
  rows: CalendarizationRow[];
  warnings: CalendarizationWarning[];
};

export type CalendarizationProject = {
  term: Term;
  subjects: Subject[];
  groups: Group[];
  assignments: TeachingAssignment[];
  timetableSlots: TimetableSlot[];
};
