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

  return (
    <div
      className={`toast-notification ${state.type === "err" ? "err" : "ok"} ${
        state.open ? "show" : ""
      }`}
    >
      {state.text}
    </div>
  );
}
