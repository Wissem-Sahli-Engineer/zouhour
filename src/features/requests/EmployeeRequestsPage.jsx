import { useState } from "react";
import { PageTitle } from "../../components/ui/Card";
import { Card } from "../../components/ui/nav";
import { IconPalmTree, IconWallet, IconCoins } from "../../components/ui/Icons";
import { EMPLOYEE_REQUESTS, BADGE_TONE } from "./mock";

const REQUEST_TABS = [
  { id: "vacations", label: "Vacations", icon: <IconPalmTree size={20} /> },
  { id: "salary-advances", label: "Salary Advances", icon: <IconWallet size={20} /> },
  { id: "loans", label: "Loans", icon: <IconCoins size={20} /> },
];

export function EmployeeRequestsPage() {
  const [tab, setTab] = useState("vacations");
  const rows = EMPLOYEE_REQUESTS[tab] || [];

  return (
    <div className="page-container-max">
      <PageTitle kicker="Human resources" title="Employee Requests" />

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Card tabs={REQUEST_TABS} activeTab={tab} onTabChange={setTab} maxWidth={460} />
      </div>

      <div className="card table-wrapper">
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
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.employee}</td>
                <td>{r.detail}</td>
                <td>{r.submitted}</td>
                <td>
                  <span className={`badge ${BADGE_TONE[r.status]}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
