import { useRef, useState } from "react";
import { IconClose, IconSend } from "../../components/ui/Icons";
import { DURATION, EASE, gsap, useGSAP } from "../../lib/gsap";
import { useUi } from "../../store/ui";
import { CHAT_API_URL } from "../../lib/config";
import { captureScreenshot } from "../../lib/screenCapture";

const STARTER = [
  { role: "assistant", content: "I can pull case status, missing documents, and invoice balances — and read your passport scans. Turn on Live helper to attach a snapshot of this window with your next message." },
];

export function ChatbotPanel() {
  const open = useUi((s) => s.chatbotOpen);
  const setChatbot = useUi((s) => s.setChatbot);
  const panelRef = useRef(null);
  const [messages, setMessages] = useState(STARTER);
  const [draft, setDraft] = useState("");
  const [liveHelper, setLiveHelper] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const send = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || loading) return;

    let image;
    let captureError;
    if (liveHelper) {
      try {
        image = await captureScreenshot();
      } catch (err) {
        captureError = err.message;
      }
    }

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setDraft("");
    setLoading(true);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, image }),
      });
      if (!res.ok) throw new Error(`request failed (${res.status})`);
      const data = await res.json();
      const prefix = captureError ? `[Screen share failed: ${captureError} — replied without it]\n` : "";
      setMessages((m) => [...m, { role: "assistant", content: prefix + (data.reply || "No response from the model.") }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: `Couldn't reach the assistant (${err.message}).` }]);
    } finally {
      setLoading(false);
    }
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
        height: "min(560px, 70vh)",
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

      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          padding: "10px 20px",
          borderBottom: "1px solid var(--color-line)",
          fontSize: "12.5px",
          fontWeight: "600",
          color: "var(--color-muted)",
          cursor: "pointer",
        }}
      >
        <span>Live helper — capture this window with each message</span>
        <input
          type="checkbox"
          checked={liveHelper}
          onChange={(e) => setLiveHelper(e.target.checked)}
        />
      </label>

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
              maxWidth: "85%",
              borderRadius: "14px",
              padding: "10px 14px",
              fontSize: "13px",
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
          disabled={loading}
        >
          <IconSend />
        </button>
      </form>
    </aside>
  );
}
