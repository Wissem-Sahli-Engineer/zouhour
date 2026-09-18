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
  paid: "text-success",
  pending: "text-accent-orange",
  overdue: "text-danger",
};

export function AccountingPage() {
  const [tab, setTab] = useState("invoices");
  const [open, setOpen] = useState(INVOICES[0]);

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageTitle kicker="Finance" title="Accounting" />
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 flex flex-row gap-2 lg:col-span-3 lg:flex-col">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-nav px-4 py-3 text-left text-[13.5px] font-semibold ${
                tab === t.id ? "bg-ink text-white" : "bg-white text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </aside>

        <section className="col-span-12 lg:col-span-9">
          {tab === "invoices" ? (
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="overflow-hidden rounded-card bg-white">
                <table className="w-full text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-line text-[12px] font-semibold uppercase tracking-wide text-muted">
                      <th className="px-5 py-3">Invoice</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INVOICES.map((inv) => (
                      <tr
                        key={inv.id}
                        onClick={() => setOpen(inv)}
                        className={`cursor-pointer border-b border-line last:border-0 ${open?.id === inv.id ? "bg-surface" : ""}`}
                      >
                        <td className="px-5 py-3 font-semibold">{inv.id}</td>
                        <td className="px-5 py-3">TND {inv.amount.toLocaleString()}</td>
                        <td className={`px-5 py-3 font-semibold capitalize ${TONE[inv.status]}`}>{inv.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {open ? (
                <div className="rounded-card bg-white p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Detail</p>
                  <h2 className="mt-1 text-[22px] font-bold">{open.id}</h2>
                  <p className="mt-2 text-[14px] text-muted">{open.client}</p>
                  <p className="mt-6 text-[32px] font-bold">TND {open.amount.toLocaleString()}</p>
                  <p className={`mt-2 text-[13px] font-semibold capitalize ${TONE[open.status]}`}>{open.status}</p>
                  <p className="mt-4 text-[13px] text-muted">Issued {open.date}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {tab === "treasury" ? (
            <div className="rounded-card bg-white p-6">
              <h2 className="mb-1 text-[16px] font-bold">Spending this month</h2>
              <p className="mb-5 text-[13px] text-muted">Categorized outflows — mock ledger.</p>
              <ul>
                {EXPENSES.map((e) => (
                  <li key={e.id} className="flex items-baseline justify-between border-b border-line py-3 last:border-0">
                    <div>
                      <p className="font-semibold">{e.category}</p>
                      <p className="text-[13px] text-muted">{e.note}</p>
                    </div>
                    <span className="font-semibold">TND {e.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {tab === "banking" ? (
            <div className="space-y-4">
              {ACCOUNTS.map((a, i) => (
                <div key={a.id} className={`rounded-card p-6 ${i === 0 ? "bg-ink text-white" : "bg-white"}`}>
                  <p className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${i === 0 ? "text-white/50" : "text-muted"}`}>
                    {a.currency}
                  </p>
                  <h2 className="mt-1 text-[18px] font-bold">{a.name}</h2>
                  <p className="mt-4 text-[28px] font-bold">
                    {a.currency} {a.balance.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {tab === "stats" ? (
            <div className="rounded-card bg-white p-6">
              <h2 className="mb-4 text-[16px] font-bold">Income vs expenses</h2>
              <div className="h-[300px]">
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
