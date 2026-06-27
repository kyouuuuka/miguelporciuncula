import Reveal from "./Reveal.jsx";

const GROUPS = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3"],
  },
  {
    title: "Styling & Motion",
    items: ["Tailwind CSS", "Framer Motion", "Sass", "Radix UI"],
  },
  {
    title: "Tooling",
    items: ["Vite", "Git", "Figma", "Vercel", "ESLint"],
  },
  {
    title: "Backend & Data",
    items: ["Node.js", "Express", "PostgreSQL", "REST", "Supabase"],
  },
];

export default function Toolkit() {
  return (
    <section id="toolkit" data-nav="light" className="bg-paper py-28 lg:py-40">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="mb-16 flex items-center gap-4">
          <span className="text-xs font-medium tabular-nums tracking-[0.3em] text-ink/40">
            03
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-ink/40">
            Toolkit
          </span>
        </Reveal>

        <Reveal className="mb-16 max-w-2xl">
          <h2 className="font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-[3rem]">
            The tech I reach for
          </h2>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
          {GROUPS.map((g, i) => (
            <Reveal
              key={g.title}
              delay={i * 70}
              className="bg-paper p-8 lg:p-10"
            >
              <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-ink/40">
                {g.title}
              </h3>
              <ul className="flex flex-wrap gap-2.5">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-ink/10 bg-bone/60 px-4 py-2 text-sm text-ink/80 transition-colors duration-200 hover:border-ink/40 hover:bg-ink hover:text-paper"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
