// features/calendarization/services/curriculum-extraction.ts

import type { CurriculumLesson } from "../types";

export type ExtractCurriculumResult = {
  lessons: CurriculumLesson[];
};

export async function extractCurriculum(
  file: File,
): Promise<ExtractCurriculumResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const lessons = Array.from({ length: 34 }, (_, index) => ({
    id: crypto.randomUUID(),
    order: index + 1,
    type: index % 2 === 0 ? ("lecture" as const) : ("lab" as const),
    topic:
      index % 2 === 0
        ? `Тема ${Math.floor(index / 2) + 1}: Основні поняття та принципи`
        : `Тема ${Math.floor(index / 2) + 1}: Практичне застосування`,
    hours: index === 374 ? 1 : 2,
  }));

  return {
    lessons,
  };
}
