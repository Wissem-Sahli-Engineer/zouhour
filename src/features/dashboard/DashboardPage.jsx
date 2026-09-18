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
    <div className="rounded-field border border-line bg-white px-3 py-2 text-[12px] text-ink">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-muted">
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
    <div ref={root} className="mx-auto max-w-[1180px]">
      <PageTitle kicker="Overview" title="This month at a glance" />

      <div className="grid grid-cols-12 gap-5">
        <div data-reveal className="col-span-12 rounded-card bg-ink px-8 py-7 text-white lg:col-span-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">Revenue this month</p>
          <p className="mt-2 text-[44px] font-bold leading-none">TND 17,680</p>
          <p className="mt-3 max-w-md text-[14px] text-white/60">
            Up from August on Schengen files. Seven invoices still open — treasury has the aging list.
          </p>
        </div>

        <div className="col-span-12 grid grid-cols-2 gap-5 lg:col-span-5">
          {STATS.map((s) => (
            <div data-reveal key={s.label} className="rounded-card bg-white p-5">
              <div className="mb-4 h-1 w-8" style={{ background: s.accent }} />
              <p className="text-[12px] font-semibold text-muted">{s.label}</p>
              <p className="mt-1 text-[26px] font-bold text-ink">{s.value}</p>
              <p className="mt-1 text-[12px] text-muted">{s.note}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="col-span-12 rounded-card bg-white p-6 lg:col-span-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-[16px] font-bold text-ink">Applications vs new clients</h2>
            <span className="text-[12px] text-muted">Last 6 months</span>
          </div>
          <div className="h-[280px]">
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

        <div data-reveal className="col-span-12 rounded-card bg-white p-6 lg:col-span-4">
          <h2 className="mb-4 text-[16px] font-bold text-ink">By status</h2>
          <div className="h-[180px]">
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
          <p className="mt-3 text-[12.5px] text-muted">7 files blocked on documents — follow up before month-end.</p>
        </div>
      </div>
    </div>
  );
}
