import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Головна | Львівський ІТ коледж" },
    {
      name: "description",
      content:
        "Внутрішні інструменти автоматизації Львівського ІТ коледжу — менше рутини, більше часу для навчання.",
    },
  ];
}

export default function Home() {
  return (
    <main lang="uk" className="flex flex-1 items-center px-6 py-16 sm:px-10 lg:px-16">
      <div className="w-full max-w-2xl space-y-8">
        <p className="text-sm font-medium text-muted-foreground">
          Львівський ІТ коледж / Внутрішній простір
        </p>

        <div className="space-y-5">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            Менше рутини.
            <br />
            Більше часу для навчання.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Це внутрішній простір інструментів автоматизації для команди
            Львівського ІТ коледжу. Тут ми спрощуємо щоденні завдання й організацію
            навчального процесу, щоб зосередитися на головному.
          </p>
        </div>

        <div className="border-t pt-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Інструменти зібрані в бічному меню. Цей простір зростатиме разом із
            потребами команди.
          </p>
        </div>
      </div>
    </main>
  );
}
