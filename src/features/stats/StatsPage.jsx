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
    <div ref={root} className="page-container-max">
      <PageTitle kicker="Analytics" title="Pipeline by week" />

      <div className="grid-12">
        <aside data-reveal className="col-4 card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-ink)" }}>Filters</p>
          <div>
            <p style={{ marginBottom: "6px", fontSize: "12px", color: "var(--color-muted)" }}>Date range</p>
            <BoxSelect value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="sep">September 2026</option>
              <option value="aug">August 2026</option>
              <option value="q3">Q3 2026</option>
            </BoxSelect>
          </div>
          <div>
            <p style={{ marginBottom: "6px", fontSize: "12px", color: "var(--color-muted)" }}>Visa type</p>
            <BoxSelect value={visa} onChange={(e) => setVisa(e.target.value)}>
              <option value="all">All types</option>
              <option value="Schengen">Schengen</option>
              <option value="UK">UK</option>
              <option value="US">US</option>
            </BoxSelect>
          </div>
          <div>
            <p style={{ marginBottom: "6px", fontSize: "12px", color: "var(--color-muted)" }}>Officer</p>
            <BoxSelect value={officer} onChange={(e) => setOfficer(e.target.value)}>
              <option value="all">All officers</option>
              <option value="Amina">Amina</option>
              <option value="Karim">Karim</option>
            </BoxSelect>
          </div>
          <p style={{ paddingTop: "8px", fontSize: "12.5px", lineHeight: "1.5", color: "var(--color-muted)" }}>
            Mock series for {range === "sep" ? "September" : range === "aug" ? "August" : "Q3"}. Connect live extracts when the stats API exists.
          </p>
        </aside>

        <div data-reveal className="col-8 card">
          <h2 style={{ marginBottom: "4px", fontSize: "16px", fontWeight: "700", color: "var(--color-ink)" }}>
            Filed applications
          </h2>
          <p style={{ marginBottom: "24px", fontSize: "13px", color: "var(--color-muted)" }}>
            {visa === "all" ? "All visa types" : visa} · {officer === "all" ? "all officers" : officer}
          </p>
          <div style={{ height: "320px" }}>
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
