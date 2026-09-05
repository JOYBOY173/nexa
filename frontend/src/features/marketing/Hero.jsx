import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import HeroPreview from "./HeroPreview.jsx";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="container-nexa grid gap-12 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pb-28 lg:pt-24">
      <div className="animate-fade-up">
        <p className="mb-5 text-sm font-medium text-current-dark">Your personal AI workspace</p>
        <h1 className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Get organized. Perform at your best.
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
          Nexa brings your tasks, plans, notes, and priorities together — then helps you figure out
          what deserves your attention next.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => navigate("/app")}>
            Try Nexa
          </Button>
          <Button size="lg" variant="secondary" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
            See how it works
          </Button>
        </div>

        <p className="mt-8 text-sm text-faint">
          Organize · Prioritize · Execute · Perform
        </p>
      </div>

      <div className="animate-fade-up [animation-delay:120ms]">
        <HeroPreview />
      </div>
    </section>
  );
}
