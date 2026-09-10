import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useCalendarizationProject } from "~/features/calendarization/context/calendarization-project-context/calendarization-project-context";

export function ExportDocxButton() {
  const { project } = useCalendarizationProject();
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setError("");

    try {
      const { exportCalendarizationsDocx } =
        await import("~/features/calendarization/utils/export-calendarizations-docx");
      await exportCalendarizationsDocx(project);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Не вдалося створити документ. Спробуйте ще раз.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleExport}
        disabled={isExporting || project.assignments.length === 0}
      >
        {isExporting ? "Створення документа…" : "Експортувати DOCX"}
      </Button>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
