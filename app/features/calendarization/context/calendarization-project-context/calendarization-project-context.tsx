import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import type {
  CalendarizationProject,
  Group,
  Subject,
  TeachingAssignment,
  Term,
  TimetableSlot,
  Weekday,
} from "../../types";
import { calendarizationProjectReducer } from "./calendarization-project-reducer";
import {
  loadCalendarizationProject,
  saveCalendarizationProject,
} from "./calendarization-project-storage";

type CalendarizationProjectContextValue = {
  project: CalendarizationProject;

  addSubject: (subject: Subject) => void;
  updateSubject: (subject: Subject) => void;
  removeSubject: (subjectId: string) => void;

  addGroup: (group: Group) => void;
  updateGroup: (group: Group) => void;
  removeGroup: (groupId: string) => void;

  addAssignment: (assignment: TeachingAssignment) => void;
  removeAssignment: (assignmentId: string) => void;

  setTerm: (term: Term) => void;

  setTimetableSlot: (slot: TimetableSlot) => void;
  clearTimetableSlot: (weekday: Weekday, pairNumber: number) => void;

  resetProject: () => void;
};

const CalendarizationProjectContext =
  createContext<CalendarizationProjectContextValue | null>(null);

type CalendarizationProjectProviderProps = {
  initialProject: CalendarizationProject;
  children: ReactNode;
};

export function CalendarizationProjectProvider({
  initialProject,
  children,
}: CalendarizationProjectProviderProps) {
  const [project, dispatch] = useReducer(
    calendarizationProjectReducer,
    initialProject,
  );

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedProject = loadCalendarizationProject();

    if (storedProject) {
      dispatch({
        type: "project/replace",
        project: storedProject,
      });
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    saveCalendarizationProject(project);
  }, [project, isHydrated]);

  const value: CalendarizationProjectContextValue = {
    project,

    addSubject(subject) {
      dispatch({
        type: "subject/add",
        subject,
      });
    },

    updateSubject(subject) {
      dispatch({
        type: "subject/update",
        subject,
      });
    },

    removeSubject(subjectId) {
      dispatch({
        type: "subject/remove",
        subjectId,
      });
    },

    addGroup(group) {
      dispatch({
        type: "group/add",
        group,
      });
    },

    updateGroup(group) {
      dispatch({
        type: "group/update",
        group,
      });
    },

    removeGroup(groupId) {
      dispatch({
        type: "group/remove",
        groupId,
      });
    },

    addAssignment(assignment) {
      dispatch({
        type: "assignment/add",
        assignment,
      });
    },

    removeAssignment(assignmentId) {
      dispatch({
        type: "assignment/remove",
        assignmentId,
      });
    },

    setTerm(term) {
      dispatch({
        type: "term/set",
        term,
      });
    },

    setTimetableSlot(slot) {
      dispatch({
        type: "timetable/set",
        slot,
      });
    },

    clearTimetableSlot(weekday, pairNumber) {
      dispatch({
        type: "timetable/clear",
        weekday,
        pairNumber,
      });
    },

    resetProject() {
      dispatch({
        type: "project/reset",
      });
    },
  };

  return (
    <CalendarizationProjectContext.Provider value={value}>
      {children}
    </CalendarizationProjectContext.Provider>
  );
}

export function useCalendarizationProject(): CalendarizationProjectContextValue {
  const context = useContext(CalendarizationProjectContext);

  if (!context) {
    throw new Error(
      "useCalendarizationProject must be used within CalendarizationProjectProvider",
    );
  }

  return context;
}
