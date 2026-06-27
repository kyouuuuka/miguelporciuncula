import Reveal from "./Reveal.jsx";

export default function Credentials() {
  return (
    <section id="credentials" data-nav="light" className="bg-paper py-28 lg:py-40">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="mb-16 flex items-center gap-4">
          <span className="text-xs font-medium tabular-nums tracking-[0.3em] text-ink/40">
            05
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-ink/40">
            Credentials
          </span>
        </Reveal>

        <Reveal className="flex flex-col items-start gap-6 rounded-2xl border border-dashed border-ink/15 px-8 py-20 text-center sm:items-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-ink/40">
            Coming soon
          </span>
          <h2 className="font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl">
            Certifications on the way
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-ink/60">
            I&apos;m gathering my certificates — this section will be updated
            soon.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
