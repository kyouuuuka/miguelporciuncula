import { useEffect, useState } from "react";

// Floating back-to-top button. Pops in on the bottom-right once you've scrolled
// past the hero; click to glide back to the top.
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`group fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-paper/25 bg-ink/70 text-paper shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-ink ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="text-lg transition-transform duration-300 group-hover:-translate-y-0.5">
        ↑
      </span>
    </button>
  );
}
