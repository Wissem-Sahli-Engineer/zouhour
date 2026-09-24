import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/ui/Card";
import { IconPlus } from "../../components/ui/Icons";
import { Card } from "../../components/ui/nav";
import Magnet from "../../components/ui/magnet";

const CLIENTS_TABS = [
  { id: "normal", label: "All clients" },
  { id: "museum", label: "Museum" },
  { id: "reservation", label: "Reservation" },
  { id: "alert", label: "Alert" },
];

const VISA_BADGE = {
  not_started: "badge-brand",
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-danger",
};

export function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/clients")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setClients(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
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
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Card tabs={CLIENTS_TABS} maxWidth={460} />
      </div>

      <PageTitle
        kicker="Database"
        title="Clients"
        action={
          <Magnet padding={26} magnetStrength={14}>
            <Link
              to="/clients/add"
              className="btn btn-brand"
              style={{ width: "auto", display: "inline-flex", gap: "8px", padding: "10px 18px" }}
            >
              <IconPlus size={16} />
              Add client
            </Link>
          </Magnet>
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
                <th>Visa status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: "var(--color-muted)" }}>
                    {error ? "Could not reach the server." : "No clients match that filter."}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/clients/${c.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
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
                    </td>
                    <td style={{ fontWeight: "600", color: "var(--color-ink)" }}>
                      {c.given_name} {c.surname}
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: "13px" }}>{c.passport_number}</td>
                    <td style={{ color: "var(--color-muted)" }}>{c.phone}</td>
                    <td>{c.nationality}</td>
                    <td>
                      {c.visa_status ? (
                        <span className={`badge ${VISA_BADGE[c.visa_status] || "badge-brand"}`}>
                          {c.visa_status.replace("_", " ")}
                        </span>
                      ) : (
                        <span style={{ color: "var(--color-muted)" }}>—</span>
                      )}
                    </td>
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
