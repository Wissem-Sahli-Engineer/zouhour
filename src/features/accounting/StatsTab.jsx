import { useEffect, useState } from "react";
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

export function StatsTab({ country, currency }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`/api/treasury?country=${country}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setHistory(data.history || []))
      .catch(() => setHistory([]));
  }, [country]);

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Treasury over months — {country}</h2>
          <p style={{ fontSize: "13px", color: "var(--color-muted)", marginTop: "2px" }}>
            Gathering vs spending, aggregated from the treasury ledger, in {currency}.
          </p>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "13px", fontWeight: "600" }}>
          <span style={{ color: "#8B5CF6" }}>● Gathering</span>
          <span style={{ color: "#F0924B" }}>● Spending</span>
        </div>
      </div>
      <div style={{ height: "340px" }}>
        {history.length === 0 ? (
          <div className="flex-center" style={{ height: "100%", color: "var(--color-muted)", fontSize: "13px" }}>
            No treasury history yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e7e7ea" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8a8a8f", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(val) => [`${currency} ${val.toLocaleString()}`]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e7e7ea" }}
              />
              <Legend />
              <Bar dataKey="gathering" name={`Gathering (${currency})`} fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="spending" name={`Spending (${currency})`} fill="#F0924B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
