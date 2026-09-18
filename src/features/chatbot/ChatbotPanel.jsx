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
      className="fixed bottom-24 right-6 z-40 flex h-[min(520px,70vh)] w-[380px] translate-x-[420px] flex-col overflow-hidden rounded-card border border-line bg-white opacity-0 shadow-login"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Internal</p>
          <h2 className="text-[16px] font-bold text-ink">Agency assistant</h2>
        </div>
        <button
          type="button"
          onClick={() => setChatbot(false)}
          className="rounded-nav p-2 text-muted hover:bg-surface hover:text-ink"
          aria-label="Close chatbot"
        >
          <IconClose />
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-auto p-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-[14px] px-3.5 py-2.5 text-[13px] leading-relaxed ${
              m.from === "bot" ? "bg-surface text-ink" : "ml-auto bg-ink text-white"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about a file…"
          className="flex-1 rounded-field border-[1.5px] border-line px-3 py-2 text-body outline-none focus:border-brand"
        />
        <button type="submit" className="rounded-btn bg-brand px-3 text-white hover:bg-brand-dark" aria-label="Send">
          <IconSend />
        </button>
      </form>
    </aside>
  );
}
