import { describe, expect, it } from "vitest";

import { generateAllCalendarizations } from "./generate-all-calendarizations";

describe("generateAllCalendarizations", () => {
  it("generates an independent calendarization for each teaching assignment", () => {
    const results = generateAllCalendarizations({
      term: {
        startDate: "2026-09-01",
        endDate: "2026-09-08",
      },

      subjects: [
        {
          id: "iot-security",
          name: "IoT Security",
          curriculum: {
            fileName: "iot-security.json",
            lessons: [
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
            ],
          },
        },
      ],

      groups: [
        {
          id: "mt41",
          name: "MT-41",
        },
        {
          id: "mt42",
          name: "MT-42",
        },
      ],

      assignments: [
        {
          id: "mt41-iot",
          groupId: "mt41",
          subjectId: "iot-security",
        },
        {
          id: "mt42-iot",
          groupId: "mt42",
          subjectId: "iot-security",
        },
      ],

      timetableSlots: [
        {
          weekday: 2,
          pairNumber: 1,
          teachingAssignmentId: "mt41-iot",
        },
        {
          weekday: 2,
          pairNumber: 2,
          teachingAssignmentId: "mt42-iot",
        },
      ],
    });

    expect(results).toHaveLength(2);

    expect(results[0].rows[0]).toEqual({
      lessonOrder: 1,
      date: "2026-09-01",
      pairNumber: 1,
      type: "lecture",
      topic: "Introduction",
    });

    expect(results[1].rows[0]).toEqual({
      lessonOrder: 1,
      date: "2026-09-01",
      pairNumber: 2,
      type: "lecture",
      topic: "Introduction",
    });
  });

  it("uses the curriculum belonging to each assignment subject", () => {
    const results = generateAllCalendarizations({
      term: {
        startDate: "2026-09-01",
        endDate: "2026-09-01",
      },

      subjects: [
        {
          id: "iot",
          name: "IoT",
          curriculum: {
            fileName: "iot.json",
            lessons: [
              {
                id: "iot-1",
                order: 1,
                type: "lecture",
                topic: "IoT Lesson",
                hours: 2,
              },
            ],
          },
        },
        {
          id: "internet-programming",
          name: "Internet Programming",
          curriculum: {
            fileName: "internet-programming.json",

            lessons: [
              {
                id: "internet-1",
                order: 1,
                type: "practice",
                topic: "HTTP",
                hours: 2,
              },
            ],
          },
        },
      ],

      groups: [
        {
          id: "mt41",
          name: "MT-41",
        },
      ],

      assignments: [
        {
          id: "mt41-iot",
          groupId: "mt41",
          subjectId: "iot",
        },
        {
          id: "mt41-internet",
          groupId: "mt41",
          subjectId: "internet-programming",
        },
      ],

      timetableSlots: [
        {
          weekday: 2,
          pairNumber: 1,
          teachingAssignmentId: "mt41-iot",
        },
        {
          weekday: 2,
          pairNumber: 2,
          teachingAssignmentId: "mt41-internet",
        },
      ],
    });

    expect(results[0].rows[0].topic).toBe("IoT Lesson");
    expect(results[1].rows[0].topic).toBe("HTTP");
  });

  it("throws when an assignment references a missing subject", () => {
    expect(() =>
      generateAllCalendarizations({
        term: {
          startDate: "2026-09-01",
          endDate: "2026-09-30",
        },

        subjects: [],

        groups: [
          {
            id: "mt41",
            name: "MT-41",
          },
        ],

        assignments: [
          {
            id: "mt41-missing",
            groupId: "mt41",
            subjectId: "missing-subject",
          },
        ],

        timetableSlots: [],
      }),
    ).toThrow('Subject not found for assignment "mt41-missing"');
  });
});
