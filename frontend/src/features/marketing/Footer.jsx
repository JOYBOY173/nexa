import { Linkedin, Github } from "lucide-react";
import Logo from "./Logo.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-canvas py-14">
      <div className="container-nexa grid gap-10 sm:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">
            Your personal organizer &amp; performance AI.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-faint">Product</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-muted">
            <li><a href="#features" className="hover:text-ink">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-ink">How it works</a></li>
            <li><a href="#pricing" className="hover:text-ink">Pricing</a></li>
            <li><a href="#faq" className="hover:text-ink">FAQ</a></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-faint">Company</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-muted">
            <li><a href="#" className="hover:text-ink">About</a></li>
            <li><a href="#" className="hover:text-ink">Contact</a></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-faint">Social</p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="LinkedIn" className="rounded-sm p-2 text-muted hover:bg-ink/[0.05] hover:text-ink">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" aria-label="GitHub" className="rounded-sm p-2 text-muted hover:bg-ink/[0.05] hover:text-ink">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="container-nexa mt-10 border-t border-border pt-6">
        <p className="text-xs text-faint">
          © 2026 Nexa. Product concept &amp; portfolio project by Joshua Olushina.
        </p>
      </div>
    </footer>
  );
}
