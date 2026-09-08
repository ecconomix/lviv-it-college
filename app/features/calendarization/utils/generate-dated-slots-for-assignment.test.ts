import { describe, expect, it } from "vitest";

import { generateDatedSlotsForAssignment } from "./generate-dated-slots-for-assignment";

describe("generateDatedSlotsForAssignment", () => {
  it("combines multiple weekly slots for one assignment and sorts them chronologically", () => {
    const result = generateDatedSlotsForAssignment(
      {
        startDate: "2026-09-01",
        endDate: "2026-09-10",
      },
      [
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
        {
          weekday: 3,
          pairNumber: 2,
          teachingAssignmentId: "another-assignment",
        },
      ],
      "mt41-iot",
    );

    expect(result).toEqual([
      {
        date: "2026-09-01",
        pairNumber: 1,
        teachingAssignmentId: "mt41-iot",
      },
      {
        date: "2026-09-03",
        pairNumber: 3,
        teachingAssignmentId: "mt41-iot",
      },
      {
        date: "2026-09-08",
        pairNumber: 1,
        teachingAssignmentId: "mt41-iot",
      },
      {
        date: "2026-09-10",
        pairNumber: 3,
        teachingAssignmentId: "mt41-iot",
      },
    ]);
  });

  it("sorts multiple slots on the same date by pair number", () => {
    const result = generateDatedSlotsForAssignment(
      {
        startDate: "2026-09-01",
        endDate: "2026-09-01",
      },
      [
        {
          weekday: 2,
          pairNumber: 4,
          teachingAssignmentId: "mt41-iot",
        },
        {
          weekday: 2,
          pairNumber: 1,
          teachingAssignmentId: "mt41-iot",
        },
      ],
      "mt41-iot",
    );

    expect(result.map((slot) => slot.pairNumber)).toEqual([1, 4]);
  });

  it("returns an empty array when the assignment has no timetable slots", () => {
    const result = generateDatedSlotsForAssignment(
      {
        startDate: "2026-09-01",
        endDate: "2026-09-30",
      },
      [],
      "mt41-iot",
    );

    expect(result).toEqual([]);
  });
});
