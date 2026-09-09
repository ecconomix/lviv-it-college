import { Groups } from "./components/groups/Groups";
import { Header } from "./components";
import { Subjects } from "./components/subjects/Subjects";

export const CalendarizationApp = () => {
  return (
    <div className="flex-1 px-6 py-10 sm:px-10 lg:px-16">
      <div className="max-w-2xl space-y-8">
        <Header />
        <Subjects />
        <Groups />
      </div>
    </div>
  );
};
