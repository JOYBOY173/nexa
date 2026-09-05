import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import Logo from "./Logo.jsx";

const LINKS = [
  { href: "#product", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus management + trap for the mobile drawer, since it's marked
  // aria-modal and needs to behave like one for keyboard/screen-reader users.
  useEffect(() => {
    if (!open) return;

    const drawerNode = drawerRef.current;
    const focusable = drawerNode?.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [open]);

  function handleAnchorClick(e, href) {
    e.preventDefault();
    setOpen(false);
    navigate(`/${href}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-canvas/90 backdrop-blur-sm">
      <nav className="container-nexa flex h-16 items-center justify-between" aria-label="Primary">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <button className="text-sm font-medium text-muted hover:text-ink" title="Visual only — no authentication in this demo">
            Sign in
          </button>
          <Button onClick={() => navigate("/app")} size="md">
            Try Nexa
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          className="rounded-sm p-2 text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-ink/40 animate-fade-in" onClick={() => setOpen(false)} aria-hidden="true" />
            <div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="absolute right-0 top-0 h-full w-[82%] max-w-xs bg-surface shadow-raised animate-slide-in-right flex flex-col"
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-5">
                <Logo />
                <button
                  className="rounded-sm p-2 text-ink"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <ul className="flex flex-1 flex-col gap-1 px-3 py-4">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="block rounded-sm px-3 py-3 text-base text-ink hover:bg-ink/[0.04]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 border-t border-border p-4">
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Sign in
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                    navigate("/app");
                  }}
                >
                  Try Nexa
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
