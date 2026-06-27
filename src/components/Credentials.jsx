import Reveal from "./Reveal.jsx";

const CERTS = [
  {
    title: "Meta Front-End Developer",
    issuer: "Meta · Coursera",
    year: "2024",
  },
  {
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    year: "2023",
  },
  {
    title: "JavaScript Algorithms & Data Structures",
    issuer: "freeCodeCamp",
    year: "2023",
  },
  {
    title: "UI/UX Design Fundamentals",
    issuer: "Google · Coursera",
    year: "2022",
  },
];

export default function Credentials() {
  return (
    <section id="credentials" className="bg-paper py-28 lg:py-40">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="mb-16 flex items-center gap-4">
          <span className="text-xs font-medium tabular-nums tracking-[0.3em] text-ink/40">
            05
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-ink/40">
            Credentials
          </span>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl">
              Certifications &amp; ongoing study
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/60">
              I treat learning as part of the craft — here’s a sample of the
              formal work behind the practice.
            </p>
          </Reveal>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {CERTS.map((c, i) => (
                <Reveal
                  as="li"
                  key={c.title}
                  delay={i * 70}
                  className="group flex items-center justify-between gap-6 py-6 transition-colors duration-300 hover:bg-ink/[0.02]"
                >
                  <div>
                    <h3 className="text-lg font-medium text-ink">{c.title}</h3>
                    <p className="mt-1 text-sm text-ink/50">{c.issuer}</p>
                  </div>
                  <span className="text-sm tabular-nums text-ink/40">
                    {c.year}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
