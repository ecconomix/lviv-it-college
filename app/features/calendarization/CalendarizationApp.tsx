import { Groups } from "./components/groups/Groups";
import { Header } from "./components";
import { Subjects } from "./components/subjects/Subjects";
import { Assignments } from "./components/assignments/Assignments";
import { TermSettings } from "./components/term/TermSettings";
import { WeeklyTimetable } from "./components/timetable/Timetable";

export const CalendarizationApp = () => {
  return (
    <div className="flex-1 px-6 py-10 sm:px-10 lg:px-16">
      <div className="max-w-6xl space-y-8 m-auto">
        <Header />
        <Subjects />
        <Groups />
        <Assignments />
        <TermSettings />
        <WeeklyTimetable />
      </div>
    </div>
  );
};
