import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal.jsx";
import { PROJECTS } from "../data/projects.js";

const STATIC_MS = 420; // full-static burst between channels
const SETTLE_MS = 340; // picture wobble while the new channel locks in
const TURN_ON_MS = 950; // CRT power-on sweep (matches .crt-on duration)

const pad = (i) => String(i + 1).padStart(2, "0");

// Muted SMPTE-style bars for the "please stand by" card.
const BARS = ["#c8c8c8", "#c8c86a", "#6ac8c8", "#6ac86a", "#c86ac8", "#c86a6a", "#6a6ac8"];

// Fixed dust-mote field so renders stay deterministic.
const MOTES = [
  { l: "22%", t: "38%", d: 11, dl: 0, s: 2 },
  { l: "30%", t: "55%", d: 14, dl: 2.2, s: 1.5 },
  { l: "40%", t: "42%", d: 9, dl: 4.1, s: 2.5 },
  { l: "52%", t: "60%", d: 13, dl: 1.3, s: 1.5 },
  { l: "60%", t: "35%", d: 10, dl: 3.4, s: 2 },
  { l: "68%", t: "52%", d: 15, dl: 0.8, s: 1.5 },
  { l: "75%", t: "40%", d: 12, dl: 5.2, s: 2 },
  { l: "35%", t: "68%", d: 16, dl: 2.9, s: 1.5 },
  { l: "58%", t: "72%", d: 12, dl: 6.1, s: 2 },
];

const SPIDER_LEGS = [-50, -25, 5, 30, 150, 175, 205, 230];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// Analog white noise on a tiny canvas, scaled up so the pixels read as grain.
function StaticNoise({ run, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !run) return;
    const ctx = canvas.getContext("2d");
    const w = 144;
    const h = 108;
    canvas.width = w;
    canvas.height = h;
    const img = ctx.createImageData(w, h);
    const data = img.data;
    let raf = 0;
    let last = 0;
    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 55) return; // ~18fps is plenty for noise
      last = t;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 256) | 0;
        data[i] = data[i + 1] = data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  return <canvas ref={ref} aria-hidden="true" className={className} />;
}

function Placeholder({ project }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-graphite via-ink to-charcoal">
      <span className="font-display text-5xl font-light text-paper/15">
        {project.title}
      </span>
    </div>
  );
}

// Quarter cobweb anchored to a corner; spokes plus three sagging rings.
function Cobweb({ className = "" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={className}>
      <path d="M0 0L100 6M0 0L90 42M0 0L42 90M0 0L6 100" stroke="currentColor" strokeWidth="0.7" />
      <path d="M32 2Q28 13 22 22Q13 28 2 32" stroke="currentColor" strokeWidth="0.6" />
      <path d="M58 4Q50 24 40 40Q24 50 4 58" stroke="currentColor" strokeWidth="0.6" />
      <path d="M84 5Q72 34 56 56Q34 72 5 84" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

function Candle() {
  return (
    <div className="relative flex flex-col items-center">
      <span className="candle-glow room-anim absolute -top-12 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full" />
      <span className="candle-flame room-anim relative z-10 block h-7 w-3.5" />
      <span className="relative z-10 -mt-0.5 h-1.5 w-px bg-ink" />
      <span className="candle-wax relative z-10 h-11 w-5 rounded-b-md rounded-t-sm" />
    </div>
  );
}

export default function Projects() {
  const [channel, setChannel] = useState(0);
  const [power, setPower] = useState("off"); // off | warming | on
  const [phase, setPhase] = useState("idle"); // idle | static | settle
  const [knobTurns, setKnobTurns] = useState(0);
  const [redirect, setRedirect] = useState(null);
  const [roomLive, setRoomLive] = useState(false); // ambient anims only run in view
  const [spiderUp, setSpiderUp] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const reduced = usePrefersReducedMotion();

  const sectionRef = useRef(null);
  const tvRef = useRef(null);
  const pending = useRef(0); // target channel while static plays
  const spiderBusy = useRef(false);
  const touchX = useRef(null);
  const timers = useRef({});

  const setTimer = (key, fn, ms) => {
    window.clearTimeout(timers.current[key]);
    timers.current[key] = window.setTimeout(fn, ms);
  };

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(window.clearTimeout);
  }, []);

  // Power the set on the first time it scrolls into view.
  useEffect(() => {
    const node = tvRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setPower("on");
          return;
        }
        setPower("warming");
        setTimer("warm", () => setPower("on"), TURN_ON_MS);
      },
      { threshold: 0.3 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Pause the room's ambient loops whenever the section is off-screen.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setRoomLive(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Wall clock shows the visitor's actual time.
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(id);
  }, []);
  const hourDeg = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;
  const minuteDeg = now.getMinutes() * 6;

  const tuneTo = (target, dir) => {
    if (power === "off" || target === pending.current) return;
    setKnobTurns((t) => t + (dir ?? Math.sign(target - pending.current)));
    pending.current = target;
    if (reduced) {
      setChannel(target);
      return;
    }
    setPhase("static");
    setTimer(
      "static",
      () => {
        setChannel(pending.current);
        setPhase("settle");
        setTimer("settle", () => setPhase("idle"), SETTLE_MS);
      },
      STATIC_MS
    );
  };

  const step = (dir) =>
    tuneTo((pending.current + dir + PROJECTS.length) % PROJECTS.length, dir);

  const project = PROJECTS[channel];

  const openCurrent = () => {
    if (!project.link || redirect || power !== "on" || phase === "static") return;
    setRedirect(project);
    setTimer(
      "redirect",
      () => {
        window.open(project.link, "_blank", "noopener,noreferrer");
        setRedirect(null);
      },
      1100
    );
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      step(-1);
    }
  };

  const pokeSpider = () => {
    if (spiderBusy.current) return;
    spiderBusy.current = true;
    setSpiderUp(true);
    // The startled spider makes the picture blip.
    if (!reduced && power === "on" && phase === "idle") {
      setPhase("static");
      setTimer("blip", () => setPhase("idle"), 240);
    }
    setTimer("spiderUp", () => setSpiderUp(false), 1600);
    setTimer("spiderHome", () => {
      spiderBusy.current = false;
    }, 5200);
  };

  const Screen = project.link ? "a" : "div";
  const screenProps = project.link
    ? {
        href: project.link,
        "aria-label": `${project.title} — press to visit site`,
        onClick: (e) => {
          e.preventDefault();
          openCurrent();
        },
      }
    : {};

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-nav="dark"
      className={`relative overflow-hidden bg-charcoal py-28 text-paper lg:py-40 ${
        roomLive ? "room-live" : ""
      }`}
    >
      {/* The room: wall, floor, and ambient set dressing */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="room-wall absolute inset-x-0 bottom-[24%] top-0" />
        {/* Clean patch where a picture once hung */}
        <div className="absolute left-[6%] top-[42%] hidden h-28 w-20 -rotate-1 border border-paper/10 bg-paper/[0.04] lg:block">
          <span className="absolute -top-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-paper/25" />
        </div>
        {/* Baseboard seam, then floorboards */}
        <div className="absolute inset-x-0 bottom-[24%] h-1.5 bg-gradient-to-b from-white/[0.05] to-black/60" />
        <div className="room-floor absolute inset-x-0 bottom-0 h-[24%]" />
        <div className="room-vignette absolute inset-0" />

        {/* Curtain at the right edge */}
        <div className="room-curtain room-anim absolute right-0 top-0 hidden h-full w-14 lg:block xl:w-20" />

        {/* Cobwebs in the corners */}
        <Cobweb className="absolute left-0 top-0 h-36 w-36 text-paper/20 sm:h-44 sm:w-44" />
        <Cobweb className="absolute right-0 top-0 hidden h-24 w-24 -scale-x-100 text-paper/15 sm:block lg:right-14 xl:right-20" />

        {/* Dust motes drifting through the TV light */}
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="mote room-anim absolute rounded-full bg-paper/40"
            style={{
              left: m.l,
              top: m.t,
              width: m.s,
              height: m.s,
              animationDuration: `${m.d}s`,
              animationDelay: `${m.dl}s`,
            }}
          />
        ))}

        {/* Mobile-only candle on the floor (the table hides below sm) */}
        <div className="absolute bottom-8 left-4 scale-90 sm:hidden">
          <Candle />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="mb-16 flex items-center gap-4">
          <span className="text-xs font-medium tabular-nums tracking-[0.3em] text-paper/40">
            04
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-paper/40">
            Recent Projects
          </span>
        </Reveal>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        {/* Furniture around the set */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* Wall clock with swinging pendulum, set to local time */}
          <div className="absolute -left-28 top-10 hidden w-24 flex-col items-center xl:flex">
            <div className="relative h-20 w-20 rounded-full border-2 border-graphite bg-ink shadow-lg">
              <span className="absolute left-1/2 top-1 h-1 w-1 -translate-x-1/2 rounded-full bg-paper/30" />
              <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-paper/30" />
              <span className="absolute left-1 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-paper/30" />
              <span className="absolute right-1 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-paper/30" />
              <span
                className="absolute bottom-1/2 left-1/2 h-5 w-0.5 origin-bottom rounded-full bg-paper/70"
                style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
              />
              <span
                className="absolute bottom-1/2 left-1/2 h-7 w-px origin-bottom rounded-full bg-paper/50"
                style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
              />
              <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/60" />
            </div>
            <div className="relative -mt-1 h-24 w-9 overflow-hidden rounded-b-md border border-graphite bg-ink/80 shadow-inner">
              <span className="absolute left-1/2 top-0 -translate-x-1/2">
                <span className="pendulum room-anim block h-16 w-0.5 origin-top bg-paper/40">
                  <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-paper/40 bg-graphite" />
                </span>
              </span>
            </div>
          </div>

          {/* Crooked frames on the wall above the set */}
          <div className="absolute -top-4 left-[5%] hidden w-16 -rotate-2 border-4 border-graphite bg-ink p-1 shadow-lg md:block">
            <div className="relative h-16 w-full overflow-hidden bg-gradient-to-b from-graphite/70 to-ink">
              <span className="absolute left-1/2 top-3 h-5 w-5 -translate-x-1/2 rounded-full bg-paper/15" />
              <span className="absolute left-1/2 top-8 h-8 w-10 -translate-x-1/2 rounded-t-full bg-paper/10" />
            </div>
          </div>
          <div className="absolute right-[7%] top-1 hidden w-14 rotate-2 border-4 border-graphite bg-ink p-1 shadow-lg md:block">
            <div className="relative h-10 w-full overflow-hidden bg-gradient-to-b from-ink to-graphite/60">
              <span className="absolute right-2 top-1.5 h-3 w-3 rounded-full bg-paper/30" />
              <span className="absolute inset-x-0 bottom-2 h-px bg-paper/15" />
            </div>
          </div>

          {/* Shelf of old books */}
          <div className="absolute -right-32 top-24 hidden w-28 xl:block">
            <div className="flex items-end gap-1 px-2">
              <span className="h-10 w-2.5 rounded-[1px] border border-paper/10 bg-graphite" />
              <span className="h-12 w-3 rounded-[1px] border border-paper/10 bg-graphite/80" />
              <span className="h-9 w-2.5 rounded-[1px] border border-paper/10 bg-graphite" />
              <span className="h-11 w-3 origin-bottom-left rotate-[9deg] rounded-[1px] border border-paper/10 bg-graphite/70" />
            </div>
            <div className="room-wood h-2 rounded-sm" />
          </div>

          {/* Side table with the candle */}
          <div className="absolute -right-8 bottom-16 hidden flex-col items-center sm:flex xl:-right-32">
            <Candle />
            <div className="room-wood h-2.5 w-24 rounded-sm" />
            <div className="flex w-20 justify-between">
              <span className="room-wood h-14 w-1.5 rounded-b-sm" />
              <span className="room-wood h-14 w-1.5 rounded-b-sm" />
            </div>
          </div>
        </div>

        <Reveal>
          <div
            ref={tvRef}
            role="region"
            tabIndex={0}
            aria-label="Projects television. Use the arrow keys to change channels."
            onKeyDown={onKeyDown}
            className="relative rounded-3xl outline-none focus-visible:ring-1 focus-visible:ring-paper/40"
          >
            {/* Rug + screen-light pool on the floor (painted under the set) */}
            <div aria-hidden="true" className="room-rug absolute -bottom-8 left-1/2 h-16 w-[110%] -translate-x-1/2" />
            <div
              aria-hidden="true"
              className={`tv-glow-pool room-anim absolute -bottom-6 left-1/2 h-20 w-[80%] -translate-x-1/2 ${
                power !== "off" && phase === "static" ? "tv-glow-burst" : ""
              } ${power === "off" ? "opacity-0" : ""}`}
            />

            {/* Antenna */}
            <div aria-hidden="true" className="relative mx-auto h-16 w-44 sm:h-20">
              <span className="absolute bottom-0 left-1/2 h-20 w-[3px] origin-bottom -translate-x-1/2 -rotate-[26deg] rounded-full bg-gradient-to-t from-paper/40 to-paper/10 sm:h-24" />
              <span className="absolute bottom-0 left-1/2 h-16 w-[3px] origin-bottom -translate-x-1/2 rotate-[20deg] rounded-full bg-gradient-to-t from-paper/40 to-paper/10 sm:h-20" />
              <span className="absolute bottom-0 left-1/2 h-3.5 w-8 -translate-x-1/2 rounded-t-md bg-graphite" />
            </div>

            {/* Cabinet */}
            <div className="tv-wood relative z-10 rounded-[1.75rem] p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                {/* Screen bezel */}
                <div className="tv-bezel flex-1 rounded-2xl p-2.5 sm:p-3.5">
                  <Screen
                    {...screenProps}
                    onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
                    onTouchEnd={(e) => {
                      if (touchX.current == null) return;
                      const dx = e.changedTouches[0].clientX - touchX.current;
                      touchX.current = null;
                      if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
                    }}
                    className="tv-screen relative block aspect-video select-none overflow-hidden bg-black"
                  >
                    {/* Picture (flicker on the shell, tune-in wobble on the frame) */}
                    <div
                      className={`absolute inset-0 ${
                        power === "off" ? "opacity-0" : ""
                      } ${power === "warming" ? "crt-on" : ""} ${
                        power === "on" && !reduced ? "crt-flicker" : ""
                      }`}
                    >
                      <div
                        key={channel}
                        className={`tv-picture-in absolute inset-0 ${
                          phase === "settle" ? "crt-settle" : ""
                        }`}
                      >
                        {project.img ? (
                          <img
                            src={project.img}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Placeholder project={project} />
                        )}

                        {/* Broadcast OSD: project info over the picture */}
                        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4 pt-12 sm:p-6 sm:pt-14">
                          <p className="osd text-[9px] uppercase sm:text-[11px]">
                            {project.tag} · {project.year}
                          </p>
                          <h3 className="crt-rgb mt-1 font-display text-xl font-light tracking-tight text-paper sm:text-3xl">
                            {project.title}
                          </h3>
                          <p className="mt-1.5 hidden max-w-md text-xs leading-relaxed text-paper/75 sm:block">
                            {project.blurb}
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {project.stack.map((s) => (
                              <span
                                key={s}
                                className="rounded-sm border border-[#86f79b]/35 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#86f79b]/80 sm:text-[10px]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                          {project.link && (
                            <span className="osd absolute bottom-3 right-4 text-[8px] sm:text-[10px]">
                              ▶ PRESS TO VISIT
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Analog static: whisper at idle, full burst between channels */}
                    {!reduced && (
                      <StaticNoise
                        run={power !== "off"}
                        className={`absolute inset-0 z-20 h-full w-full [image-rendering:pixelated] transition-opacity duration-150 ${
                          phase === "static"
                            ? "tv-static-burst opacity-100"
                            : power === "warming"
                              ? "opacity-20"
                              : "opacity-[0.06]"
                        }`}
                      />
                    )}

                    {/* Channel number OSD (flashes on change, above the static) */}
                    {power !== "off" && (
                      <span
                        key={`${channel}-${power}`}
                        className="osd osd-flash pointer-events-none absolute right-[5%] top-[7%] z-30 text-sm sm:text-lg"
                      >
                        CH {pad(channel)}
                      </span>
                    )}

                    {/* Glass: scanlines, curvature glare, vignette */}
                    <span aria-hidden="true" className="crt-scanlines pointer-events-none absolute inset-0 z-40" />
                    <span aria-hidden="true" className="crt-glass pointer-events-none absolute inset-0 z-40" />
                  </Screen>
                </div>

                {/* Control panel */}
                <div className="flex items-center justify-center gap-6 sm:w-24 sm:flex-col sm:gap-5 md:w-28">
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next channel"
                      className="tv-knob relative h-14 w-14 rounded-full outline-none focus-visible:ring-1 focus-visible:ring-paper/50 md:h-16 md:w-16"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 transition-transform duration-300"
                        style={{ transform: `rotate(${knobTurns * 36}deg)` }}
                      >
                        <span className="absolute left-1/2 top-1 h-4 w-0.5 -translate-x-1/2 rounded-full bg-paper/70" />
                      </span>
                    </button>
                    <span className="font-mono text-[8px] tracking-[0.25em] text-paper/35">
                      CHANNEL
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <div aria-hidden="true" className="tv-knob relative h-9 w-9 rounded-full">
                      <span className="absolute left-1/2 top-1 h-2.5 w-0.5 -translate-x-1/2 rounded-full bg-paper/50" />
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.25em] text-paper/35">
                      VOLUME
                    </span>
                  </div>

                  <div className="flex gap-2 sm:flex-col">
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next channel"
                      className="rounded border border-paper/15 px-2 py-1 font-mono text-[10px] text-paper/60 transition-colors hover:border-paper/40 hover:text-paper"
                    >
                      CH ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous channel"
                      className="rounded border border-paper/15 px-2 py-1 font-mono text-[10px] text-paper/60 transition-colors hover:border-paper/40 hover:text-paper"
                    >
                      CH ▼
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                        power === "off"
                          ? "bg-paper/15"
                          : "bg-[#8dffb0] shadow-[0_0_8px_#8dffb0]"
                      }`}
                    />
                    <span className="font-mono text-[8px] tracking-[0.25em] text-paper/35">
                      PWR
                    </span>
                  </div>
                </div>
              </div>

              {/* Speaker grille + model plate */}
              <div className="mt-4 flex items-center gap-4 sm:mt-5">
                <div className="tv-grille h-9 flex-1 rounded-md sm:h-10" />
                <span className="font-mono text-[9px] tracking-[0.3em] text-paper/30">
                  MP·26
                </span>
              </div>
            </div>

            {/* Legs */}
            <div aria-hidden="true" className="relative flex justify-between px-12 sm:px-20">
              <span className="tv-wood h-14 w-3 origin-top -rotate-6 rounded-b-md sm:h-16" />
              <span className="tv-wood h-14 w-3 origin-top rotate-6 rounded-b-md sm:h-16" />
            </div>
          </div>

          {/* Channel guide */}
          <div className="relative mt-8 flex flex-wrap justify-center gap-2">
            {PROJECTS.map((p, i) => (
              <button
                key={p.title}
                type="button"
                onClick={() => tuneTo(i)}
                aria-label={`Channel ${pad(i)}: ${p.title}`}
                aria-current={i === channel || undefined}
                className={`rounded-md border px-2.5 py-1.5 font-mono text-[11px] tabular-nums transition-colors ${
                  i === channel
                    ? "border-paper/60 bg-paper/10 text-paper"
                    : "border-paper/15 text-paper/45 hover:border-paper/40 hover:text-paper/80"
                }`}
              >
                {pad(i)}
              </button>
            ))}
          </div>
        </Reveal>

        {power !== "off" && (
          <p className="sr-only" aria-live="polite">
            {`Channel ${pad(channel)}: ${project.title}`}
          </p>
        )}
      </div>

      {/* The spider, hanging from the corner web */}
      <div className="pointer-events-none absolute left-12 top-0 z-20 sm:left-20">
        <span
          aria-hidden="true"
          className={`spider-thread mx-auto block h-24 w-px origin-top bg-paper/25 ${
            spiderUp ? "spider-thread-up" : ""
          }`}
        />
        <button
          type="button"
          onClick={pokeSpider}
          aria-label="A little spider is hanging here — poke it"
          className={`spider-rig pointer-events-auto -mt-1 block rounded-full outline-none focus-visible:ring-1 focus-visible:ring-paper/50 ${
            spiderUp ? "spider-rig-up" : ""
          }`}
        >
          <span className="spider-bob room-anim relative block h-5 w-5 cursor-pointer">
            {SPIDER_LEGS.map((deg) => (
              <span
                key={deg}
                className="absolute left-1/2 top-2 h-px w-2.5 origin-left rounded-full bg-paper/40"
                style={{ transform: `rotate(${deg}deg)` }}
              />
            ))}
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-black ring-1 ring-paper/25" />
            <span className="absolute left-1/2 top-1.5 h-3 w-2.5 -translate-x-1/2 rounded-full bg-black ring-1 ring-paper/25" />
          </span>
        </button>
      </div>

      {redirect && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 px-6 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-paper/15 bg-black px-8 py-10 text-center sm:px-10 sm:py-12">
            <span aria-hidden="true" className="crt-scanlines pointer-events-none absolute inset-0" />
            <p className="osd text-[11px] tracking-[0.5em]">
              <span className="standby-blink mr-2 inline-block h-2 w-2 rounded-full bg-red-500 align-middle" />
              PLEASE STAND BY
            </p>
            <p className="mt-5 font-display text-2xl font-light tracking-tight text-paper">
              Tuning in to {redirect.title}…
            </p>
            <p className="mt-2 font-mono text-xs tracking-widest text-paper/50">
              {new URL(redirect.link).hostname}
            </p>
            <div aria-hidden="true" className="mt-8 flex h-6 overflow-hidden rounded-sm opacity-60">
              {BARS.map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
