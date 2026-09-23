import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FALLBACK_CLIENTS, enrich } from "./mock";
import Magnet from "../../components/ui/magnet";

const STATUS_TONE = {
  paid: "var(--color-success)",
  pending: "var(--color-accent-orange)",
  overdue: "var(--color-danger)",
  "In review": "var(--color-brand)",
  "Pending docs": "var(--color-accent-orange)",
  Submitted: "var(--color-muted)",
  Approved: "var(--color-success)",
};

export function ClientDetailPage() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [missing, setMissing] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/clients/${id}/files`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) setFiles(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/clients")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const found = (Array.isArray(data) ? data : []).map(enrich).find((c) => String(c.id) === String(id));
        if (!cancelled) {
          if (found) setClient(found);
          else {
            const fb = FALLBACK_CLIENTS.map(enrich).find((c) => String(c.id) === String(id));
            setClient(fb || null);
            setMissing(!fb);
          }
        }
      })
      .catch(() => {
        const fb = FALLBACK_CLIENTS.map(enrich).find((c) => String(c.id) === String(id));
        if (!cancelled) {
          setClient(fb || null);
          setMissing(!fb);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (missing) {
    return (
      <div style={{ margin: "0 auto", maxWidth: "900px" }}>
        <Link to="/clients" style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-brand)" }}>
          ← Clients
        </Link>
        <p style={{ marginTop: "24px", color: "var(--color-muted)" }}>Client not found.</p>
      </div>
    );
  }

  if (!client) {
    return <p style={{ color: "var(--color-muted)" }}>Loading file…</p>;
  }

  const fields = [
    ["Full name", `${client.given_name} ${client.surname}`],
    ["Date of birth", client.date_of_birth],
    ["Nationality", client.nationality],
    ["Passport number", client.passport_number],
    ["Expiry", client.date_of_expiry],
    ["Place of birth", client.place_of_birth],
    ["Issued by", client.issued_by],
    ["Phone", client.phone],
    ["Email", client.email],
    ["Entreprise", client.entreprise_name],
    ["Code fiscal", client.code_fiscal],
    ["Visa status", client.visa_status],
    ["Visa type", client.visa_type],
    ["Client relation", client.client_relation],
    ["Prix dossier", client.prix_dossier],
    ["Paiement type", client.paiement_type],
    ["Currency", client.currency],
  ];

  return (
    <div style={{ margin: "0 auto", maxWidth: "1100px" }}>
      <div className="flex-between">
        <Link to="/clients" style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-brand)" }}>
          ← Clients
        </Link>
        <Magnet padding={26} magnetStrength={14}>
          <Link
            to={`/clients/${id}/edit`}
            className="btn btn-brand"
            style={{ width: "auto", padding: "8px 16px", fontSize: "13px" }}
          >
            Edit client
          </Link>
        </Magnet>
      </div>
      <div className="grid-12" style={{ marginTop: "24px" }}>
        <div className="col-4">
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {client.user_photo ? (
              <img
                src={client.user_photo}
                alt="Passport portrait"
                style={{ height: "280px", width: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                className="flex-center"
                style={{ height: "280px", backgroundColor: "var(--color-surface)", color: "var(--color-muted)" }}
              >
                No portrait on file
              </div>
            )}
            <div style={{ padding: "20px" }}>
              <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-muted)" }}>
                Passport holder
              </p>
              <h1 style={{ marginTop: "4px", fontSize: "22px", fontWeight: "700", color: "var(--color-ink)" }}>
                {client.given_name} {client.surname}
              </h1>
              <p style={{ marginTop: "4px", fontFamily: "monospace", fontSize: "13px", color: "var(--color-muted)" }}>
                {client.passport_number}
              </p>
            </div>
          </div>
        </div>

        <div className="col-8" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card" style={{ padding: "24px" }}>
            <h2 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "700" }}>Personal information</h2>
            <dl className="grid-2" style={{ gap: "16px 24px" }}>
              {fields.map(([k, v]) => (
                <div key={k} style={{ borderBottom: "1px solid var(--color-line)", paddingBottom: "8px" }}>
                  <dt style={{ fontSize: "12px", fontWeight: "600", color: "var(--color-muted)" }}>{k}</dt>
                  <dd style={{ marginTop: "4px", fontSize: "14px", fontWeight: "500", color: "var(--color-ink)" }}>
                    {v || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <h2 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "700" }}>Visa applications</h2>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {client.applications.map((a) => (
                <li
                  key={a.id}
                  className="flex-between"
                  style={{ borderBottom: "1px solid var(--color-line)", paddingBottom: "12px" }}
                >
                  <div>
                    <p style={{ fontWeight: "600" }}>{a.id}</p>
                    <p style={{ fontSize: "13px", color: "var(--color-muted)" }}>{a.type}</p>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: STATUS_TONE[a.status] || "var(--color-ink)" }}>
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid-2">
            <div className="card" style={{ padding: "24px" }}>
              <h2 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "700" }}>Documents</h2>
              {files.length === 0 ? (
                <p style={{ fontSize: "13px", color: "var(--color-muted)" }}>No files uploaded yet.</p>
              ) : (
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                  {files.map((f) => (
                    <li key={f.id} style={{ borderBottom: "1px solid var(--color-line)", padding: "8px 0" }}>
                      <a href={f.url} target="_blank" rel="noreferrer" style={{ color: "var(--color-brand)" }}>
                        {f.filename}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card" style={{ padding: "24px" }}>
              <h2 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "700" }}>Invoices</h2>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                {client.invoices.map((inv) => (
                  <li key={inv.id} className="flex-between" style={{ borderBottom: "1px solid var(--color-line)", padding: "8px 0" }}>
                    <span>{inv.id}</span>
                    <span style={{ fontWeight: "600", color: STATUS_TONE[inv.status] }}>{inv.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
