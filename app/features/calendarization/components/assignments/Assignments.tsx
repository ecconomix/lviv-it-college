import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useCalendarizationProject } from "~/features/calendarization/context/calendarization-project-context/calendarization-project-context";

const selectClassName =
  "h-8 min-w-0 flex-1 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function Assignments() {
  const { project, addAssignment, removeAssignment } =
    useCalendarizationProject();

  const [groupId, setGroupId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  // Deleted groups or subjects must no longer count as selected.
  const selectedGroupId = project.groups.some((group) => group.id === groupId)
    ? groupId
    : "";
  const selectedSubjectId = project.subjects.some(
    (subject) => subject.id === subjectId,
  )
    ? subjectId
    : "";

  const alreadyAssigned = project.assignments.some(
    (assignment) =>
      assignment.groupId === selectedGroupId &&
      assignment.subjectId === selectedSubjectId,
  );

  const canAssign =
    Boolean(selectedGroupId && selectedSubjectId) && !alreadyAssigned;

  const needsGroupsOrSubjects =
    project.groups.length === 0 || project.subjects.length === 0;

  const handleAssign = () => {
    if (!canAssign) return;

    addAssignment({
      id: crypto.randomUUID(),
      groupId: selectedGroupId,
      subjectId: selectedSubjectId,
    });
    setSubjectId("");
  };

  return (
    <section className="space-y-6" aria-labelledby="assignments-heading">
      <div>
        <h2 id="assignments-heading" className="text-xl font-semibold">
          Предмети груп
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Вкажіть, які предмети викладаються в кожній групі.
        </p>
      </div>

      {needsGroupsOrSubjects ? (
        <p className="text-sm text-muted-foreground">
          Спочатку додайте хоча б одну групу та один предмет.
        </p>
      ) : (
        <form
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            handleAssign();
          }}
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              className={selectClassName}
              aria-label="Група"
              value={selectedGroupId}
              onChange={(event) => setGroupId(event.target.value)}
            >
              <option value="">Оберіть групу</option>
              {project.groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>

            <select
              className={selectClassName}
              aria-label="Предмет"
              value={selectedSubjectId}
              onChange={(event) => setSubjectId(event.target.value)}
            >
              <option value="">Оберіть предмет</option>
              {project.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <Button type="submit" disabled={!canAssign}>
              Призначити
            </Button>
          </div>

          {alreadyAssigned && (
            <p role="status" className="text-sm text-muted-foreground">
              Цей предмет уже призначено цій групі.
            </p>
          )}
        </form>
      )}

      {project.assignments.length === 0 ? (
        <div className="rounded-xl border bg-muted/30 p-6">
          <p className="text-sm text-muted-foreground">Призначень ще немає.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {project.assignments.map((assignment) => {
            const group = project.groups.find(
              (group) => group.id === assignment.groupId,
            );
            const subject = project.subjects.find(
              (subject) => subject.id === assignment.subjectId,
            );

            return (
              <li
                key={assignment.id}
                className="flex items-start gap-4 rounded-xl border p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="break-words font-medium">
                    {group?.name ?? "Невідома група"}
                  </p>
                  <p className="break-words text-sm text-muted-foreground">
                    {subject?.name ?? "Невідомий предмет"}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  aria-label={`Видалити призначення: ${group?.name ?? "Невідома група"} — ${subject?.name ?? "Невідомий предмет"}`}
                  onClick={() => removeAssignment(assignment.id)}
                >
                  Видалити
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
