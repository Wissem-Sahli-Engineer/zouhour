import { useRef } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageTitle } from "../../components/ui/Card";
import { useScrollReveal } from "../../lib/useScrollReveal";
import { MONTHLY, STATS, STATUS } from "./mock";

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        borderRadius: "var(--radius-field)",
        border: "1px solid var(--color-line)",
        backgroundColor: "var(--color-white)",
        padding: "8px 12px",
        fontSize: "12px",
        color: "var(--color-ink)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <p style={{ marginBottom: "4px", fontWeight: "600" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: "var(--color-muted)" }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const root = useRef(null);
  useScrollReveal(root);

  return (
    <div ref={root} className="page-container-max">
      <PageTitle kicker="Overview" title="This month at a glance" />

      <div className="grid-12">
        <div data-reveal className="col-7 card-ink">
          <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)" }}>
            Revenue this month
          </p>
          <p style={{ marginTop: "8px", fontSize: "var(--text-hero)", fontWeight: "700", lineHeight: "1" }}>
            TND 17,680
          </p>
          <p style={{ marginTop: "12px", maxWidth: "420px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
            Up from August on Schengen files. Seven invoices still open — treasury has the aging list.
          </p>
        </div>

        <div className="col-5">
          <div className="grid-2">
            {STATS.map((s) => (
              <div data-reveal key={s.label} className="stat-mini-card">
                <div className="stat-accent-bar" style={{ background: s.accent }} />
                <p className="stat-label">{s.label}</p>
                <p className="stat-value">{s.value}</p>
                <p className="stat-note">{s.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div data-reveal className="col-8 chart-card">
          <div className="chart-header">
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-ink)" }}>
              Applications vs new clients
            </h2>
            <span style={{ fontSize: "12px", color: "var(--color-muted)" }}>Last 6 months</span>
          </div>
          <div style={{ height: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY}>
                <CartesianGrid stroke="#e7e7ea" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#8B5CF6" fill="#ede9fe" strokeWidth={2} />
                <Area type="monotone" dataKey="clients" name="Clients" stroke="#F0924B" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div data-reveal className="col-4 chart-card">
          <h2 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "700", color: "var(--color-ink)" }}>
            By status
          </h2>
          <div style={{ height: "180px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STATUS} layout="vertical" margin={{ left: 8, right: 8 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={92} tick={{ fill: "#1a1a1a", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={12}>
                  {STATUS.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ marginTop: "12px", fontSize: "12.5px", color: "var(--color-muted)" }}>
            7 files blocked on documents — follow up before month-end.
          </p>
        </div>
      </div>
    </div>
  );
}
