import Reveal from "./Reveal.jsx";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-ink py-28 text-paper lg:py-44"
    >
      {/* faint cateyes echo for continuity with the hero */}
      <img
        src="/cateyesreal2.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.18]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="mb-12 flex items-center gap-4">
          <span className="text-xs font-medium tabular-nums tracking-[0.3em] text-paper/40">
            06
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-paper/40">
            Get in Touch
          </span>
        </Reveal>

        <Reveal>
          <h2 className="max-w-4xl font-display text-[12vw] font-light leading-[0.9] tracking-tight sm:text-6xl lg:text-8xl">
            Let’s make something
            <span className="italic text-paper/80"> quietly good.</span>
          </h2>
        </Reveal>

        <Reveal delay={120} className="mt-10 max-w-xl text-base leading-relaxed text-paper/60">
          <p>
            Have a project, a role, or just an idea worth talking through? I’m
            open to freelance work and full-time roles.
          </p>
        </Reveal>

        <Reveal delay={160} className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="mailto:migoyporciuncula@gmail.com"
            className="group inline-flex items-center gap-3 rounded-full bg-paper px-8 py-4 text-sm font-medium text-ink transition-transform duration-300 hover:scale-[1.02] active:scale-95"
          >
            migoyporciuncula@gmail.com
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </Reveal>

        <Reveal delay={200} className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {[
            { label: "GitHub", href: "https://github.com/" },
            { label: "LinkedIn", href: "https://www.linkedin.com/" },
            { label: "Twitter / X", href: "https://x.com/" },
            { label: "Read.cv", href: "https://read.cv/" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center text-paper/60 transition-colors hover:text-paper"
            >
              {s.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
