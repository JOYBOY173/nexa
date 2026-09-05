import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "",
    features: ["Personal workspace", "Task management", "Basic AI", "Daily planning", "Basic insights"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    features: ["Advanced AI workflows", "Unlimited task planning", "Advanced insights", "Priority AI assistance"],
    highlighted: true,
  },
  {
    name: "Team",
    price: "$39",
    period: "/user/month",
    features: ["Shared workspaces", "Team insights", "Collaborative planning", "Admin controls"],
    highlighted: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="container-nexa py-20 sm:py-28">
      <div className="max-w-lg">
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Simple, conceptual pricing.
        </h2>
        <p className="mt-4 text-muted">
          This pricing illustrates the product concept. No billing or subscription system is
          implemented in this portfolio demo.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-md border p-6 ${
              plan.highlighted ? "border-current shadow-card" : "border-border"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-3 inline-block w-fit rounded-sm bg-current-light px-2 py-0.5 text-xs font-medium text-current-dark">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-ink">{plan.price}</span>
              <span className="text-sm text-muted">{plan.period}</span>
            </p>
            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-current" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="mt-8 w-full"
              variant={plan.highlighted ? "primary" : "secondary"}
              onClick={() => navigate("/app")}
            >
              Try Nexa
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
