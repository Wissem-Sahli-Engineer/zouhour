import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FALLBACK_CLIENTS, enrich } from "./mock";

const STATUS_TONE = {
  paid: "text-success",
  pending: "text-accent-orange",
  overdue: "text-danger",
  "In review": "text-brand",
  "Pending docs": "text-accent-orange",
  Submitted: "text-muted",
  Approved: "text-success",
};

export function ClientDetailPage() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [missing, setMissing] = useState(false);

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
      <div className="mx-auto max-w-[900px]">
        <Link to="/clients" className="text-[13px] font-semibold text-brand">
          ← Clients
        </Link>
        <p className="mt-6 text-muted">Client not found.</p>
      </div>
    );
  }

  if (!client) {
    return <p className="text-muted">Loading file…</p>;
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
  ];

  return (
    <div className="mx-auto max-w-[1100px]">
      <Link to="/clients" className="text-[13px] font-semibold text-brand">
        ← Clients
      </Link>
      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <div className="overflow-hidden rounded-card bg-white">
            {client.user_photo ? (
              <img src={client.user_photo} alt="Passport portrait" className="h-[280px] w-full object-cover" />
            ) : (
              <div className="flex h-[280px] items-center justify-center bg-surface text-muted">No portrait on file</div>
            )}
            <div className="p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Passport holder</p>
              <h1 className="mt-1 text-[22px] font-bold text-ink">
                {client.given_name} {client.surname}
              </h1>
              <p className="mt-1 font-mono text-[13px] text-muted">{client.passport_number}</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-8">
          <div className="rounded-card bg-white p-6">
            <h2 className="mb-4 text-[16px] font-bold">Personal information</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {fields.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[12px] font-semibold text-muted">{k}</dt>
                  <dd className="mt-1 text-[14px] text-ink">{v || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-card bg-white p-6">
            <h2 className="mb-4 text-[16px] font-bold">Visa applications</h2>
            <ul className="space-y-3">
              {client.applications.map((a) => (
                <li key={a.id} className="flex items-baseline justify-between border-b border-line pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold">{a.id}</p>
                    <p className="text-[13px] text-muted">{a.type}</p>
                  </div>
                  <span className={`text-[13px] font-semibold ${STATUS_TONE[a.status] || "text-ink"}`}>{a.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            <div className="rounded-card bg-white p-6">
              <h2 className="mb-3 text-[16px] font-bold">Documents</h2>
              <ul className="space-y-2 text-[14px] text-ink">
                {client.documents.map((d) => (
                  <li key={d} className="border-b border-line py-2 last:border-0">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card bg-white p-6">
              <h2 className="mb-3 text-[16px] font-bold">Invoices</h2>
              <ul className="space-y-2 text-[14px]">
                {client.invoices.map((inv) => (
                  <li key={inv.id} className="flex justify-between border-b border-line py-2 last:border-0">
                    <span>{inv.id}</span>
                    <span className={STATUS_TONE[inv.status]}>{inv.amount}</span>
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
