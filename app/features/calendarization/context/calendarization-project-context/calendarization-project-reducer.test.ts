import { describe, expect, it } from "vitest";

import { calendarizationProjectReducer } from "./calendarization-project-reducer";
import type {
  CalendarizationProject,
  Group,
  Subject,
  TeachingAssignment,
  Term,
  TimetableSlot,
} from "~/features/calendarization/types";
import { createEmptyCalendarizationProject } from "./calendarization-project";

const subject1: Subject = {
  id: "subject-1",
  name: "IoT Security",
  curriculum: null,
};

const subject2: Subject = {
  id: "subject-2",
  name: "Internet Programming",
  curriculum: null,
};

const group1: Group = {
  id: "group-1",
  name: "MT-41",
};

const group2: Group = {
  id: "group-2",
  name: "MT-42",
};

const assignment1: TeachingAssignment = {
  id: "assignment-1",
  groupId: group1.id,
  subjectId: subject1.id,
};

const assignment2: TeachingAssignment = {
  id: "assignment-2",
  groupId: group1.id,
  subjectId: subject2.id,
};

const assignment3: TeachingAssignment = {
  id: "assignment-3",
  groupId: group2.id,
  subjectId: subject1.id,
};

const term: Term = {
  startDate: "2026-09-01",
  endDate: "2026-12-28",
};

const slot1: TimetableSlot = {
  teachingAssignmentId: assignment1.id,
  weekday: 1,
  pairNumber: 1,
};

const slot2: TimetableSlot = {
  teachingAssignmentId: assignment2.id,
  weekday: 2,
  pairNumber: 2,
};

const slot3: TimetableSlot = {
  teachingAssignmentId: assignment3.id,
  weekday: 3,
  pairNumber: 3,
};

function createProject(
  overrides: Partial<CalendarizationProject> = {},
): CalendarizationProject {
  return {
    term,
    subjects: [],
    groups: [],
    assignments: [],
    timetableSlots: [],
    ...overrides,
  };
}

describe("calendarizationProjectReducer", () => {
  it("adds a subject", () => {
    const state = createProject();

    const result = calendarizationProjectReducer(state, {
      type: "subject/add",
      subject: subject1,
    });

    expect(result.subjects).toEqual([subject1]);
  });

  it("updates a subject", () => {
    const state = createProject({
      subjects: [subject1],
    });

    const updatedSubject: Subject = {
      ...subject1,
      name: "Updated IoT Security",
    };

    const result = calendarizationProjectReducer(state, {
      type: "subject/update",
      subject: updatedSubject,
    });

    expect(result.subjects).toEqual([updatedSubject]);
  });

  it("adds a group", () => {
    const state = createProject();

    const result = calendarizationProjectReducer(state, {
      type: "group/add",
      group: group1,
    });

    expect(result.groups).toEqual([group1]);
  });

  it("updates a group", () => {
    const state = createProject({
      groups: [group1],
    });

    const updatedGroup: Group = {
      ...group1,
      name: "MT-41 Updated",
    };

    const result = calendarizationProjectReducer(state, {
      type: "group/update",
      group: updatedGroup,
    });

    expect(result.groups).toEqual([updatedGroup]);
  });

  it("renames only the selected group while preserving references and previous state", () => {
    const state = createProject({
      subjects: [subject1],
      groups: [group1, group2],
      assignments: [assignment1, assignment3],
      timetableSlots: [slot1, slot3],
    });
    const result = calendarizationProjectReducer(state, {
      type: "group/update",
      group: { ...group1, name: "МТ-43" },
    });

    expect(result.groups).toEqual([{ ...group1, name: "МТ-43" }, group2]);
    expect(state.groups).toEqual([group1, group2]);
    expect(result.groups[1]).toBe(group2);
    expect(result.subjects).toBe(state.subjects);
    expect(result.assignments).toBe(state.assignments);
    expect(result.timetableSlots).toBe(state.timetableSlots);
    expect(result.term).toBe(state.term);
  });

  it("does not create a group when renaming an unknown ID", () => {
    const state = createProject({ groups: [group1] });
    const result = calendarizationProjectReducer(state, {
      type: "group/update",
      group: group2,
    });
    expect(result).toEqual(state);
  });

  it("adds an assignment", () => {
    const state = createProject();

    const result = calendarizationProjectReducer(state, {
      type: "assignment/add",
      assignment: assignment1,
    });

    expect(result.assignments).toEqual([assignment1]);
  });

  it("removes a subject and cascades its assignments and timetable slots", () => {
    const state = createProject({
      subjects: [subject1, subject2],
      groups: [group1, group2],
      assignments: [assignment1, assignment2, assignment3],
      timetableSlots: [slot1, slot2, slot3],
    });

    const result = calendarizationProjectReducer(state, {
      type: "subject/remove",
      subjectId: subject1.id,
    });

    expect(result.subjects).toEqual([subject2]);

    expect(result.assignments).toEqual([assignment2]);

    expect(result.timetableSlots).toEqual([slot2]);

    expect(result.groups).toEqual([group1, group2]);
  });

  it("removes a group and cascades its assignments and timetable slots", () => {
    const state = createProject({
      subjects: [subject1, subject2],
      groups: [group1, group2],
      assignments: [assignment1, assignment2, assignment3],
      timetableSlots: [slot1, slot2, slot3],
    });

    const result = calendarizationProjectReducer(state, {
      type: "group/remove",
      groupId: group1.id,
    });

    expect(result.groups).toEqual([group2]);

    expect(result.assignments).toEqual([assignment3]);

    expect(result.timetableSlots).toEqual([slot3]);

    expect(result.subjects).toEqual([subject1, subject2]);
  });

  it("removes an assignment and its timetable slots", () => {
    const state = createProject({
      subjects: [subject1, subject2],
      groups: [group1],
      assignments: [assignment1, assignment2],
      timetableSlots: [slot1, slot2],
    });

    const result = calendarizationProjectReducer(state, {
      type: "assignment/remove",
      assignmentId: assignment1.id,
    });

    expect(result.assignments).toEqual([assignment2]);

    expect(result.timetableSlots).toEqual([slot2]);
  });

  it("does not add a duplicate group-subject assignment", () => {
    const duplicateAssignment: TeachingAssignment = {
      id: "assignment-other-id",
      groupId: assignment1.groupId,
      subjectId: assignment1.subjectId,
    };

    const state = createProject({
      assignments: [assignment1],
    });

    const result = calendarizationProjectReducer(state, {
      type: "assignment/add",
      assignment: duplicateAssignment,
    });

    expect(result).toBe(state);

    expect(result.assignments).toEqual([assignment1]);
  });

  it("allows the same subject to be assigned to another group", () => {
    const state = createProject({
      assignments: [assignment1],
    });

    const result = calendarizationProjectReducer(state, {
      type: "assignment/add",
      assignment: assignment3,
    });

    expect(result.assignments).toEqual([assignment1, assignment3]);
  });

  it("allows the same group to have another subject", () => {
    const state = createProject({
      assignments: [assignment1],
    });

    const result = calendarizationProjectReducer(state, {
      type: "assignment/add",
      assignment: assignment2,
    });

    expect(result.assignments).toEqual([assignment1, assignment2]);
  });

  it("sets the term", () => {
    const state = createProject();

    const newTerm: Term = {
      startDate: "2027-01-10",
      endDate: "2027-05-30",
    };

    const result = calendarizationProjectReducer(state, {
      type: "term/set",
      term: newTerm,
    });

    expect(result.term).toEqual(newTerm);
  });

  it("adds a timetable slot", () => {
    const state = createProject();

    const result = calendarizationProjectReducer(state, {
      type: "timetable/set",
      slot: slot1,
    });

    expect(result.timetableSlots).toEqual([slot1]);
  });

  it("replaces the timetable slot at the same weekday and pair number", () => {
    const replacementSlot: TimetableSlot = {
      teachingAssignmentId: assignment2.id,
      weekday: slot1.weekday,
      pairNumber: slot1.pairNumber,
    };

    const state = createProject({
      timetableSlots: [slot1, slot2],
    });

    const result = calendarizationProjectReducer(state, {
      type: "timetable/set",
      slot: replacementSlot,
    });

    expect(result.timetableSlots).toEqual([slot2, replacementSlot]);
  });

  it("does not replace slots from another pair on the same weekday", () => {
    const anotherSlot: TimetableSlot = {
      teachingAssignmentId: assignment2.id,
      weekday: 1,
      pairNumber: 2,
    };

    const state = createProject({
      timetableSlots: [slot1],
    });

    const result = calendarizationProjectReducer(state, {
      type: "timetable/set",
      slot: anotherSlot,
    });

    expect(result.timetableSlots).toEqual([slot1, anotherSlot]);
  });

  it("clears a timetable slot by weekday and pair number", () => {
    const state = createProject({
      timetableSlots: [slot1, slot2],
    });

    const result = calendarizationProjectReducer(state, {
      type: "timetable/clear",
      weekday: slot1.weekday,
      pairNumber: slot1.pairNumber,
    });

    expect(result.timetableSlots).toEqual([slot2]);
  });

  it("resets the project", () => {
    const state = createProject({
      subjects: [subject1],
      groups: [group1],
      assignments: [assignment1],
      timetableSlots: [slot1],
    });

    const result = calendarizationProjectReducer(state, {
      type: "project/reset",
    });

    expect(result).toEqual(createEmptyCalendarizationProject());
  });

  it("replaces the entire project", () => {
    const state = createProject({
      subjects: [subject1],
    });

    const replacement = createProject({
      subjects: [subject2],
      groups: [group2],
      assignments: [],
      timetableSlots: [],
    });

    const result = calendarizationProjectReducer(state, {
      type: "project/replace",
      project: replacement,
    });

    expect(result).toBe(replacement);
  });
});
