import { useState } from "react";
import Modal from "../../components/ui/Modal.jsx";
import Button from "../../components/ui/Button.jsx";
import { Label, TextInput, SegmentedControl } from "../../components/ui/Field.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { todayKey, tomorrowKey } from "../../lib/dateUtils.js";

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const DUE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "custom", label: "Custom" },
];

export default function AddTaskModal({ open, onClose }) {
  const { addTask } = useWorkspace();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueOption, setDueOption] = useState("today");
  const [customDate, setCustomDate] = useState("");
  const [error, setError] = useState("");

  function resetForm() {
    setTitle("");
    setPriority("medium");
    setDueOption("today");
    setCustomDate("");
    setError("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function resolveDueDate() {
    if (dueOption === "today") return todayKey();
    if (dueOption === "tomorrow") return tomorrowKey();
    return customDate || null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Give the task a name before adding it.");
      return;
    }
    if (dueOption === "custom" && !customDate) {
      setError("Pick a custom date, or choose Today/Tomorrow instead.");
      return;
    }
    addTask({ title: trimmed, priority, dueDate: resolveDueDate() });
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add task" labelledBy="add-task-title">
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <Label htmlFor="task-name">Task name</Label>
          <TextInput
            id="task-name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Review the design revisions"
            aria-required="true"
            aria-invalid={Boolean(error)}
            autoFocus
          />
        </div>

        <div className="mb-4">
          <Label>Priority</Label>
          <SegmentedControl name="Priority" options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} />
        </div>

        <div className="mb-2">
          <Label>Due date</Label>
          <SegmentedControl name="Due date" options={DUE_OPTIONS} value={dueOption} onChange={setDueOption} />
        </div>

        {dueOption === "custom" && (
          <div className="mb-4 mt-3">
            <Label htmlFor="custom-date">Custom date</Label>
            <TextInput
              id="custom-date"
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
            />
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Add Task</Button>
        </div>
      </form>
    </Modal>
  );
}
