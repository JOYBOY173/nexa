import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { useAI } from "../../hooks/useAI.js";
import { askNexa } from "../../api/nexaApi.js";
import ChatMessage from "./ChatMessage.jsx";
import { ThinkingDots } from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";
import { TextInput } from "../../components/ui/Field.jsx";

const SUGGESTED_PROMPTS = [
  "What should I focus on today?",
  "Plan my day.",
  "Prioritize my tasks.",
  "Turn these notes into tasks.",
];

const MAX_MESSAGE_LENGTH = 500;

export default function ChatPanel() {
  const { tasks, activeScenario, chatHistory, appendChatMessage } = useWorkspace();
  const { isLoading, status, error, run, reset } = useAI();
  const [input, setInput] = useState("");
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory, isLoading]);

  function buildContext() {
    return {
      scenario: activeScenario,
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        dueDate: t.dueDate,
        completed: t.completed,
      })),
    };
  }

  async function sendMessage(message) {
    const trimmed = message.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!trimmed) return;
    reset();
    appendChatMessage({ role: "user", content: trimmed });
    setInput("");
    setLastFailedMessage(null);

    const reply = await run(() => askNexa({ message: trimmed, context: buildContext() }));
    if (reply) {
      appendChatMessage({ role: "nexa", content: reply });
    } else {
      setLastFailedMessage(trimmed);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleRetry() {
    if (lastFailedMessage) sendMessage(lastFailedMessage);
  }

  return (
    <div className="flex h-[60vh] min-h-[420px] flex-col rounded-md border border-border bg-surface">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {chatHistory.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-muted">Try asking Nexa one of these:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-sm border border-border bg-canvas px-3 py-1.5 text-sm text-ink hover:border-current/40 hover:bg-current-light"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}

        {isLoading && <ThinkingDots />}

        {!isLoading && status === "error" && (
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-danger">{error}</p>
            <Button size="sm" variant="secondary" onClick={handleRetry}>
              Try again
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
        <TextInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Nexa anything about your workspace..."
          maxLength={MAX_MESSAGE_LENGTH}
          aria-label="Message Nexa"
        />
        <Button type="submit" size="md" disabled={!input.trim()} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
