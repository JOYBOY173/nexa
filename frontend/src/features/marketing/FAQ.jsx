import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is Nexa?",
    a: "Nexa is an AI-powered personal productivity workspace designed to help you organize your work, prioritize what matters, execute plans, and understand your performance.",
  },
  {
    q: "How does Nexa's AI work?",
    a: "When you ask Nexa something, the app sends relevant workspace context to a secure backend, which talks to the configured OpenAI model and returns a structured response. Your API credentials never touch the browser.",
  },
  {
    q: "Can Nexa manage my tasks?",
    a: "Yes. This demo supports creating, completing, deleting, and filtering tasks, plus AI-assisted prioritization that you review and choose to apply.",
  },
  {
    q: "Does Nexa support teams?",
    a: "Team collaboration is part of the broader product concept, but it isn't implemented in this portfolio version — the demo is single-user.",
  },
  {
    q: "Is my data private?",
    a: "Workspace data is stored locally in your browser via localStorage, and AI requests are processed through the Nexa backend before reaching the AI provider. This is a demo project, not a security audit — treat it accordingly.",
  },
  {
    q: "Is there a free trial?",
    a: "The pricing shown is conceptual for this portfolio product. There's no real subscription system, billing, or trial to sign up for.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="border-y border-border bg-surface/60 py-20 sm:py-28">
      <div className="container-nexa max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Frequently asked questions.
        </h2>

        <div className="mt-10 divide-y divide-border border-t border-border">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-medium text-ink">{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-5 text-sm leading-relaxed text-muted"
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
