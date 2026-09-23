import { useState } from "react";
import { PageTitle } from "../../components/ui/Card";
import { IconSend } from "../../components/ui/Icons";
import { OLLAMA_BASE_URL, OLLAMA_MODEL } from "../../lib/config";

const STARTER = [
  { role: "assistant", content: `Hi, I'm running locally on Ollama (${OLLAMA_MODEL}). Ask me anything about cases, documents, or invoices.` },
];

export function ChatbotPage() {
  const [messages, setMessages] = useState(STARTER);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setDraft("");
    setLoading(true);

    try {
      const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: OLLAMA_MODEL, messages: next, stream: false }),
      });
      if (!res.ok) throw new Error(`Ollama responded with ${res.status}`);
      const data = await res.json();
      const reply = data?.message?.content || "No response from the model.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Couldn't reach Ollama at ${OLLAMA_BASE_URL} (${err.message}). Make sure "ollama serve" is running and the "${OLLAMA_MODEL}" model is pulled.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container-max" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PageTitle kicker="Local LLM · Ollama" title="Agency Assistant" />

      <div
        className="card"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "60vh",
          overflow: "hidden",
          padding: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                maxWidth: "70%",
                borderRadius: "14px",
                padding: "12px 16px",
                fontSize: "14px",
                lineHeight: "1.5",
                backgroundColor: m.role === "assistant" ? "var(--color-surface)" : "var(--color-ink)",
                color: m.role === "assistant" ? "var(--color-ink)" : "var(--color-white)",
                marginLeft: m.role === "assistant" ? 0 : "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content}
            </div>
          ))}
          {loading ? (
            <div
              style={{
                maxWidth: "70%",
                borderRadius: "14px",
                padding: "12px 16px",
                fontSize: "14px",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-muted)",
              }}
            >
              Thinking…
            </div>
          ) : null}
        </div>

        <form
          onSubmit={send}
          style={{
            display: "flex",
            gap: "10px",
            borderTop: "1px solid var(--color-line)",
            padding: "16px",
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about a file…"
            className="input-box"
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="btn btn-brand"
            style={{ width: "auto", padding: "10px 16px" }}
            aria-label="Send"
            disabled={loading}
          >
            <IconSend />
          </button>
        </form>
      </div>
    </div>
  );
}
