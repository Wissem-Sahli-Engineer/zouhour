import { useRef, useState } from "react";
import { IconClose, IconSend } from "../../components/ui/Icons";
import { DURATION, EASE, gsap, useGSAP } from "../../lib/gsap";
import { useUi } from "../../store/ui";

const STARTER = [
  { from: "bot", text: "I can pull case status, missing documents, and invoice balances. Backend wiring comes later — this is the shell." },
];

export function ChatbotPanel() {
  const open = useUi((s) => s.chatbotOpen);
  const setChatbot = useUi((s) => s.setChatbot);
  const panelRef = useRef(null);
  const [messages, setMessages] = useState(STARTER);
  const [draft, setDraft] = useState("");

  useGSAP(
    () => {
      const el = panelRef.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(el, {
        x: open ? 0 : 420,
        autoAlpha: open ? 1 : 0,
        duration: reduce ? 0 : DURATION,
        ease: EASE,
        pointerEvents: open ? "auto" : "none",
      });
    },
    { dependencies: [open] }
  );

  const send = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { from: "you", text },
      { from: "bot", text: "Noted. I’ll connect this to the agency knowledge base once the API is ready." },
    ]);
    setDraft("");
  };

  return (
    <aside
      ref={panelRef}
      style={{
        position: "fixed",
        bottom: "96px",
        right: "24px",
        zIndex: 40,
        display: "flex",
        height: "min(520px, 70vh)",
        width: "380px",
        transform: "translateX(420px)",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--color-line)",
        backgroundColor: "var(--color-white)",
        opacity: 0,
        boxShadow: "var(--shadow-login)",
      }}
    >
      <div
        className="flex-between"
        style={{ borderBottom: "1px solid var(--color-line)", padding: "16px 20px" }}
      >
        <div>
          <p style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-muted)" }}>
            Internal
          </p>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-ink)" }}>Agency assistant</h2>
        </div>
        <button
          type="button"
          onClick={() => setChatbot(false)}
          className="icon-btn"
          aria-label="Close chatbot"
        >
          <IconClose />
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              maxWidth: "85%",
              borderRadius: "14px",
              padding: "10px 14px",
              fontSize: "13px",
              lineHeight: "1.45",
              backgroundColor: m.from === "bot" ? "var(--color-surface)" : "var(--color-ink)",
              color: m.from === "bot" ? "var(--color-ink)" : "var(--color-white)",
              marginLeft: m.from === "bot" ? 0 : "auto",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      <form
        onSubmit={send}
        style={{
          display: "flex",
          gap: "8px",
          borderTop: "1px solid var(--color-line)",
          padding: "12px",
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
          style={{ width: "auto", padding: "10px 14px" }}
          aria-label="Send"
        >
          <IconSend />
        </button>
      </form>
    </aside>
  );
}
