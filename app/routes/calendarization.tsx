import { CalendarizationApp } from "~/features/calendarization/CalendarizationApp";
import type { Route } from "./+types/calendarization";
import {
  CalendarizationProjectProvider,
  useCalendarizationProject,
} from "~/features/calendarization/context/calendarization-project-context/calendarization-project-context";
import { createEmptyCalendarizationProject } from "~/features/calendarization/context/calendarization-project-context/calendarization-project";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Календаризація | Львівський ІТ коледж" },
    {
      name: "description",
      content:
        "Інструмент календаризації навчального процесу Львівського ІТ коледжу.",
    },
  ];
}

export default function Calendarization() {
  return (
    <CalendarizationProjectProvider
      initialProject={createEmptyCalendarizationProject()}
    >
      <CalendarizationApp />
    </CalendarizationProjectProvider>
  );
}
