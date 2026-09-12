import { Bot, PencilRuler, Timer, Wrench } from "lucide-react";
import { stats } from "@/content/home";

const icons = [Timer, PencilRuler, Bot, Wrench];

export function StatsTicker() {
  const items = stats.map((text, index) => ({ text, Icon: icons[index] }));
  const loop = [...items, ...items];

  return (
    <section aria-label="Highlights" className="ticker perforated relative overflow-hidden py-5">
      <ul className="sr-only">
        {stats.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
      <div aria-hidden className="ticker-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {loop.map(({ text, Icon }, index) => (
              <li
                key={`${copy}-${index}`}
                className="flex items-center gap-3 px-7 text-[1.05rem] font-medium whitespace-nowrap sm:px-10"
              >
                <Icon className="size-5 text-ballpoint-ink" strokeWidth={1.75} />
                {text}
                <span className="ml-7 size-2 rotate-45 bg-canary sm:ml-10" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
