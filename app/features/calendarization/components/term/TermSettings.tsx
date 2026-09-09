import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCalendarizationProject } from "~/features/calendarization/context/calendarization-project-context/calendarization-project-context";
import type { Term } from "~/features/calendarization/types";

export function TermSettings() {
  const { project, setTerm } = useCalendarizationProject();

  return (
    <TermForm
      key={`${project.term.startDate}:${project.term.endDate}`}
      term={project.term}
      onSave={setTerm}
    />
  );
}

function TermForm({
  term,
  onSave,
}: {
  term: Term;
  onSave: (term: Term) => void;
}) {
  const [startDate, setStartDate] = useState(term.startDate);
  const [endDate, setEndDate] = useState(term.endDate);

  const invalidRange = Boolean(startDate && endDate && endDate < startDate);
  const hasChanges = startDate !== term.startDate || endDate !== term.endDate;
  const canSave = Boolean(startDate && endDate && !invalidRange && hasChanges);

  return (
    <section className="space-y-6" aria-labelledby="term-heading">
      <div>
        <h2 id="term-heading" className="text-xl font-semibold">
          Семестр
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Вкажіть перший та останній день семестру.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSave) onSave({ startDate, endDate });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="term-start" className="text-sm font-medium">
              Початок семестру
            </label>
            <Input
              id="term-start"
              type="date"
              required
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="term-end" className="text-sm font-medium">
              Кінець семестру
            </label>
            <Input
              id="term-end"
              type="date"
              required
              value={endDate}
              aria-invalid={invalidRange || undefined}
              aria-describedby={invalidRange ? "term-error" : undefined}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        </div>

        {invalidRange && (
          <p id="term-error" role="alert" className="text-sm text-destructive">
            Кінець семестру не може бути раніше його початку.
          </p>
        )}

        <Button type="submit" disabled={!canSave}>
          Зберегти
        </Button>
      </form>
    </section>
  );
}
