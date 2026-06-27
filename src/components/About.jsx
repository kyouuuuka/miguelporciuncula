import Reveal from "./Reveal.jsx";

export default function About() {
  return (
    <section id="about" data-nav="light" className="relative bg-paper py-28 lg:py-40">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="mb-14 flex items-center gap-4">
          <span className="text-xs font-medium tabular-nums tracking-[0.3em] text-ink/40">
            01
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-ink/40">
            About
          </span>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <h2 className="font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-[3.25rem]">
              I'm a full-stack developer specializing in back-end development, dedicated to building reliable systems that put user-friendliness at the heart of everything I create.
            </h2>
          </Reveal>

          <Reveal className="space-y-6 text-base leading-relaxed text-ink/70 text-justify lg:col-span-4" delay={120}>
            <p>
              I work across the full stack, turning rough ideas into products
              that feel calm and intentional. My focus is clarity: solid
              foundations, clean structure, and systems that quietly do their
              job so the experience never has to fight for itself.
            </p>
            <p>
            When I’m not shipping, I’m usually buried in photography and
              design which is probably where the monochrome obsession leaks
              in from.
            </p>
          </Reveal>
        </div>

        {/* Quick stats */}
        <Reveal className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-4" delay={80}>
          {[
            { k: "4th year", v: "Student" },
            { k: "Bulacan", v: "Location" },
             { k: "5+", v: "Projects shipped" },
            { k: "Web · AI", v: "Focus" },
          ].map((s) => (
            <div key={s.v} className="bg-paper px-6 py-8">
              <div className="font-display text-4xl font-light">{s.k}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-ink/50">
                {s.v}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
