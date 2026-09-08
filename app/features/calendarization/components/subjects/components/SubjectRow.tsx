import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Subject } from "~/features/calendarization/types";

type SubjectRowProps = {
  subject: Subject;
  onRename: (name: string) => void;
  onRemove: () => void;
};

export function SubjectRow({ subject, onRename, onRemove }: SubjectRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(subject.name);

  const handleSave = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    onRename(trimmedName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(subject.name);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border p-4">
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <Input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSave();
              }

              if (event.key === "Escape") {
                handleCancel();
              }
            }}
          />
        ) : (
          <>
            <p className="truncate font-medium">{subject.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Занять: {subject.lessons.length}
            </p>
          </>
        )}
      </div>

      <div className="flex shrink-0 gap-2">
        {isEditing ? (
          <>
            <Button type="button" onClick={handleSave} disabled={!name.trim()}>
              Зберегти
            </Button>

            <Button variant="outline" onClick={handleCancel}>
              Скасувати
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Редагувати
            </Button>

            <Button variant="destructive" onClick={onRemove}>
              Видалити
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
