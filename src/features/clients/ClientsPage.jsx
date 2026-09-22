import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageTitle } from "../../components/ui/Card";
import { IconScan } from "../../components/ui/Icons";
import { FALLBACK_CLIENTS, enrich } from "./mock";

export function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/clients")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setClients((Array.isArray(data) ? data : []).map(enrich));
      })
      .catch(() => {
        if (!cancelled) setClients(FALLBACK_CLIENTS.map(enrich));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = clients.filter((c) => {
    const q = query.toLowerCase();
    const name = `${c.given_name} ${c.surname}`.toLowerCase();
    return name.includes(q) || (c.passport_number || "").toLowerCase().includes(q) || (c.phone || "").includes(q);
  });

  return (
    <div className="page-container-max">
      <PageTitle
        kicker="Database"
        title="Clients"
        action={
          <Link
            to="/clients/scan"
            className="btn btn-brand"
            style={{ width: "auto", display: "inline-flex", gap: "8px", padding: "10px 18px" }}
          >
            <IconScan size={16} />
            Scan passport
          </Link>
        }
      />

      <div style={{ marginBottom: "20px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name, passport, phone"
          className="input-box"
          style={{ maxWidth: "380px" }}
        />
      </div>

      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "64px" }}>Photo</th>
                <th>Name</th>
                <th>Passport</th>
                <th>Phone</th>
                <th>Nationality</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px 16px", textAlign: "center", color: "var(--color-muted)" }}>
                    No clients match that filter.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/clients/${c.id}`} style={{ display: "block" }}>
                        {c.user_photo ? (
                          <img src={c.user_photo} alt="" className="table-thumbnail" />
                        ) : (
                          <div
                            className="table-thumbnail flex-center"
                            style={{ backgroundColor: "var(--color-surface)", fontSize: "10px", color: "var(--color-muted)" }}
                          >
                            —
                          </div>
                        )}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/clients/${c.id}`}
                        style={{ fontWeight: "600", color: "var(--color-ink)", transition: "color 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
                      >
                        {c.given_name} {c.surname}
                      </Link>
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: "13px" }}>{c.passport_number}</td>
                    <td style={{ color: "var(--color-muted)" }}>{c.phone}</td>
                    <td>{c.nationality}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
