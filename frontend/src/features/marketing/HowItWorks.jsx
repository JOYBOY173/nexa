const STAGES = [
  {
    number: "01",
    title: "Capture",
    description: "Get tasks, notes, ideas, and work out of your head and into Nexa.",
  },
  {
    number: "02",
    title: "Ask Nexa",
    description: "Let Nexa analyze what's on your plate and help determine what matters most.",
  },
  {
    number: "03",
    title: "Get things done",
    description: "Turn that clarity into a focused plan and follow it through.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container-nexa py-20 sm:py-28">
      <div className="max-w-lg">
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          From scattered thoughts to clear action.
        </h2>
      </div>

      <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
        {STAGES.map((stage, index) => (
          <div key={stage.number} className="relative">
            <span className="text-sm font-semibold text-current">{stage.number}</span>
            <h3 className="mt-3 text-xl font-semibold text-ink">{stage.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{stage.description}</p>
            {index < STAGES.length - 1 && (
              <div
                className="absolute right-[-24px] top-2 hidden h-px w-12 bg-border sm:block"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
