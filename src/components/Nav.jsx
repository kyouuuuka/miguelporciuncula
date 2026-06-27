import { useEffect, useState } from "react";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "toolkit", label: "Toolkit" },
  { id: "projects", label: "Projects" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  // Transparent over the hero; becomes a solid bar once scrolled...
  const [scrolled, setScrolled] = useState(false);
  // ...except at the very end (Contact + Footer), where it goes back to the
  // hero look: transparent with light text.
  const [atEnd, setAtEnd] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const NAV_PROBE = 32; // px from top — the nav's vertical centre
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const contact = document.getElementById("contact");
      setAtEnd(contact ? contact.getBoundingClientRect().top <= NAV_PROBE : false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Solid bar only when scrolled AND not in the dark end zone.
  const solid = scrolled && !atEnd;

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-paper border-b border-ink/10 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
        <a
          href="#top"
          aria-label="Miguel Porciuncula — home"
          className={`group relative z-50 leading-none transition-colors duration-300 ${
            open || solid ? "text-ink" : "text-paper"
          }`}
        >
          <span className="font-logo text-2xl font-semibold tracking-[0.15em]">
            MP
          </span>
        </a>

        {/* Desktop links */}
        <ul
          className={`hidden items-center gap-7 transition-colors duration-300 md:flex ${
            solid ? "text-ink" : "text-paper"
          }`}
        >
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className="group relative inline-flex items-baseline text-sm font-medium"
              >
                <span className="opacity-80 transition-opacity group-hover:opacity-100">
                  {l.label}
                </span>
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={`relative z-50 flex h-11 w-11 items-center justify-center transition-colors duration-300 md:hidden ${
            open || solid ? "text-ink" : "text-paper"
          }`}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                open ? "w-6 translate-y-1.75 rotate-45" : "w-6"
              }`}
            />
            <span
              className={`block h-px w-4 bg-current transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                open ? "w-6 -translate-y-1.75 -rotate-45" : "w-5"
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-0 z-40 bg-paper transition-all duration-500 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="flex h-full flex-col justify-center gap-2 px-8 text-ink">
          {LINKS.map((l) => (
            <li key={l.id} className="border-b border-ink/10">
              <a
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="block py-5"
              >
                <span className="font-display text-3xl">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
