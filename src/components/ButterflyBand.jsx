import Reveal from "./Reveal.jsx";

// Quiet editorial band built around butterfly.jpg (soft gray triptych).
export default function ButterflyBand() {
  return (
    <section className="grain relative overflow-hidden bg-ash text-ink">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-32">
        <Reveal>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-ink/50">
            Philosophy
          </p>
          <blockquote className="font-display text-3xl font-light leading-snug tracking-tight sm:text-4xl lg:text-[2.75rem]">
            “Good design is mostly subtraction — keep removing until only the
            essential remains, then let it breathe.”
          </blockquote>
          <p className="mt-8 text-sm leading-relaxed text-ink/60">
            Like these studies in motion: blur away the noise and the shape that
            matters is still unmistakable. That’s the standard I hold every
            interface to.
          </p>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="overflow-hidden rounded-2xl border border-ink/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
            <img
              src="/butterfly.jpg"
              alt="A triptych of blurred butterfly studies in soft grayscale."
              width="1078"
              height="426"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="mt-3 block text-right text-[10px] uppercase tracking-[0.3em] text-ink/40">
            Studies in motion — Fig. 01
          </span>
        </Reveal>
      </div>
    </section>
  );
}
