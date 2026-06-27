import Reveal from "./Reveal.jsx";

const PROJECTS = [
  {
    n: "01",
    title: "Aperture",
    tag: "Photography platform",
    year: "2025",
    blurb:
      "A minimalist gallery and print store for film photographers — fast image pipeline, editorial layout, monochrome-first theme.",
    stack: ["Next.js", "Tailwind", "Supabase"],
  },
  {
    n: "02",
    title: "Cadence",
    tag: "Habit dashboard",
    year: "2024",
    blurb:
      "A calm habit tracker with streak analytics and a motion system that rewards consistency without shouting.",
    stack: ["React", "Framer Motion", "Recharts"],
  },
  {
    n: "03",
    title: "Monogram",
    tag: "Brand toolkit",
    year: "2024",
    blurb:
      "An internal design-token manager that keeps color, type, and spacing in sync across a product suite.",
    stack: ["TypeScript", "Vite", "Radix UI"],
  },
  {
    n: "04",
    title: "Field Notes",
    tag: "Writing app",
    year: "2023",
    blurb:
      "A distraction-free markdown editor with local-first sync and a typography engine tuned for long reads.",
    stack: ["React", "IndexedDB", "Node"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="bg-charcoal py-28 text-paper lg:py-40">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="mb-16 flex items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium tabular-nums tracking-[0.3em] text-paper/40">
              04
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-paper/40">
              Recent Projects
            </span>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <Reveal
              key={p.title}
              delay={(i % 2) * 90}
              as="article"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-paper/10 bg-ink/40 p-8 transition-colors duration-400 hover:border-paper/30 lg:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-5xl font-light text-paper/15 transition-colors duration-300 group-hover:text-paper/30">
                  {p.n}
                </span>
                <span className="text-xs tabular-nums text-paper/40">
                  {p.year}
                </span>
              </div>

              <div className="mt-16">
                <p className="text-xs uppercase tracking-[0.25em] text-paper/40">
                  {p.tag}
                </p>
                <h3 className="mt-2 font-display text-3xl font-light tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/60">
                  {p.blurb}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-paper/15 px-2.5 py-1 text-[11px] text-paper/55"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-xl text-paper/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-paper"
                  >
                    →
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
