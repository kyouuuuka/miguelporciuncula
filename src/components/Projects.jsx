import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "./Reveal.jsx";

const PROJECTS = [
  {
    title: "Kanon Fan Page",
    tag: "First project",
    year: "2023",
    blurb:
      "A fan page for Kanon of Atarashii Gakko!, hand-coded from scratch in pure HTML and CSS.",
    stack: ["HTML", "CSS"],
    img: "",
  },
  {
    title: "Ordering System",
    tag: "Web Development",
    year: "2023 — 2024",
    blurb:
      "A front-end ordering system for a fictional company, built solo for a course project.",
    stack: ["JavaScript", "HTML", "CSS"],
    img: "",
  },
  {
    title: "Fingerprint Scanner",
    tag: "App Development",
    year: "2024",
    blurb:
      "An Arduino Uno scanner with an LCD that registers, removes, and detects fingerprints.",
    stack: ["Arduino", "C++"],
    img: "",
  },
  {
    title: "Cinema Booking",
    tag: "OOP",
    year: "2024 — 2025",
    blurb:
      "A cinema booking app with movie, seat, showtime, and payment selection. Owned the back end and database.",
    stack: ["MySQL", "PHP", "JavaScript"],
    img: "",
  },
  {
    title: "Skill-Match AI",
    tag: "AI & Back-End",
    year: "2025 — 2026",
    blurb:
      "An AI platform that pairs students with best-fit internship companies by analyzing their skills.",
    stack: ["JavaScript", "MySQL", "PHP"],
    img: "",
  },
  {
    title: "Gamified Science LMS",
    tag: "Thesis",
    year: "2026",
    blurb:
      "A gamified science LMS for Grade 7 students with interactive, Phaser-built lessons.",
    stack: ["React", "Node", "Phaser"],
    img: "",
  },
];

function Thumbnail({ project }) {
  if (project.img) {
    return (
      <img
        src={project.img}
        alt={project.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }
  // On-brand monochrome placeholder until a real screenshot is dropped in.
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-graphite via-ink to-charcoal">
      <span className="font-display text-5xl font-light text-paper/15">
        {project.title}
      </span>
    </div>
  );
}

export default function Projects() {
  const scroller = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  const scrollBy = (dir) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section id="projects" data-nav="dark" className="bg-charcoal py-28 text-paper lg:py-40">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="mb-16 flex items-center gap-4">
          <span className="text-xs font-medium tabular-nums tracking-[0.3em] text-paper/40">
            04
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-paper/40">
            Recent Projects
          </span>
        </Reveal>
      </div>

      <div className="group relative mx-auto max-w-6xl px-6 sm:px-16 lg:px-20">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          aria-label="Previous projects"
          className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-paper/15 bg-charcoal/80 text-paper/70 opacity-0 backdrop-blur-sm transition-all duration-200 hover:border-paper/40 hover:text-paper group-hover:opacity-100 group-focus-within:opacity-100 disabled:cursor-not-allowed disabled:!opacity-0 sm:flex lg:left-5"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          aria-label="Next projects"
          className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-paper/15 bg-charcoal/80 text-paper/70 opacity-0 backdrop-blur-sm transition-all duration-200 hover:border-paper/40 hover:text-paper group-hover:opacity-100 group-focus-within:opacity-100 disabled:cursor-not-allowed disabled:!opacity-0 sm:flex lg:right-5"
        >
          <span aria-hidden="true">→</span>
        </button>

        <div
          ref={scroller}
          onScroll={updateArrows}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
        >
          {PROJECTS.map((p) => (
            <article
              key={p.title}
              data-card
              className="group flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-paper/10 bg-ink/40 transition-colors duration-400 hover:border-paper/30 sm:w-[46%] lg:w-[31.5%]"
            >
              <div className="relative aspect-video overflow-hidden">
                <Thumbnail project={p} />
                <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-xs tabular-nums text-paper/80 backdrop-blur-sm">
                  {p.year}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <p className="text-xs uppercase tracking-[0.25em] text-paper/40">
                  {p.tag}
                </p>
                <h3 className="mt-2 font-display text-2xl font-light tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/60">
                  {p.blurb}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 pt-1">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-paper/15 px-2.5 py-1 text-[11px] text-paper/55"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
          {/* Trailing spacer so the last card can snap fully into view */}
          <div className="w-px shrink-0" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
