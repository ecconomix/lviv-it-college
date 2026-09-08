import { describe, expect, it } from "vitest";

import { generateDatedSlots } from "./generate-dated-slots";

describe("generateDatedSlots", () => {
  it("expands a weekly timetable slot into concrete dates", () => {
    const result = generateDatedSlots(
      {
        startDate: "2026-09-01",
        endDate: "2026-09-15",
      },
      {
        weekday: 2,
        pairNumber: 3,
        teachingAssignmentId: "mt41-iot",
      },
    );

    expect(result).toEqual([
      {
        date: "2026-09-01",
        pairNumber: 3,
        teachingAssignmentId: "mt41-iot",
      },
      {
        date: "2026-09-08",
        pairNumber: 3,
        teachingAssignmentId: "mt41-iot",
      },
      {
        date: "2026-09-15",
        pairNumber: 3,
        teachingAssignmentId: "mt41-iot",
      },
    ]);
  });

  it("returns an empty array when the weekday does not occur in the range", () => {
    const result = generateDatedSlots(
      {
        startDate: "2026-09-01",
        endDate: "2026-09-02",
      },
      {
        weekday: 5,
        pairNumber: 2,
        teachingAssignmentId: "mt42-iot",
      },
    );

    expect(result).toEqual([]);
  });

  it("preserves pair number and teaching assignment id", () => {
    const result = generateDatedSlots(
      {
        startDate: "2026-09-03",
        endDate: "2026-09-03",
      },
      {
        weekday: 4,
        pairNumber: 4,
        teachingAssignmentId: "internet-programming-310",
      },
    );

    expect(result).toEqual([
      {
        date: "2026-09-03",
        pairNumber: 4,
        teachingAssignmentId: "internet-programming-310",
      },
    ]);
  });
});
