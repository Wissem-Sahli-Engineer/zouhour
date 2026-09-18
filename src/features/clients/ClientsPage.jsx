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
    <div className="mx-auto max-w-[1180px]">
      <PageTitle
        kicker="Database"
        title="Clients"
        action={
          <Link
            to="/clients/scan"
            className="inline-flex items-center gap-2 rounded-btn bg-brand px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-brand-dark"
          >
            <IconScan size={16} />
            Scan passport
          </Link>
        }
      />

      <div className="mb-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name, passport, phone"
          className="w-full max-w-sm rounded-field border-[1.5px] border-line bg-white px-3 py-2.5 text-body outline-none focus:border-brand"
        />
      </div>

      <div className="overflow-hidden rounded-card bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-[1.5px] border-line bg-[#f9fafb] text-[13px] font-semibold text-muted">
              <th className="px-4 py-3.5">Photo</th>
              <th className="px-4 py-3.5">Name</th>
              <th className="px-4 py-3.5">Passport</th>
              <th className="px-4 py-3.5">Phone</th>
              <th className="px-4 py-3.5">Nationality</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[14px] text-muted">
                  No clients match that filter.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5">
                    <Link to={`/clients/${c.id}`}>
                      {c.user_photo ? (
                        <img src={c.user_photo} alt="" className="h-12 w-10 rounded-thumb object-cover" />
                      ) : (
                        <div className="flex h-12 w-10 items-center justify-center rounded-thumb bg-surface text-[10px] text-muted">
                          —
                        </div>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link to={`/clients/${c.id}`} className="font-semibold text-ink hover:text-brand">
                      {c.given_name} {c.surname}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[13px]">{c.passport_number}</td>
                  <td className="px-4 py-3.5 text-[14px] text-muted">{c.phone}</td>
                  <td className="px-4 py-3.5 text-[14px]">{c.nationality}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
