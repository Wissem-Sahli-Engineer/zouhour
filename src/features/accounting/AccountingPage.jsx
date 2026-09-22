import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { Card } from "../../components/ui/nav";
import { ACCOUNTING_DATA } from "./mock";

const ACCOUNTING_TABS = [
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

export function AccountingPage({ defaultCountry = "tunisia" }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active country from URL or default prop
  const currentCountry = location.pathname.includes("libya")
    ? "libya"
    : location.pathname.includes("tunisia")
    ? "tunisia"
    : defaultCountry;

  const [country, setCountry] = useState(currentCountry);
  const [tab, setTab] = useState("invoices");

  useEffect(() => {
    if (location.pathname.includes("libya")) setCountry("libya");
    else if (location.pathname.includes("tunisia")) setCountry("tunisia");
  }, [location.pathname]);

  const data = ACCOUNTING_DATA[country] || ACCOUNTING_DATA.tunisia;
  const [openInvoice, setOpenInvoice] = useState(data.invoices[0]);

  // Reset selected invoice when switching country
  useEffect(() => {
    setOpenInvoice(data.invoices[0]);
  }, [country, data]);

  const handleCountryChange = (c) => {
    setCountry(c);
    navigate(`/accounting/${c}`);
  };

  const totalInvoices = data.invoices.reduce((acc, i) => acc + i.amount, 0);
  const totalExpenses = data.expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalBankBalance = data.accounts.reduce((acc, a) => acc + (a.currency === data.currency ? a.balance : 0), 0);

  return (
    <div className="page-container-max">
      {/* Top Header & Country Toggle */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}>
        <PageTitle
          kicker={`Financial Operations — ${data.country}`}
          title={`Accounting (${data.flag} ${data.country})`}
        />

        {/* Country Selector Pills */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px",
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-pill)",
            border: "1px solid var(--color-line)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <button
            type="button"
            onClick={() => handleCountryChange("tunisia")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              backgroundColor: country === "tunisia" ? "var(--color-brand)" : "transparent",
              color: country === "tunisia" ? "var(--color-white)" : "var(--color-muted)",
              boxShadow: country === "tunisia" ? "0 2px 8px rgba(37, 47, 108, 0.2)" : "none",
            }}
          >
            <span>🇹🇳</span>
            <span>Tunisia (TND)</span>
          </button>

          <button
            type="button"
            onClick={() => handleCountryChange("libya")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              backgroundColor: country === "libya" ? "var(--color-brand)" : "transparent",
              color: country === "libya" ? "var(--color-white)" : "var(--color-muted)",
              boxShadow: country === "libya" ? "0 2px 8px rgba(37, 47, 108, 0.2)" : "none",
            }}
          >
            <span>🇱🇾</span>
            <span>Libya (LYD)</span>
          </button>
        </div>
      </div>

      {/* Floating Card Navigation Bar for Invoices, Treasury, Banking, Stats */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Card
          tabs={ACCOUNTING_TABS}
          activeTab={tab}
          onTabChange={setTab}
          maxWidth={460}
        />
      </div>

      {/* Overview Stat Badges */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="card" style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)" }}>
            Total Invoices ({data.invoices.length})
          </p>
          <p style={{ marginTop: "6px", fontSize: "22px", fontWeight: "700", color: "var(--color-ink)" }}>
            {data.currency} {totalInvoices.toLocaleString()}
          </p>
        </div>
        <div className="card" style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)" }}>
            Monthly Treasury Outflow
          </p>
          <p style={{ marginTop: "6px", fontSize: "22px", fontWeight: "700", color: "var(--color-accent-orange)" }}>
            {data.currency} {totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="card" style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)" }}>
            Bank Reserves ({data.currency})
          </p>
          <p style={{ marginTop: "6px", fontSize: "22px", fontWeight: "700", color: "var(--color-success)" }}>
            {data.currency} {totalBankBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tab 1: Invoices */}
      {tab === "invoices" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700" }}>Invoices — {data.country}</h2>
              <span style={{ fontSize: "12px", color: "var(--color-muted)", fontWeight: "600" }}>{data.invoices.length} invoices</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setOpenInvoice(inv)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: openInvoice?.id === inv.id ? "var(--color-brand-wash)" : "transparent",
                    }}
                  >
                    <td style={{ fontWeight: "600" }}>{inv.id}</td>
                    <td>{inv.client}</td>
                    <td>{data.currency} {inv.amount.toLocaleString()}</td>
                    <td style={{ fontWeight: "600", textTransform: "capitalize", color: TONE[inv.status] }}>
                      {inv.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {openInvoice && (
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-muted)" }}>
                  Invoice Detail ({data.country})
                </p>
                <h2 style={{ marginTop: "6px", fontSize: "24px", fontWeight: "700" }}>{openInvoice.id}</h2>
                <p style={{ marginTop: "6px", fontSize: "15px", color: "var(--color-ink)", fontWeight: "500" }}>{openInvoice.client}</p>
                <div style={{ margin: "24px 0", padding: "18px", backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-field)" }}>
                  <p style={{ fontSize: "12px", color: "var(--color-muted)", fontWeight: "600" }}>Total Due</p>
                  <p style={{ fontSize: "32px", fontWeight: "800", color: "var(--color-brand)", marginTop: "4px" }}>
                    {data.currency} {openInvoice.amount.toLocaleString()}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "24px" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "var(--color-muted)" }}>Status</p>
                    <p style={{ marginTop: "4px", fontSize: "14px", fontWeight: "700", textTransform: "capitalize", color: TONE[openInvoice.status] }}>
                      {openInvoice.status}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", color: "var(--color-muted)" }}>Date of Issue</p>
                    <p style={{ marginTop: "4px", fontSize: "14px", fontWeight: "600", color: "var(--color-ink)" }}>
                      {openInvoice.date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Treasury */}
      {tab === "treasury" && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Treasury & Operational Expenses</h2>
              <p style={{ fontSize: "13px", color: "var(--color-muted)", marginTop: "2px" }}>
                Categorized outflows and local agency ledger for {data.country}.
              </p>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-brand)" }}>
              Total: {data.currency} {totalExpenses.toLocaleString()}
            </span>
          </div>

          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column" }}>
            {data.expenses.map((e) => (
              <li
                key={e.id}
                className="flex-between"
                style={{ borderBottom: "1px solid var(--color-line)", padding: "14px 0" }}
              >
                <div>
                  <p style={{ fontWeight: "600", color: "var(--color-ink)" }}>{e.category}</p>
                  <p style={{ fontSize: "13px", color: "var(--color-muted)", marginTop: "2px" }}>
                    {e.note} • <span style={{ opacity: 0.8 }}>{e.date}</span>
                  </p>
                </div>
                <span style={{ fontWeight: "700", color: "var(--color-ink)" }}>
                  {data.currency} {e.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab 3: Banking */}
      {tab === "banking" && (
        <div>
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Banking & Liquid Reserves</h2>
            <p style={{ fontSize: "13px", color: "var(--color-muted)", marginTop: "2px" }}>
              Active bank accounts and treasury holdings in {data.country}.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            {data.accounts.map((a, i) => (
              <div
                key={a.id}
                className={i === 0 ? "card-ink" : "card"}
                style={{ padding: "20px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: i === 0 ? "rgba(255,255,255,0.6)" : "var(--color-muted)",
                    }}
                  >
                    {a.currency} Account
                  </p>
                  <span style={{ fontSize: "16px" }}>{data.flag}</span>
                </div>
                <h3 style={{ marginTop: "8px", fontSize: "17px", fontWeight: "700" }}>{a.name}</h3>
                <p style={{ marginTop: "20px", fontSize: "28px", fontWeight: "800" }}>
                  {a.currency} {a.balance.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Stats */}
      {tab === "stats" && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Income vs Expenses — {data.country}</h2>
              <p style={{ fontSize: "13px", color: "var(--color-muted)", marginTop: "2px" }}>
                Monthly performance overview in {data.currency}.
              </p>
            </div>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px", fontWeight: "600" }}>
              <span style={{ color: "#8B5CF6" }}>● Income</span>
              <span style={{ color: "#F0924B" }}>● Spend</span>
            </div>
          </div>
          <div style={{ height: "340px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cashflow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e7e7ea" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${data.currency} ${val.toLocaleString()}`]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e7e7ea" }}
                />
                <Legend />
                <Bar dataKey="income" name={`Income (${data.currency})`} fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="spend" name={`Spend (${data.currency})`} fill="#F0924B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountingPage;
