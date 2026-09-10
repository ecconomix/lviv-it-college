import { format, isValid, parseISO } from "date-fns";
import { useCalendarizationProject } from "~/features/calendarization/context/calendarization-project-context/calendarization-project-context";
import { generateCalendarization } from "~/features/calendarization/utils/generate-calendarization";
import type { LessonType } from "~/features/calendarization/types";
import { ExportDocxButton } from "./ExportDocxButton";

const LESSON_LABELS: Record<LessonType, string> = {
  lecture: "Лекція",
  lab: "Лабораторна",
  practice: "Практична",
};

export function CalendarizationResults() {
  const { project } = useCalendarizationProject();
  const { startDate, endDate } = project.term;

  const validTerm =
    isValid(parseISO(startDate)) &&
    isValid(parseISO(endDate)) &&
    startDate <= endDate;

  return (
    <section className="space-y-6" aria-labelledby="results-heading">
      <div>
        <h2 id="results-heading" className="text-xl font-semibold">
          Результати календаризації
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Попередній перегляд для кожної групи та предмета. Результати
          оновлюються після зміни збережених даних.
        </p>
      </div>

      <ExportDocxButton />

      {!validTerm ? (
        <p className="text-sm text-muted-foreground">
          Збережіть коректні дати семестру, щоб побачити результати.
        </p>
      ) : project.assignments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Спочатку призначте предмети групам.
        </p>
      ) : (
        <div className="space-y-4">
          {project.assignments.map((assignment) => {
            const group = project.groups.find(
              (group) => group.id === assignment.groupId,
            );
            const subject = project.subjects.find(
              (subject) => subject.id === assignment.subjectId,
            );
            const lessons = subject?.curriculum?.lessons ?? [];

            const result =
              group && subject && lessons.length > 0
                ? generateCalendarization({
                    term: project.term,
                    assignment,
                    timetableSlots: project.timetableSlots,
                    curriculumLessons: lessons,
                  })
                : null;

            const hasWeeklySlots = project.timetableSlots.some(
              (slot) => slot.teachingAssignmentId === assignment.id,
            );

            return (
              <article
                key={assignment.id}
                className="space-y-4 rounded-xl border p-4"
              >
                <div>
                  <h3 className="break-words font-semibold">
                    {group?.name ?? "Невідома група"} —{" "}
                    {subject?.name ?? "Невідомий предмет"}
                  </h3>
                  {result && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Заплановано занять: {result.rows.length} із{" "}
                      {lessons.length}
                    </p>
                  )}
                </div>

                {!group || !subject ? (
                  <p className="text-sm text-destructive">
                    Групу або предмет не знайдено. Видаліть цю прив’язку та
                    створіть її повторно.
                  </p>
                ) : !subject.curriculum ? (
                  <p className="text-sm text-muted-foreground">
                    Завантажте навчальну програму для цього предмета.
                  </p>
                ) : lessons.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Навчальна програма ще не містить занять. Для календаризації
                    потрібен список тем.
                  </p>
                ) : result ? (
                  <>
                    {!hasWeeklySlots && (
                      <p className="text-sm text-muted-foreground">
                        Додайте цю групу та предмет до тижневого розкладу.
                      </p>
                    )}

                    {result.warnings.length > 0 && (
                      <ul className="space-y-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                        {result.warnings.map((warning) => (
                          <li key={warning.type}>
                            {warning.type === "unscheduled-lessons"
                              ? `Незапланованих занять: ${warning.count}. Додайте пари до розкладу або перевірте межі семестру.`
                              : `Дат без тем: ${warning.count}. Перевірте розклад і кількість занять у програмі.`}
                          </li>
                        ))}
                      </ul>
                    )}

                    {result.rows.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        У межах семестру немає доступних дат для цієї комбінації
                        групи та предмета.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                          <caption className="sr-only">
                            {group.name} — {subject.name}
                          </caption>
                          <thead className="border-b bg-muted/30">
                            <tr>
                              <th scope="col" className="p-2">
                                №
                              </th>
                              <th scope="col" className="p-2">
                                Дата
                              </th>
                              <th scope="col" className="p-2">
                                Пара
                              </th>
                              <th scope="col" className="p-2">
                                Тип
                              </th>
                              <th scope="col" className="p-2">
                                Тема
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.rows.map((row) => (
                              <tr
                                key={`${row.date}:${row.pairNumber}`}
                                className="border-b last:border-0"
                              >
                                <td className="p-2 align-top">
                                  {row.lessonOrder}
                                </td>
                                <td className="whitespace-nowrap p-2 align-top">
                                  {format(parseISO(row.date), "dd.MM.yyyy")}
                                </td>
                                <td className="p-2 align-top">
                                  {row.pairNumber}
                                </td>
                                <td className="p-2 align-top">
                                  {LESSON_LABELS[row.type]}
                                </td>
                                <td className="p-2 align-top">{row.topic}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
