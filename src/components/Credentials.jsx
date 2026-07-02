import Reveal from "./Reveal.jsx";
import { CREDENTIALS } from "../data/credentials.js";

// Small deck of tilts so the cards sit scattered; hover snaps a card straight.
const TILTS = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];

function CredentialCard({ credential: c, index }) {
  const tilt = TILTS[index % TILTS.length];
  return (
    <a
      href={c.link}
      target="_blank"
      rel="noreferrer"
      className={`ruled group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border border-ink/8 px-6 py-8 text-center shadow-[0_1px_1px_rgba(10,10,11,0.05),0_2px_4px_rgba(10,10,11,0.04),0_12px_30px_-14px_rgba(10,10,11,0.28)] transition-all duration-300 ${tilt} hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_2px_4px_rgba(10,10,11,0.06),0_20px_48px_-16px_rgba(10,10,11,0.36)]`}
    >
      <img
        src={c.img}
        alt={c.title}
        loading="lazy"
        className="h-14 w-14 object-contain"
      />

      <div className="flex flex-col items-center gap-1.5">
        <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-ink">
          {c.title}
        </h3>
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink/35">
          {c.issuer}
        </p>
      </div>

      <span className="mt-1 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-ink/40 transition-colors duration-300 group-hover:text-ink">
        <span aria-hidden="true" className="text-ink/25 transition-colors duration-300 group-hover:text-ink/50">
          &lsaquo;
        </span>
        Verify
        <span aria-hidden="true" className="text-ink/25 transition-colors duration-300 group-hover:text-ink/50">
          &rsaquo;
        </span>
      </span>
    </a>
  );
}

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

        <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CREDENTIALS.map((c, i) => (
            <CredentialCard key={c.title} credential={c} index={i} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
