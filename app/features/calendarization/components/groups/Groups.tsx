import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCalendarizationProject } from "~/features/calendarization/context/calendarization-project-context/calendarization-project-context";
import { GroupRow } from "./components/GroupRow";

export function Groups() {
  const { project, addGroup, updateGroup, removeGroup } =
    useCalendarizationProject();
  const [name, setName] = useState("");

  const handleAddGroup = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    addGroup({ id: crypto.randomUUID(), name: trimmedName });
    setName("");
  };

  return (
    <section className="space-y-6" aria-labelledby="groups-heading">
      <div>
        <h2 id="groups-heading" className="text-xl font-semibold">Групи</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Додайте навчальні групи, для яких потрібно сформувати календаризацію.
        </p>
      </div>

      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          handleAddGroup();
        }}
      >
        <Input
          aria-label="Назва групи"
          placeholder="Назва групи"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button type="submit" disabled={!name.trim()}>Додати</Button>
      </form>

      {project.groups.length === 0 ? (
        <div className="rounded-xl border bg-muted/30 p-6">
          <p className="text-sm text-muted-foreground">Груп ще немає.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {project.groups.map((group) => (
            <GroupRow
              key={group.id}
              group={group}
              onRename={(name) => updateGroup({ ...group, name })}
              onRemove={() => removeGroup(group.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
