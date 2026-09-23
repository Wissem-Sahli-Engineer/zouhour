import { useEffect, useMemo, useRef, useState } from "react";
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

export function StatsPage() {
  const root = useRef(null);
  useScrollReveal(root);
  const [clients, setClients] = useState([]);
  const [country, setCountry] = useState("all");
  const [visaType, setVisaType] = useState("all");

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => setClients([]));
  }, []);

  const visaTypes = useMemo(
    () => Array.from(new Set(clients.map((c) => c.visa_type).filter(Boolean))),
    [clients]
  );
  const countries = useMemo(
    () => Array.from(new Set(clients.map((c) => c.country).filter(Boolean))),
    [clients]
  );

  const filtered = clients.filter(
    (c) => (country === "all" || c.country === country) && (visaType === "all" || c.visa_type === visaType)
  );

  const series = useMemo(() => {
    const byMonth = {};
    filtered.forEach((c) => {
      const month = (c.created_at || "").slice(0, 7);
      if (!month) return;
      byMonth[month] = (byMonth[month] || 0) + 1;
    });
    return Object.keys(byMonth)
      .sort()
      .map((month) => ({ month, count: byMonth[month] }));
  }, [filtered]);

  return (
    <div ref={root} className="page-container-max">
      <PageTitle kicker="Analytics" title="New clients over time" />

      <div className="grid-12">
        <aside data-reveal className="col-4 card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-ink)" }}>Filters</p>
          <div>
            <p style={{ marginBottom: "6px", fontSize: "12px", color: "var(--color-muted)" }}>Country</p>
            <BoxSelect value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="all">All countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </BoxSelect>
          </div>
          <div>
            <p style={{ marginBottom: "6px", fontSize: "12px", color: "var(--color-muted)" }}>Visa type</p>
            <BoxSelect value={visaType} onChange={(e) => setVisaType(e.target.value)}>
              <option value="all">All types</option>
              {visaTypes.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </BoxSelect>
          </div>
          <p style={{ paddingTop: "8px", fontSize: "12.5px", lineHeight: "1.5", color: "var(--color-muted)" }}>
            {filtered.length} client{filtered.length === 1 ? "" : "s"} match this filter, grouped by the month they were added.
          </p>
        </aside>

        <div data-reveal className="col-8 card">
          <h2 style={{ marginBottom: "4px", fontSize: "16px", fontWeight: "700", color: "var(--color-ink)" }}>
            New clients per month
          </h2>
          <p style={{ marginBottom: "24px", fontSize: "13px", color: "var(--color-muted)" }}>
            {country === "all" ? "All countries" : country} · {visaType === "all" ? "all visa types" : visaType}
          </p>
          <div style={{ height: "320px" }}>
            {series.length === 0 ? (
              <div className="flex-center" style={{ height: "100%", color: "var(--color-muted)", fontSize: "13px" }}>
                No client data yet for this filter.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
                  <CartesianGrid stroke="#e7e7ea" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" name="New clients" stroke="#8B5CF6" strokeWidth={2.4} dot={{ r: 4, fill: "#8B5CF6" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
