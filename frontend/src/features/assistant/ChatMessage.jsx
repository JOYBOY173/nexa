function renderMarkdown(text) {
  return text.split("\n").map((line, index) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);

    return (
      <div key={index}>
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }

          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  });
}

export default function ChatMessage({ role, content }) {
  const isNexa = role === "nexa";

  return (
    <div className={`flex ${isNexa ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-md px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[75%]
          ${
            isNexa
              ? "border border-current/20 bg-current-light text-current-dark"
              : "bg-ink text-white"
          }`}
      >
        {isNexa && (
          <p className="mb-1 text-xs font-semibold text-current-dark/70">
            ✦ Nexa
          </p>
        )}

        <div className="whitespace-pre-wrap">{renderMarkdown(content)}</div>
      </div>
    </div>
  );
}
