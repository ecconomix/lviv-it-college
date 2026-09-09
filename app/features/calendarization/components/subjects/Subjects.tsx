import { useState } from "react";
import { useCalendarizationProject } from "../../context/calendarization-project-context/calendarization-project-context";
import { SubjectRow } from "./components/SubjectRow";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export function Subjects() {
  const { project, addSubject, updateSubject, removeSubject } =
    useCalendarizationProject();

  const [name, setName] = useState("");

  const handleAddSubject = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    addSubject({
      id: crypto.randomUUID(),
      name: trimmedName,
      curriculum: null,
    });

    setName("");
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Предмети</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Додайте предмети, для яких потрібно сформувати календаризацію.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleAddSubject();
            }
          }}
          placeholder="Назва предмета"
        />

        <Button onClick={handleAddSubject} disabled={!name.trim()}>
          Додати
        </Button>
      </div>

      {project.subjects.length === 0 ? (
        <div className="rounded-xl border bg-muted/30 p-6">
          <p className="text-sm text-muted-foreground">Предметів ще немає.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {project.subjects.map((subject) => (
            <SubjectRow
              key={subject.id}
              subject={subject}
              onRename={(name) =>
                updateSubject({
                  ...subject,
                  name,
                })
              }
              onRemove={() => removeSubject(subject.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
