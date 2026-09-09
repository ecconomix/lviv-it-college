import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Group } from "~/features/calendarization/types";

type GroupRowProps = {
  group: Group;
  onRename: (name: string) => void;
  onRemove: () => void;
};

export function GroupRow({ group, onRename, onRemove }: GroupRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(group.name);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    onRename(trimmedName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(group.name);
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl border p-4" role="group" aria-label={group.name}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <Input
              autoFocus
              aria-label={`Нова назва групи ${group.name}`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSave();
                }
                if (event.key === "Escape") handleCancel();
              }}
            />
          ) : (
            <p className="break-words font-medium">{group.name}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          {isEditing ? (
            <>
              <Button type="button" onClick={handleSave} disabled={!name.trim()}>
                Зберегти
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Скасувати
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={() => {
                setName(group.name);
                setIsEditing(true);
              }}>
                Редагувати
              </Button>
              <Button type="button" variant="destructive" onClick={onRemove}>
                Видалити
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
