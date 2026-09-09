// features/calendarization/services/curriculum-extraction.ts

import type { CurriculumLesson } from "../types";

export type ExtractCurriculumResult = {
  lessons: CurriculumLesson[];
};

export async function extractCurriculum(
  file: File,
): Promise<ExtractCurriculumResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    lessons: [
      {
        id: crypto.randomUUID(),
        order: 1,
        type: "lecture",
        topic: "Вступ до предмета",
        hours: 2,
      },
      {
        id: crypto.randomUUID(),
        order: 2,
        type: "lab",
        topic: "Практичне ознайомлення з матеріалом",
        hours: 2,
      },
      {
        id: crypto.randomUUID(),
        order: 3,
        type: "lecture",
        topic: "Основні поняття та принципи",
        hours: 2,
      },
      {
        id: crypto.randomUUID(),
        order: 4,
        type: "lab",
        topic: "Застосування основних принципів",
        hours: 2,
      },
    ],
  };
}
