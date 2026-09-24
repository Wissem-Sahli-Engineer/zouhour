import { useEffect, useRef, useState } from "react";
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
import { useI18n } from "../../store/i18n";

const COUNTRIES = ["tunisia", "libya"];

const VISA_STATUS_META = [
  { id: "not_started", name: "Not started", color: "#9ca3af" },
  { id: "pending", name: "Pending", color: "#F0924B" },
  { id: "approved", name: "Approved", color: "#22c55e" },
  { id: "rejected", name: "Rejected", color: "#ef4444" },
];

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
  const t = useI18n((s) => s.t);

  const [clients, setClients] = useState([]);
  const [treasuryMonthly, setTreasuryMonthly] = useState([]);
  const [monthNet, setMonthNet] = useState(0);
  const [bankTotal, setBankTotal] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => setClients([]));

    Promise.all(COUNTRIES.map((c) => fetch(`/api/treasury?country=${c}`).then((r) => (r.ok ? r.json() : null))))
      .then((results) => {
        const merged = {};
        let net = 0;
        results.forEach((data) => {
          if (!data) return;
          net += data.current_month?.net || 0;
          (data.history || []).forEach((row) => {
            const bucket = merged[row.month] || { month: row.month, gathering: 0, spending: 0 };
            bucket.gathering += row.gathering;
            bucket.spending += row.spending;
            merged[row.month] = bucket;
          });
        });
        setMonthNet(net);
        setTreasuryMonthly(Object.values(merged).sort((a, b) => a.month.localeCompare(b.month)).slice(-6));
      })
      .catch(() => {});

    Promise.all(COUNTRIES.map((c) => fetch(`/api/banking/accounts?country=${c}`).then((r) => (r.ok ? r.json() : []))))
      .then((results) => setBankTotal(results.flat().reduce((acc, a) => acc + a.balance, 0)))
      .catch(() => {});

    Promise.all(COUNTRIES.map((c) => fetch(`/api/invoices?country=${c}`).then((r) => (r.ok ? r.json() : []))))
      .then((results) => setInvoiceCount(results.flat().length))
      .catch(() => {});
  }, []);

  const statusCounts = VISA_STATUS_META.map((s) => ({
    ...s,
    value: clients.filter((c) => (c.visa_status || "not_started") === s.id).length,
  }));

  const stats = [
    { label: t("dashboard.totalClients"), value: clients.length, note: "in the database", accent: "#8B5CF6" },
    { label: t("dashboard.pendingVisas"), value: statusCounts.find((s) => s.id === "pending")?.value || 0, note: "awaiting decision", accent: "#F0924B" },
    { label: t("dashboard.rejected"), value: statusCounts.find((s) => s.id === "rejected")?.value || 0, note: "need follow-up", accent: "#ef4444" },
    { label: t("dashboard.invoicesReceipts"), value: invoiceCount, note: "issued to date", accent: "#22c55e" },
  ];

  return (
    <div ref={root} className="page-container-max">
      <PageTitle kicker={t("dashboard.kicker")} title={t("dashboard.title")} />

      <div className="grid-12">
        <div data-reveal className="col-7 card-ink">
          <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)" }}>
            {t("dashboard.treasuryNet")}
          </p>
          <p style={{ marginTop: "8px", fontSize: "var(--text-hero)", fontWeight: "700", lineHeight: "1" }}>
            {monthNet.toLocaleString()}
          </p>
          <p style={{ marginTop: "12px", maxWidth: "420px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
            Combined gathering minus spending across Tunisia and Libya. Bank reserves: {bankTotal.toLocaleString()}.
          </p>
        </div>

        <div className="col-5">
          <div className="grid-2">
            {stats.map((s) => (
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
              Treasury — gathering vs spending
            </h2>
            <span style={{ fontSize: "12px", color: "var(--color-muted)" }}>Last 6 months</span>
          </div>
          <div style={{ height: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={treasuryMonthly}>
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Area type="monotone" dataKey="gathering" name="Gathering" stroke="#8B5CF6" fill="#ede9fe" strokeWidth={2} />
                <Area type="monotone" dataKey="spending" name="Spending" stroke="#F0924B" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div data-reveal className="col-4 chart-card">
          <h2 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "700", color: "var(--color-ink)" }}>
            {t("dashboard.byVisaStatus")}
          </h2>
          <div style={{ height: "180px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusCounts} layout="vertical" margin={{ left: 8, right: 8 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={92} tick={{ fill: "var(--color-ink)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={12}>
                  {statusCounts.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ marginTop: "12px", fontSize: "12.5px", color: "var(--color-muted)" }}>
            {statusCounts.find((s) => s.id === "rejected")?.value || 0} clients need alert follow-up.
          </p>
        </div>
      </div>
    </div>
  );
}
