import Modal from "../../components/ui/Modal.jsx";
import Button from "../../components/ui/Button.jsx";

export default function ConfirmResetDialog({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Reset demo workspace?" labelledBy="reset-dialog-title">
      <p className="text-sm text-muted">
        This restores every scenario to its default tasks and clears any changes you've made,
        including AI-generated plans and chat history. This can't be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Reset workspace
        </Button>
      </div>
    </Modal>
  );
}
