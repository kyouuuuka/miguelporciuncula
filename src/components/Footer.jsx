export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <div className="flex flex-col leading-none">
          <span className="font-display text-base text-paper">
            Miguel Porciuncula
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-paper/40">
            Developer · Portfolio 2026
          </span>
        </div>

        <p className="text-xs text-paper/40">
          © {year} — Built with React, Vite &amp; Tailwind. Crafted in monochrome.
        </p>

        <a
          href="#top"
          className="group inline-flex items-center gap-2 self-start text-xs uppercase tracking-[0.2em] text-paper/60 transition-colors hover:text-paper sm:self-auto"
        >
          Back to top
          <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
            ↑
          </span>
        </a>
      </div>
    </footer>
  );
}
