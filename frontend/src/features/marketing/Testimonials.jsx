const TESTIMONIALS = [
  {
    persona: "Independent Freelancer",
    quote:
      "I used to lose track of client follow-ups in three different apps. Now everything sits in one place, and Nexa nudges me toward what's actually urgent.",
  },
  {
    persona: "Software Developer",
    quote:
      "Turning a messy standup note into three real tasks takes seconds now instead of me forgetting half of it by lunch.",
  },
  {
    persona: "Startup Founder",
    quote:
      "The day plan feature keeps me from spending my sharpest hours on email. It's a small shift that adds up fast.",
  },
];

export default function Testimonials() {
  return (
    <section className="border-y border-border bg-surface/60 py-20 sm:py-28">
      <div className="container-nexa">
        <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Designed around real working habits.
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.persona} className="rounded-md border border-border bg-canvas p-6">
              <p className="text-sm leading-relaxed text-ink">"{t.quote}"</p>
              <p className="mt-4 text-xs font-medium text-faint">{t.persona} — fictional persona, demo content</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
