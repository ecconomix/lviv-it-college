import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createEmptyCalendarizationProject } from "./calendarization-project";
import { calendarizationProjectReducer } from "./calendarization-project-reducer";
import {
  clearCalendarizationProjectStorage,
  loadCalendarizationProject,
  saveCalendarizationProject,
} from "./calendarization-project-storage";

describe("group persistence", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it("round-trips group CRUD without changing subjects or the term", () => {
    const initial = {
      ...createEmptyCalendarizationProject(),
      term: { startDate: "2026-09-01", endDate: "2026-12-28" },
      subjects: [{ id: "subject-1", name: "Програмування", curriculum: null }],
    };
    const group = { id: "group-1", name: "МТ-41" };
    const otherGroup = { id: "group-2", name: "МТ-42" };
    let project = calendarizationProjectReducer(initial, { type: "group/add", group });
    project = calendarizationProjectReducer(project, { type: "group/add", group: otherGroup });
    saveCalendarizationProject(project);
    expect(loadCalendarizationProject()).toEqual({ ...initial, groups: [group, otherGroup] });

    project = calendarizationProjectReducer(loadCalendarizationProject()!, {
      type: "group/update", group: { ...group, name: "МТ-43" },
    });
    saveCalendarizationProject(project);
    expect(loadCalendarizationProject()).toEqual({
      ...initial, groups: [{ ...group, name: "МТ-43" }, otherGroup],
    });

    project = calendarizationProjectReducer(loadCalendarizationProject()!, {
      type: "group/remove", groupId: group.id,
    });
    saveCalendarizationProject(project);
    expect(loadCalendarizationProject()).toEqual({ ...initial, groups: [otherGroup] });

    project = calendarizationProjectReducer(loadCalendarizationProject()!, {
      type: "group/remove", groupId: otherGroup.id,
    });
    saveCalendarizationProject(project);
    expect(loadCalendarizationProject()).toEqual(initial);
    expect(initial.groups).toEqual([]);
  });

  it("loads existing v1 projects and clears persisted groups", () => {
    const project = {
      ...createEmptyCalendarizationProject(),
      groups: [{ id: "existing", name: "МТ-41" }],
    };
    localStorage.setItem("calendarization-project:v1", JSON.stringify(project));
    expect(loadCalendarizationProject()).toEqual(project);
    clearCalendarizationProjectStorage();
    expect(loadCalendarizationProject()).toBeNull();
  });

  it("handles invalid stored JSON", () => {
    localStorage.setItem("calendarization-project:v1", "{");
    expect(loadCalendarizationProject()).toBeNull();
  });

  it("tolerates unavailable browser storage", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => { throw new Error("Storage unavailable"); },
      setItem: () => { throw new Error("Storage unavailable"); },
    });
    expect(loadCalendarizationProject()).toBeNull();
    expect(() => saveCalendarizationProject(createEmptyCalendarizationProject())).not.toThrow();
  });
});
