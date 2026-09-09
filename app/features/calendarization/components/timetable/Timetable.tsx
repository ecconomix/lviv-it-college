import { useCalendarizationProject } from "~/features/calendarization/context/calendarization-project-context/calendarization-project-context";
import { AssignmentPicker } from "./AssignmentPicker";
import { DAYS, PAIRS } from "./constants";
import type { AssignmentOption } from "./types";

export function WeeklyTimetable() {
  const { project, setTimetableSlot, clearTimetableSlot } =
    useCalendarizationProject();

  const options: AssignmentOption[] = project.assignments.flatMap(
    (assignment) => {
      const group = project.groups.find(
        (group) => group.id === assignment.groupId,
      );
      const subject = project.subjects.find(
        (subject) => subject.id === assignment.subjectId,
      );

      return group && subject
        ? [
            {
              value: assignment.id,
              label: `${group.name} — ${subject.name}`,
            },
          ]
        : [];
    },
  );

  return (
    <section className="space-y-6" aria-labelledby="timetable-heading">
      <div>
        <h2 id="timetable-heading" className="text-xl font-semibold">
          Тижневий розклад
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Оберіть групу та предмет для кожної пари. Зміни зберігаються
          автоматично. Порожня клітинка означає відсутність заняття.
        </p>
      </div>

      {options.length === 0 ? (
        <div className="rounded-xl border bg-muted/30 p-6">
          <p className="text-sm text-muted-foreground">
            Спочатку призначте предмети групам.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[1100px] table-fixed text-sm">
            <caption className="sr-only">
              Розклад на п’ять днів, по шість пар щодня
            </caption>
            <thead className="bg-muted/30">
              <tr>
                <th scope="col" className="w-16 p-3 text-left">
                  Пара
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day.value}
                    scope="col"
                    className="p-3 text-left font-medium"
                  >
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {PAIRS.map((pairNumber) => (
                <tr key={pairNumber} className="border-t">
                  <th scope="row" className="p-3 font-medium">
                    {pairNumber}
                  </th>

                  {DAYS.map((day) => {
                    const slot = project.timetableSlots.find(
                      (slot) =>
                        slot.weekday === day.value &&
                        slot.pairNumber === pairNumber,
                    );
                    const selected =
                      options.find(
                        (option) => option.value === slot?.teachingAssignmentId,
                      ) ?? null;

                    return (
                      <td key={day.value} className="p-2 align-top">
                        <AssignmentPicker
                          options={options}
                          value={selected}
                          label={`${day.label}, пара ${pairNumber}`}
                          onChange={(option) => {
                            if (option) {
                              setTimetableSlot({
                                weekday: day.value,
                                pairNumber,
                                teachingAssignmentId: option.value,
                              });
                            } else {
                              clearTimetableSlot(day.value, pairNumber);
                            }
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
