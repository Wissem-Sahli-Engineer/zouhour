import { useEffect, useRef, useState } from "react";
import { IconBell } from "./ui/Icons";
import Magnet from "./ui/magnet";

const COUNTRIES = [
  { id: "tunisia", currency: "TND" },
  { id: "libya", currency: "LYD" },
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [alertClients, setAlertClients] = useState([]);
  const [treasury, setTreasury] = useState([]);
  const boxRef = useRef(null);

  const load = () => {
    fetch("/api/clients")
      .then((r) => (r.ok ? r.json() : []))
      .then((clients) =>
        setAlertClients(
          (Array.isArray(clients) ? clients : []).filter((c) => c.visa_status === "rejected")
        )
      )
      .catch(() => setAlertClients([]));

    Promise.all(
      COUNTRIES.map((c) =>
        fetch(`/api/treasury?country=${c.id}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => ({ ...c, net: data?.current_month?.net ?? 0 }))
          .catch(() => ({ ...c, net: 0 }))
      )
    ).then(setTreasury);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const hasNegative = treasury.some((t) => t.net < 0);
  const count = alertClients.length + treasury.filter((t) => t.net < 0).length;

  return (
    <div style={{ position: "relative" }} ref={boxRef}>
      <Magnet padding={22} magnetStrength={14}>
        <button
          type="button"
          className="icon-btn"
          aria-label="Notifications"
          onClick={() => setOpen((o) => !o)}
        >
          <IconBell />
        </button>
      </Magnet>
      {count > 0 ? (
        <span
          style={{
            position: "absolute",
            right: "8px",
            top: "8px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: hasNegative ? "var(--color-danger)" : "var(--color-accent-orange)",
          }}
        />
      ) : null}

      {open ? (
        <div
          className="card"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "320px",
            padding: "16px",
            zIndex: 50,
            boxShadow: "var(--shadow-login)",
          }}
        >
          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-muted)", marginBottom: "10px" }}>
            Treasury
          </p>
          {treasury.map((t) => (
            <div key={t.id} className="flex-between" style={{ marginBottom: "6px" }}>
              <span style={{ fontSize: "13px", textTransform: "capitalize" }}>{t.id}</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: t.net < 0 ? "var(--color-danger)" : "var(--color-success)" }}>
                {t.currency} {t.net.toLocaleString()}{t.net < 0 ? " ⚠" : ""}
              </span>
            </div>
          ))}

          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-muted)", margin: "14px 0 10px" }}>
            Clients in alert
          </p>
          {alertClients.length === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--color-muted)" }}>No client alerts.</p>
          ) : (
            alertClients.map((c) => (
              <div key={c.id} style={{ fontSize: "13px", padding: "4px 0" }}>
                {c.given_name} {c.surname} — <span style={{ color: "var(--color-danger)" }}>visa rejected</span>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
