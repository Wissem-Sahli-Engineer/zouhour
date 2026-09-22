import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageTitle } from "../../components/ui/Card";
import { ACCOUNTS, CASHFLOW, EXPENSES, INVOICES } from "./mock";

const TABS = [
  { id: "invoices", label: "Invoices" },
  { id: "treasury", label: "Treasury" },
  { id: "banking", label: "Banking" },
  { id: "stats", label: "Stats" },
];

const TONE = {
  paid: "var(--color-success)",
  pending: "var(--color-accent-orange)",
  overdue: "var(--color-danger)",
};

export function AccountingPage() {
  const [tab, setTab] = useState("invoices");
  const [open, setOpen] = useState(INVOICES[0]);

  return (
    <div className="page-container-max">
      <PageTitle kicker="Finance" title="Accounting" />
      <div className="grid-12">
        <aside className="col-4" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                borderRadius: "var(--radius-nav)",
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "13.5px",
                fontWeight: "600",
                transition: "all 0.15s ease",
                backgroundColor: tab === t.id ? "var(--color-ink)" : "var(--color-white)",
                color: tab === t.id ? "var(--color-white)" : "var(--color-muted)",
              }}
            >
              {t.label}
            </button>
          ))}
        </aside>

        <section className="col-8">
          {tab === "invoices" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "20px" }}>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INVOICES.map((inv) => (
                      <tr
                        key={inv.id}
                        onClick={() => setOpen(inv)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: open?.id === inv.id ? "var(--color-surface)" : "transparent",
                        }}
                      >
                        <td style={{ fontWeight: "600" }}>{inv.id}</td>
                        <td>TND {inv.amount.toLocaleString()}</td>
                        <td style={{ fontWeight: "600", textTransform: "capitalize", color: TONE[inv.status] }}>
                          {inv.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {open ? (
                <div className="card">
                  <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-muted)" }}>
                    Detail
                  </p>
                  <h2 style={{ marginTop: "4px", fontSize: "22px", fontWeight: "700" }}>{open.id}</h2>
                  <p style={{ marginTop: "8px", fontSize: "14px", color: "var(--color-muted)" }}>{open.client}</p>
                  <p style={{ marginTop: "24px", fontSize: "32px", fontWeight: "700" }}>
                    TND {open.amount.toLocaleString()}
                  </p>
                  <p style={{ marginTop: "8px", fontSize: "13px", fontWeight: "600", textTransform: "capitalize", color: TONE[open.status] }}>
                    {open.status}
                  </p>
                  <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--color-muted)" }}>Issued {open.date}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {tab === "treasury" ? (
            <div className="card">
              <h2 style={{ marginBottom: "4px", fontSize: "16px", fontWeight: "700" }}>Spending this month</h2>
              <p style={{ marginBottom: "20px", fontSize: "13px", color: "var(--color-muted)" }}>Categorized outflows — mock ledger.</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column" }}>
                {EXPENSES.map((e) => (
                  <li
                    key={e.id}
                    className="flex-between"
                    style={{ borderBottom: "1px solid var(--color-line)", padding: "12px 0" }}
                  >
                    <div>
                      <p style={{ fontWeight: "600" }}>{e.category}</p>
                      <p style={{ fontSize: "13px", color: "var(--color-muted)" }}>{e.note}</p>
                    </div>
                    <span style={{ fontWeight: "600" }}>TND {e.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {tab === "banking" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {ACCOUNTS.map((a, i) => (
                <div key={a.id} className={i === 0 ? "card-ink" : "card"}>
                  <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.14em", color: i === 0 ? "rgba(255,255,255,0.5)" : "var(--color-muted)" }}>
                    {a.currency}
                  </p>
                  <h2 style={{ marginTop: "4px", fontSize: "18px", fontWeight: "700" }}>{a.name}</h2>
                  <p style={{ marginTop: "16px", fontSize: "28px", fontWeight: "700" }}>
                    {a.currency} {a.balance.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {tab === "stats" ? (
            <div className="card">
              <h2 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "700" }}>Income vs expenses</h2>
              <div style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CASHFLOW}>
                    <CartesianGrid stroke="#e7e7ea" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="spend" fill="#F0924B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
