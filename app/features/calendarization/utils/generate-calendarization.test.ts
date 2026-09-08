import { describe, expect, it } from "vitest";

import { generateCalendarization } from "./generate-calendarization";

describe("generateCalendarization", () => {
  it("maps curriculum lessons to dated timetable slots in order", () => {
    const result = generateCalendarization({
      term: {
        startDate: "2026-09-01",
        endDate: "2026-09-10",
      },
      assignment: {
        id: "mt41-iot",
        groupId: "mt41",
        subjectId: "iot-security",
      },
      timetableSlots: [
        {
          weekday: 4,
          pairNumber: 3,
          teachingAssignmentId: "mt41-iot",
        },
        {
          weekday: 2,
          pairNumber: 1,
          teachingAssignmentId: "mt41-iot",
        },
      ],
      curriculumLessons: [
        {
          id: "lesson-1",
          order: 1,
          type: "lecture",
          topic: "Introduction",
          hours: 2,
        },
        {
          id: "lesson-2",
          order: 2,
          type: "lab",
          topic: "Lab 1",
          hours: 2,
        },
        {
          id: "lesson-3",
          order: 3,
          type: "lecture",
          topic: "Security basics",
          hours: 2,
        },
      ],
    });

    expect(result.rows).toEqual([
      {
        lessonOrder: 1,
        date: "2026-09-01",
        pairNumber: 1,
        type: "lecture",
        topic: "Introduction",
      },
      {
        lessonOrder: 2,
        date: "2026-09-03",
        pairNumber: 3,
        type: "lab",
        topic: "Lab 1",
      },
      {
        lessonOrder: 3,
        date: "2026-09-08",
        pairNumber: 1,
        type: "lecture",
        topic: "Security basics",
      },
    ]);

    expect(result.warnings).toEqual([
      {
        type: "unused-slots",
        count: 1,
      },
    ]);
  });

  it("warns when curriculum has more lessons than available slots", () => {
    const result = generateCalendarization({
      term: {
        startDate: "2026-09-01",
        endDate: "2026-09-01",
      },
      assignment: {
        id: "mt41-iot",
        groupId: "mt41",
        subjectId: "iot-security",
      },
      timetableSlots: [
        {
          weekday: 2,
          pairNumber: 1,
          teachingAssignmentId: "mt41-iot",
        },
      ],
      curriculumLessons: [
        {
          id: "lesson-1",
          order: 1,
          type: "lecture",
          topic: "Lesson 1",
          hours: 2,
        },
        {
          id: "lesson-2",
          order: 2,
          type: "lab",
          topic: "Lesson 2",
          hours: 2,
        },
      ],
    });

    expect(result.rows).toHaveLength(1);

    expect(result.warnings).toEqual([
      {
        type: "unscheduled-lessons",
        count: 1,
      },
    ]);
  });

  it("returns no warnings when lesson count matches available slots", () => {
    const result = generateCalendarization({
      term: {
        startDate: "2026-09-01",
        endDate: "2026-09-08",
      },
      assignment: {
        id: "mt41-iot",
        groupId: "mt41",
        subjectId: "iot-security",
      },
      timetableSlots: [
        {
          weekday: 2,
          pairNumber: 1,
          teachingAssignmentId: "mt41-iot",
        },
      ],
      curriculumLessons: [
        {
          id: "lesson-1",
          order: 1,
          type: "lecture",
          topic: "Lesson 1",
          hours: 2,
        },
        {
          id: "lesson-2",
          order: 2,
          type: "lab",
          topic: "Lesson 2",
          hours: 2,
        },
      ],
    });

    expect(result.rows).toHaveLength(2);
    expect(result.warnings).toEqual([]);
  });
});
