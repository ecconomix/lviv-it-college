import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Subject } from "~/features/calendarization/types";
import { CurriculumUpload } from "./CurriculumUpload";

type SubjectRowProps = {
  subject: Subject;
  onRename: (name: string) => void;
  onRemove: () => void;
  onCurriculumUpload: (file: File) => Promise<void>;
};

export function SubjectRow({
  subject,
  onRename,
  onRemove,
  onCurriculumUpload,
}: SubjectRowProps) {
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
    <div className="rounded-xl border p-4">
      <div className="flex items-start gap-4">
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

              {subject.curriculum ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {subject.curriculum.fileName}
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  Навчальну програму не завантажено
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                onClick={handleSave}
                disabled={!name.trim()}
              >
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

      {!isEditing && (
        <div className="mt-4">
          <CurriculumUpload
            hasCurriculum={Boolean(subject.curriculum)}
            onFileSelected={onCurriculumUpload}
          />
        </div>
      )}
    </div>
  );
}
