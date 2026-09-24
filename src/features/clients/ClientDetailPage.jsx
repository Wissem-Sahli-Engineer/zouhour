import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Magnet from "../../components/ui/magnet";
import { toast } from "../../components/ui/Toast";

export function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [missing, setMissing] = useState(false);
  const [files, setFiles] = useState([]);

  const loadFiles = () => {
    fetch(`/api/clients/${id}/files`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setFiles(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(loadFiles, [id]);

  const removeFile = async (fileId) => {
    if (!window.confirm("Remove this file?")) return;
    await fetch(`/api/clients/${id}/files/${fileId}`, { method: "DELETE" }).catch(() => {});
    loadFiles();
  };

  const removeClient = async () => {
    if (!window.confirm("Remove this client permanently? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("fail");
      toast("Client removed", "ok");
      navigate("/clients");
    } catch {
      toast("Could not remove client", "err");
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/clients")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const found = (Array.isArray(data) ? data : []).find((c) => String(c.id) === String(id));
        if (!cancelled) {
          setClient(found || null);
          setMissing(!found);
        }
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
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
        <div style={{ display: "flex", gap: "10px" }}>
          <Magnet padding={26} magnetStrength={14}>
            <Link
              to={`/clients/${id}/edit`}
              className="btn btn-brand"
              style={{ width: "auto", padding: "8px 16px", fontSize: "13px" }}
            >
              Edit client
            </Link>
          </Magnet>
          <Magnet padding={26} magnetStrength={14}>
            <button
              type="button"
              onClick={removeClient}
              className="btn btn-danger"
              style={{ width: "auto", padding: "8px 16px", fontSize: "13px" }}
            >
              Remove client
            </button>
          </Magnet>
        </div>
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
            <h2 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "700" }}>Documents</h2>
            {files.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--color-muted)" }}>No files uploaded yet.</p>
            ) : (
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                {files.map((f) => (
                  <li key={f.id} className="flex-between" style={{ borderBottom: "1px solid var(--color-line)", padding: "8px 0" }}>
                    <a href={f.url} target="_blank" rel="noreferrer" style={{ color: "var(--color-brand)" }}>
                      {f.filename}
                    </a>
                    <button type="button" onClick={() => removeFile(f.id)} style={{ color: "var(--color-danger)", fontSize: "12px", fontWeight: "600" }}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
