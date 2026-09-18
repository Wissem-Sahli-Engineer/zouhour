import { useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageTitle } from "../../components/ui/Card";
import { BoxSelect } from "../../components/ui/Input";
import { useScrollReveal } from "../../lib/useScrollReveal";

const RAW = [
  { week: "W1", type: "Schengen", officer: "Amina", count: 8 },
  { week: "W2", type: "Schengen", officer: "Amina", count: 6 },
  { week: "W3", type: "Schengen", officer: "Karim", count: 9 },
  { week: "W4", type: "Schengen", officer: "Karim", count: 7 },
  { week: "W1", type: "UK", officer: "Amina", count: 3 },
  { week: "W2", type: "UK", officer: "Karim", count: 4 },
  { week: "W3", type: "UK", officer: "Amina", count: 2 },
  { week: "W4", type: "UK", officer: "Karim", count: 5 },
  { week: "W1", type: "US", officer: "Karim", count: 2 },
  { week: "W2", type: "US", officer: "Amina", count: 1 },
  { week: "W3", type: "US", officer: "Karim", count: 3 },
  { week: "W4", type: "US", officer: "Amina", count: 2 },
];

export function StatsPage() {
  const root = useRef(null);
  useScrollReveal(root);
  const [range, setRange] = useState("sep");
  const [visa, setVisa] = useState("all");
  const [officer, setOfficer] = useState("all");

  const series = useMemo(() => {
    const weeks = ["W1", "W2", "W3", "W4"];
    return weeks.map((week) => {
      const rows = RAW.filter(
        (r) =>
          r.week === week &&
          (visa === "all" || r.type === visa) &&
          (officer === "all" || r.officer === officer)
      );
      return { week, count: rows.reduce((a, r) => a + r.count, 0) };
    });
  }, [visa, officer]);

  return (
    <div ref={root} className="mx-auto max-w-[1180px]">
      <PageTitle kicker="Analytics" title="Pipeline by week" />

      <div className="grid grid-cols-12 gap-6">
        <aside data-reveal className="col-span-12 space-y-4 rounded-card bg-white p-6 lg:col-span-3">
          <p className="text-label text-ink">Filters</p>
          <div>
            <p className="mb-1.5 text-[12px] text-muted">Date range</p>
            <BoxSelect value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="sep">September 2026</option>
              <option value="aug">August 2026</option>
              <option value="q3">Q3 2026</option>
            </BoxSelect>
          </div>
          <div>
            <p className="mb-1.5 text-[12px] text-muted">Visa type</p>
            <BoxSelect value={visa} onChange={(e) => setVisa(e.target.value)}>
              <option value="all">All types</option>
              <option value="Schengen">Schengen</option>
              <option value="UK">UK</option>
              <option value="US">US</option>
            </BoxSelect>
          </div>
          <div>
            <p className="mb-1.5 text-[12px] text-muted">Officer</p>
            <BoxSelect value={officer} onChange={(e) => setOfficer(e.target.value)}>
              <option value="all">All officers</option>
              <option value="Amina">Amina</option>
              <option value="Karim">Karim</option>
            </BoxSelect>
          </div>
          <p className="pt-2 text-[12.5px] leading-relaxed text-muted">
            Mock series for {range === "sep" ? "September" : range === "aug" ? "August" : "Q3"}. Connect live extracts when the stats API exists.
          </p>
        </aside>

        <div data-reveal className="col-span-12 rounded-card bg-white p-6 lg:col-span-9">
          <h2 className="mb-1 text-[16px] font-bold text-ink">Filed applications</h2>
          <p className="mb-6 text-[13px] text-muted">
            {visa === "all" ? "All visa types" : visa} · {officer === "all" ? "all officers" : officer}
          </p>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid stroke="#e7e7ea" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" name="Files" stroke="#8B5CF6" strokeWidth={2.4} dot={{ r: 4, fill: "#8B5CF6" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
