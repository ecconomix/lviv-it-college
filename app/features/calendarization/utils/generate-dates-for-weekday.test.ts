import { describe, expect, it } from "vitest";

import { generateDatesForWeekday } from "./generate-dates-for-weekday";

describe("generateDatesForWeekday", () => {
  it("returns all matching weekdays inside the range", () => {
    const result = generateDatesForWeekday(
      {
        startDate: "2026-09-01",
        endDate: "2026-09-30",
      },
      2,
    );

    expect(result).toEqual([
      "2026-09-01",
      "2026-09-08",
      "2026-09-15",
      "2026-09-22",
      "2026-09-29",
    ]);
  });

  it("finds the first matching weekday after the start date", () => {
    const result = generateDatesForWeekday(
      {
        startDate: "2026-09-01",
        endDate: "2026-09-30",
      },
      4,
    );

    expect(result).toEqual([
      "2026-09-03",
      "2026-09-10",
      "2026-09-17",
      "2026-09-24",
    ]);
  });

  it("includes the end date when it matches the requested weekday", () => {
    const result = generateDatesForWeekday(
      {
        startDate: "2026-09-01",
        endDate: "2026-09-29",
      },
      2,
    );

    expect(result.at(-1)).toBe("2026-09-29");
  });

  it("returns an empty array when there is no matching weekday in the range", () => {
    const result = generateDatesForWeekday(
      {
        startDate: "2026-09-01",
        endDate: "2026-09-02",
      },
      5,
    );

    expect(result).toEqual([]);
  });

  it("works when start and end dates are the same and match the weekday", () => {
    const result = generateDatesForWeekday(
      {
        startDate: "2026-09-01",
        endDate: "2026-09-01",
      },
      2,
    );

    expect(result).toEqual(["2026-09-01"]);
  });

  it("works when start and end dates are the same and do not match the weekday", () => {
    const result = generateDatesForWeekday(
      {
        startDate: "2026-09-01",
        endDate: "2026-09-01",
      },
      3,
    );

    expect(result).toEqual([]);
  });

  it("correctly handles a range crossing into a new year", () => {
    const result = generateDatesForWeekday(
      {
        startDate: "2026-12-28",
        endDate: "2027-01-11",
      },
      1,
    );

    expect(result).toEqual(["2026-12-28", "2027-01-04", "2027-01-11"]);
  });
});
