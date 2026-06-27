import { useEffect, useRef } from "react";

// Subtle mouse parallax for the name only. Smoothed with rAF + lerp so it
// glides (and keeps drifting briefly after the cursor stops) instead of
// snapping. Respects prefers-reduced-motion.
const NAME_SHIFT = 12; // max horizontal travel in px (vertical is gentler)

function useNameParallax() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e) => {
      // -1..1 around the viewport centre
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      smooth.x += (target.x - smooth.x) * 0.06;
      smooth.y += (target.y - smooth.y) * 0.06;
      const dx = (smooth.x * NAME_SHIFT).toFixed(2);
      const dy = (smooth.y * NAME_SHIFT * 0.6).toFixed(2);
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return ref;
}

export default function Hero() {
  const nameRef = useNameParallax();
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-ink text-paper"
    >
      {/* Background photo: cateyesreal2.png */}
      <img
        src="/cateyesreal2.png"
        alt=""
        aria-hidden="true"
        width="1536"
        height="1024"
        className="absolute inset-0 h-full w-full object-cover object-right opacity-80"
      />
      {/* Drifting clouds — two soft layers sliding in opposite directions at
          different speeds, so the motion is clearly readable while opacity
          stays gentle. Below the scrims + text so readability is untouched.
          Disabled under prefers-reduced-motion (see index.css). */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="hero-fog absolute -inset-x-[30%] inset-y-0"
          style={{
            background:
              "radial-gradient(50% 45% at 28% 30%, rgba(245,244,241,0.12), transparent 68%)," +
              "radial-gradient(42% 34% at 70% 22%, rgba(245,244,241,0.09), transparent 70%)," +
              "radial-gradient(60% 48% at 48% 14%, rgba(245,244,241,0.06), transparent 74%)",
          }}
        />
        <div
          className="hero-fog-2 absolute -inset-x-[30%] inset-y-0"
          style={{
            background:
              "radial-gradient(46% 40% at 60% 26%, rgba(245,244,241,0.08), transparent 70%)," +
              "radial-gradient(38% 32% at 18% 18%, rgba(245,244,241,0.06), transparent 72%)",
          }}
        />
      </div>

      {/* Tonal scrims to keep text readable over the photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-32 lg:px-10">
        <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-paper/60">
          <span className="h-px w-10 bg-paper/40" />
          Full Stack Developer
        </p>

        {/* Only the name + intro paragraph get the subtle mouse parallax */}
        <div ref={nameRef} style={{ willChange: "transform" }}>
          <h1 className="font-display text-[15vw] font-light leading-[0.82] tracking-tight sm:text-[12vw] lg:text-[9rem]">
            <span className="block">Miguel</span>
            <span className="block italic text-paper/90">Porciuncula</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-paper/70 sm:text-lg">
            I build clean, considered interfaces — products that stay quiet,
            move with intent, and leave the work doing the talking.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="group inline-flex items-center gap-3 rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-ink transition-transform duration-300 hover:scale-[1.02] active:scale-95"
          >
            View Work
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 rounded-full border border-paper/30 px-7 py-3.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-paper/10"
          >
            Get in Touch
          </a>
        </div>

        <div className="mt-16 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-paper/50">
          <span className="scroll-cue inline-block">↓</span>
          Scroll
        </div>
      </div>
    </section>
  );
}
