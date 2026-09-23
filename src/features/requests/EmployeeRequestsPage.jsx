import { useEffect, useState } from "react";
import { PageTitle } from "../../components/ui/Card";
import { Card } from "../../components/ui/nav";
import { BoxInput, Field } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toast } from "../../components/ui/Toast";
import { IconPalmTree, IconWallet, IconCoins, IconClipboard } from "../../components/ui/Icons";
import { useAuth } from "../../store/auth";
import { PayrollTab } from "./PayrollTab";

const REQUEST_TABS = [
  { id: "vacations", label: "Vacations", icon: <IconPalmTree size={20} /> },
  { id: "salary-advances", label: "Salary Advances", icon: <IconWallet size={20} /> },
  { id: "loans", label: "Loans", icon: <IconCoins size={20} /> },
  { id: "fiche-de-paie", label: "Fiche de paie", icon: <IconClipboard size={20} /> },
];

const BADGE_TONE = {
  approved: "badge-success",
  pending: "badge-warning",
  rejected: "badge-danger",
};

export function EmployeeRequestsPage() {
  const user = useAuth((s) => s.user);
  const [tab, setTab] = useState("vacations");
  const [requests, setRequests] = useState([]);
  const [detail, setDetail] = useState("");
  const [submittedDate, setSubmittedDate] = useState(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);

  const load = () => {
    fetch("/api/employee-requests")
      .then((r) => (r.ok ? r.json() : []))
      .then(setRequests)
      .catch(() => setRequests([]));
  };

  useEffect(load, []);

  const rows = requests.filter((r) => r.category === tab);

  const submit = async (e) => {
    e.preventDefault();
    if (!detail) {
      toast("Please describe the request", "err");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/employee-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: tab,
          employee_name: user?.name || "Employee",
          detail,
          submitted_date: submittedDate,
        }),
      });
      if (!res.ok) throw new Error("fail");
      setDetail("");
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
      <PageTitle kicker="Human resources" title="Employee Requests" />

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Card tabs={REQUEST_TABS} activeTab={tab} onTabChange={setTab} maxWidth={460} />
      </div>

      {tab === "fiche-de-paie" ? (
        <PayrollTab />
      ) : (
        <>
          <form onSubmit={submit} className="card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "12px", alignItems: "end" }}>
            <Field label="detail">
              <BoxInput value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="e.g. Nov 3 – Nov 10, or TND 400" />
            </Field>
            <Field label="submission date">
              <BoxInput type="date" value={submittedDate} onChange={(e) => setSubmittedDate(e.target.value)} />
            </Field>
            <Button variant="brand" type="submit" loading={busy}>
              Submit
            </Button>
          </form>

          <div className="card table-wrapper" style={{ marginTop: "50px" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Detail</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-muted)" }}>
                      No requests yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.employee_name}</td>
                      <td>{r.detail}</td>
                      <td>{r.submitted_date}</td>
                      <td>
                        <span className={`badge ${BADGE_TONE[r.status]}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
