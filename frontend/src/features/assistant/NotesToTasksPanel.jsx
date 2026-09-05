import { useState } from "react";
import { NotebookPen, Check, CheckCircle2 } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { useAI } from "../../hooks/useAI.js";
import { turnNotesIntoTasks } from "../../api/nexaApi.js";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import { TextArea } from "../../components/ui/Field.jsx";
import { ThinkingDots } from "../../components/ui/Spinner.jsx";
import { PriorityBadge } from "../../components/ui/Badge.jsx";
import { formatDueDate } from "../../lib/dateUtils.js";

const MAX_NOTES_LENGTH = 2000;

export default function NotesToTasksPanel() {
  const { addTasks } = useWorkspace();
  const { isLoading, status, error, run, reset } = useAI();
  const [notes, setNotes] = useState("");
  const [drafts, setDrafts] = useState(null);
  const [selected, setSelected] = useState({});
  const [added, setAdded] = useState(false);

  async function handleConvert() {
    if (!notes.trim()) return;
    reset();
    setAdded(false);
    setDrafts(null);
    const result = await run(() => turnNotesIntoTasks({ notes: notes.trim().slice(0, MAX_NOTES_LENGTH) }));
    if (result) {
      setDrafts(result);
      setSelected(Object.fromEntries(result.map((_, i) => [i, true])));
    }
  }

  function toggleSelected(index) {
    setSelected((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  function handleAdd() {
    if (!drafts) return;
    const chosen = drafts.filter((_, i) => selected[i]);
    if (chosen.length === 0) return;
    addTasks(chosen);
    setAdded(true);
  }

  const selectedCount = drafts ? drafts.filter((_, i) => selected[i]).length : 0;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink">Turn Notes Into Tasks</h2>
        <p className="mt-1 text-sm text-muted">Paste messy notes and Nexa will pull out structured tasks.</p>
        <TextArea
          className="mt-4 min-h-[120px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={MAX_NOTES_LENGTH}
          placeholder={"e.g. Need to finish the presentation tomorrow, reply to the client, review the proposal and maybe schedule a meeting next week."}
          aria-label="Notes to convert into tasks"
        />
        <Button className="mt-4" onClick={handleConvert} loading={isLoading} disabled={!notes.trim()}>
          Turn into tasks
        </Button>

        {!isLoading && status === "error" && (
          <div className="mt-4 flex flex-col items-start gap-2">
            <p className="text-sm text-danger">{error}</p>
            <Button size="sm" variant="secondary" onClick={handleConvert}>
              Try again
            </Button>
          </div>
        )}
      </Card>

      {isLoading && (
        <Card className="p-5">
          <ThinkingDots label="Nexa is reading your notes" />
        </Card>
      )}

      {drafts && drafts.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink">Review extracted tasks</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {drafts.map((draft, i) => (
              <li key={i}>
                <button
                  onClick={() => toggleSelected(i)}
                  aria-pressed={Boolean(selected[i])}
                  className="flex w-full items-center gap-3 rounded-sm border border-border p-3 text-left hover:bg-ink/[0.02]"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-colors
                      ${selected[i] ? "border-current bg-current text-white" : "border-border"}`}
                  >
                    {selected[i] && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className="flex-1 text-sm text-ink">{draft.title}</span>
                  <PriorityBadge priority={draft.priority} />
                  <span className="hidden text-xs text-muted sm:block">{formatDueDate(draft.dueDate)}</span>
                </button>
              </li>
            ))}
          </ul>

          {added ? (
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4" /> Added to My Tasks.
            </p>
          ) : (
            <Button className="mt-4" onClick={handleAdd} disabled={selectedCount === 0}>
              Add {selectedCount > 0 ? selectedCount : "all"} to My Tasks
            </Button>
          )}
        </Card>
      )}

      {drafts && drafts.length === 0 && !isLoading && (
        <Card className="flex items-center gap-3 p-5">
          <NotebookPen className="h-5 w-5 text-faint" />
          <p className="text-sm text-muted">Nexa couldn't find any clear tasks in those notes. Try adding more detail.</p>
        </Card>
      )}
    </div>
  );
}
