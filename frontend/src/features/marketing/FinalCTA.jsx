import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";

export default function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section className="container-nexa py-20 text-center sm:py-28">
      <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Make your work work for you.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Less time figuring out what to do. More time actually doing it.
      </p>
      <Button size="lg" className="mt-8" onClick={() => navigate("/app")}>
        Try Nexa
      </Button>
      <p className="mt-6 text-xs text-faint">Product concept &amp; portfolio project by Joshua Olushina.</p>
    </section>
  );
}
