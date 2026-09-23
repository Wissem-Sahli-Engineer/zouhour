import { useEffect, useState } from "react";
import { PageTitle } from "../../components/ui/Card";
import { BoxInput, Field } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toast } from "../../components/ui/Toast";
import { useAuth } from "../../store/auth";

const BADGE_TONE = {
  approved: "badge-success",
  pending: "badge-warning",
  rejected: "badge-danger",
};

const EMPTY = { name: "", description: "", submitted_date: new Date().toISOString().slice(0, 10) };

export function MyRequestsPage() {
  const user = useAuth((s) => s.user);
  const isAdmin = user?.role === "Admin";
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  const load = () => {
    fetch("/api/agency-requests")
      .then((r) => (r.ok ? r.json() : []))
      .then(setRequests)
      .catch(() => setRequests([]));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm("Remove this request?")) return;
    await fetch(`/api/agency-requests/${id}`, { method: "DELETE" }).catch(() => {});
    load();
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      toast("Name and description are required", "err");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/agency-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("fail");
      setForm(EMPTY);
      load();
      toast("Request submitted", "ok");
    } catch {
      toast("Could not submit request", "err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-container-max">
      <PageTitle kicker="Human resources" title="My Requests" />

      {isAdmin ? (
        <form onSubmit={submit} className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", alignItems: "end", marginBottom: "20px" }}>
          <Field label="name">
            <BoxInput value={form.name} onChange={set("name")} />
          </Field>
          <Field label="description">
            <BoxInput value={form.description} onChange={set("description")} />
          </Field>
          <Field label="submission date">
            <BoxInput type="date" value={form.submitted_date} onChange={set("submitted_date")} />
          </Field>
          <Button variant="brand" type="submit" loading={busy} style={{ top: "-20px" }}>
            Submit request
          </Button>
        </form>
      ) : null}

      <div className="card table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Submitted</th>
              <th>Status</th>
              {isAdmin ? <th></th> : null}
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-muted)" }}>
                  No requests yet.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.description}</td>
                  <td>{r.submitted_date}</td>
                  <td>
                    <span className={`badge ${BADGE_TONE[r.status]}`}>{r.status}</span>
                  </td>
                  {isAdmin ? (
                    <td>
                      <button type="button" onClick={() => remove(r.id)} style={{ color: "var(--color-danger)", fontSize: "12px", fontWeight: "600" }}>
                        Remove
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
