import type { Route } from "./+types/calendarization";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Календаризація | Львівський ІТ коледж" },
    {
      name: "description",
      content: "Інструмент календаризації навчального процесу Львівського ІТ коледжу.",
    },
  ];
}

export default function Calendarization() {
  return (
    <main className="flex-1 px-6 py-10 sm:px-10 lg:px-16">
      <div className="max-w-2xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Інструменти</p>
          <h1 className="text-3xl font-semibold tracking-tight">Календаризація</h1>
          <p className="leading-relaxed text-muted-foreground">
            Простір для планування навчального процесу та розподілу занять за
            календарем Львівського ІТ коледжу.
          </p>
        </div>
        <div className="rounded-xl border bg-muted/30 p-6">
          <h2 className="font-medium">Інструмент у розробці</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Тут з’являться можливості для календаризації навчальних занять.
          </p>
        </div>
      </div>
    </main>
  );
}
