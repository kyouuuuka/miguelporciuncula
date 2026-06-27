import Reveal from "./Reveal.jsx";

const ROLES = [
  {
    period: "2024 — Now",
    role: "Frontend Developer",
    org: "Freelance / Independent",
    blurb:
      "Designing and building marketing sites, dashboards, and product UIs for early-stage teams. End-to-end: from wireframe to shipped React app.",
    stack: ["React", "TypeScript", "Tailwind"],
  },
  {
    period: "2023 — 2024",
    role: "UI Engineer",
    org: "Studio Project",
    blurb:
      "Owned the component library and motion system for a content platform. Cut page weight and brought a consistent, accessible design language across the app.",
    stack: ["Next.js", "Framer Motion", "Storybook"],
  },
  {
    period: "2022 — 2023",
    role: "Junior Web Developer",
    org: "Early Career",
    blurb:
      "Shipped responsive client websites and learned the craft: semantic HTML, performance budgets, and the value of a tidy git history.",
    stack: ["JavaScript", "Vite", "Node"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="bg-ink py-28 text-paper lg:py-40">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="mb-16 flex items-center gap-4">
          <span className="text-xs font-medium tabular-nums tracking-[0.3em] text-paper/40">
            02
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-paper/40">
            Experience
          </span>
        </Reveal>

        <div className="divide-y divide-paper/10 border-y border-paper/10">
          {ROLES.map((r, i) => (
            <Reveal
              key={r.role}
              delay={i * 80}
              className="group grid gap-4 py-9 transition-colors duration-300 hover:bg-paper/[0.03] sm:grid-cols-12 sm:gap-8 sm:px-2"
            >
              <div className="sm:col-span-3">
                <span className="text-sm tabular-nums text-paper/50">
                  {r.period}
                </span>
              </div>
              <div className="sm:col-span-6">
                <h3 className="font-display text-2xl font-light tracking-tight">
                  {r.role}
                </h3>
                <p className="mt-1 text-sm text-paper/50">{r.org}</p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/70">
                  {r.blurb}
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-2 sm:col-span-3 sm:justify-end">
                {r.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-paper/20 px-3 py-1 text-[11px] text-paper/60"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
