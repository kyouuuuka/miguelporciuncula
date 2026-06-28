import Reveal from "./Reveal.jsx";

const ROLES = [
  {
    period: "Early 2026",
    role: "Full-Stack & Game Developer",
    org: "Student",
    blurb:
      "Co-developed a gamified science LMS for Grade 7 students as an undergraduate thesis, designing interactive lessons around shorter attention spans. Built two in-lesson games with Phaser on a React/Node stack.",
    stack: ["React", "Vite", "Tailwind", "Node", "Phaser"],
  },
  {
    period: "2025 — Early 2026",
    role: "AI & Back-End Developer",
    org: "Student",
    blurb:
      "Built an AI-driven internship matching platform that pairs students with best-fit companies by analyzing their skill sets. Led model training and developed the back-end services and database.",
    stack: ["JavaScript", "MySQL", "PHP"],
  },
  {
    period: "2024 — 2025",
    role: "Back-End Developer",
    org: "Student",
    blurb:
      "Developed the back end for a cinema booking application supporting movie, showtime, seat, and payment selection. Designed the database schema and implemented the interaction logic behind the Java Swing UI.",
    stack: ["MySQL", "PHP", "JavaScript"],
  },
  {
    period: "2023 — 2024",
    role: "Front-End Developer",
    org: "Student",
    blurb:
      "Independently built a front-end ordering system for a fictional company as a Web Development course project, implementing the full interface and ordering flow.",
    stack: ["JavaScript", "HTML", "CSS"],
  },
  {
    period: "2023",
    role: "Web Developer",
    org: "Student",
    blurb:
      "First web project: a fan page for Kanon of Atarashii Gakko!, hand-coded in pure HTML and CSS.",
    stack: ["HTML", "CSS"],
  },
];

export default function Experience() {
  return (
    <section id="experience" data-nav="dark" className="bg-ink py-28 text-paper lg:py-40">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="mb-16 flex items-center gap-4">
          <span className="text-xs font-medium tabular-nums tracking-[0.3em] text-paper/40">
            02
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-paper/40">
            Non-Professional Experience
          </span>
        </Reveal>

        <div className="divide-y divide-paper/10 border-y border-paper/10">
          {ROLES.map((r, i) => (
            <Reveal
              key={r.role}
              delay={i * 80}
              className="group grid gap-4 py-9 transition-colors duration-300 hover:bg-paper/3 sm:grid-cols-12 sm:gap-8 sm:px-2"
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
