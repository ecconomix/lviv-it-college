import { format, isValid, parseISO } from "date-fns";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { CalendarizationProject, LessonType } from "../types";
import { generateCalendarization } from "./generate-calendarization";

const LESSON_LABELS: Record<LessonType, string> = {
  lecture: "Лекція",
  lab: "Лабораторна",
  practice: "Практична",
};

const dateLabel = (date: string) => format(parseISO(date), "dd.MM.yyyy");

function createRow(values: string[], header = false) {
  return new TableRow({
    tableHeader: header,
    children: values.map(
      (text) =>
        new TableCell({
          children: [
            new Paragraph({
              spacing: { after: 80 },
              children: [new TextRun({ text, bold: header })],
            }),
          ],
        }),
    ),
  });
}

export async function exportCalendarizationsDocx(
  project: CalendarizationProject,
): Promise<void> {
  const { startDate, endDate } = project.term;

  if (
    !isValid(parseISO(startDate)) ||
    !isValid(parseISO(endDate)) ||
    startDate > endDate
  ) {
    throw new Error("Збережіть коректні дати семестру.");
  }

  if (project.assignments.length === 0) {
    throw new Error("Спочатку призначте предмети групам.");
  }

  const children: (Paragraph | Table)[] = [];

  project.assignments.forEach((assignment, index) => {
    const group = project.groups.find(
      (group) => group.id === assignment.groupId,
    );
    const subject = project.subjects.find(
      (subject) => subject.id === assignment.subjectId,
    );

    if (!group || !subject) {
      throw new Error(
        "Одну з груп або предметів не знайдено. Перевірте прив’язки.",
      );
    }

    children.push(
      new Paragraph({
        text: `${group.name} — ${subject.name}`,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: index > 0,
        keepNext: true,
      }),
      new Paragraph({
        text: `Семестр: ${dateLabel(startDate)} — ${dateLabel(endDate)}`,
        spacing: { after: 200 },
      }),
    );

    const lessons = subject.curriculum?.lessons ?? [];

    // Keep incomplete assignments visible in the exported document.
    if (lessons.length === 0) {
      children.push(
        new Paragraph({
          text: subject.curriculum
            ? "Календаризацію не сформовано: навчальна програма не містить занять."
            : "Календаризацію не сформовано: навчальну програму не завантажено.",
          spacing: { after: 200 },
        }),
      );
      return;
    }

    const result = generateCalendarization({
      term: project.term,
      assignment,
      timetableSlots: project.timetableSlots,
      curriculumLessons: lessons,
    });

    children.push(
      new Paragraph({
        text: `Заплановано занять: ${result.rows.length} із ${lessons.length}.`,
        spacing: { after: 160 },
      }),
    );

    for (const warning of result.warnings) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              bold: true,
              text:
                warning.type === "unscheduled-lessons"
                  ? `Увага: незапланованих занять — ${warning.count}.`
                  : `Увага: дат без тем — ${warning.count}.`,
            }),
          ],
          spacing: { after: 160 },
        }),
      );
    }

    if (result.rows.length === 0) {
      children.push(
        new Paragraph({
          text: "У межах семестру немає доступних дат для цієї групи та предмета.",
        }),
      );
      return;
    }

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        columnWidths: [500, 1200, 600, 1400, 5326],
        rows: [
          createRow(["№", "Дата", "Пара", "Тип", "Тема"], true),
          ...result.rows.map((row) =>
            createRow([
              String(row.lessonOrder),
              dateLabel(row.date),
              String(row.pairNumber),
              LESSON_LABELS[row.type],
              row.topic,
            ]),
          ),
        ],
      }),
    );
  });

  const documentFile = new Document({
    title: "Календаризація",
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 22 },
          paragraph: { spacing: { after: 120 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(documentFile);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  try {
    link.href = url;
    link.download = `Календаризація_${startDate}_${endDate}.docx`;
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
  }
}
