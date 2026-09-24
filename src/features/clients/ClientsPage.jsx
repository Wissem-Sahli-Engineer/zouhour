import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageTitle } from "../../components/ui/Card";
import { IconPlus } from "../../components/ui/Icons";
import { Card } from "../../components/ui/nav";
import Magnet from "../../components/ui/magnet";
import { withToken } from "../../store/auth";
import { useI18n } from "../../store/i18n";

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
  const t = useI18n((s) => s.t);
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
        kicker={t("clients.kicker")}
        title={t("clients.title")}
        action={
          <Magnet padding={26} magnetStrength={14}>
            <Link
              to="/clients/add"
              className="btn btn-brand"
              style={{ width: "auto", display: "inline-flex", gap: "8px", padding: "10px 18px" }}
            >
              <IconPlus size={16} />
              {t("clients.addClient")}
            </Link>
          </Magnet>
        }
      />

      <div style={{ marginBottom: "20px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("clients.filterPlaceholder")}
          className="input-box"
          style={{ maxWidth: "380px" }}
        />
      </div>

      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "64px" }}>{t("clients.photo")}</th>
                <th>{t("clients.name")}</th>
                <th>{t("clients.passport")}</th>
                <th>{t("clients.phone")}</th>
                <th>{t("clients.nationality")}</th>
                <th>{t("clients.visaStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: "var(--color-muted)" }}>
                    {error ? "Could not reach the server." : t("clients.noMatches")}
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
                        <img src={withToken(c.user_photo)} alt="" className="table-thumbnail" />
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
