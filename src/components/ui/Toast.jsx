import { useEffect, useState } from "react";

let show;

export function toast(text, type = "ok") {
  show?.(text, type);
}

export function ToastHost() {
  const [state, setState] = useState({ text: "", type: "ok", open: false });

  useEffect(() => {
    show = (text, type) => {
      setState({ text, type, open: true });
      clearTimeout(show._t);
      show._t = setTimeout(() => setState((s) => ({ ...s, open: false })), 2400);
    };
    return () => {
      show = undefined;
    };
  }, []);

  const bg = state.type === "err" ? "bg-danger" : "bg-ink";

  return (
    <div
      className={`pointer-events-none fixed left-1/2 top-6 z-[80] -translate-x-1/2 rounded-btn px-[22px] py-3 text-[13.5px] font-semibold text-white shadow-toast transition-transform duration-350 ${bg} ${
        state.open ? "translate-y-0" : "-translate-y-[140%]"
      }`}
    >
      {state.text}
    </div>
  );
}
