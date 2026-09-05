import { useState } from "react";
import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import ScenarioSwitcher from "./ScenarioSwitcher.jsx";
import ConfirmResetDialog from "./ConfirmResetDialog.jsx";
import Logo from "../marketing/Logo.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";

export default function WorkspaceHeader() {
  const { resetWorkspace } = useWorkspace();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-6 lg:px-8">
      <Link to="/" className="lg:hidden">
        <Logo />
      </Link>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <ScenarioSwitcher />
        <button
          onClick={() => setConfirmOpen(true)}
          aria-label="Reset demo workspace"
          title="Reset demo workspace"
          className="inline-flex rounded-sm p-2 text-muted hover:bg-ink/[0.05] hover:text-ink lg:hidden"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      <ConfirmResetDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          resetWorkspace();
          setConfirmOpen(false);
        }}
      />
    </header>
  );
}
