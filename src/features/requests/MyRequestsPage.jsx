import { PageTitle } from "../../components/ui/Card";
import { MY_REQUESTS, BADGE_TONE } from "./mock";

export function MyRequestsPage() {
  return (
    <div className="page-container-max">
      <PageTitle kicker="Human resources" title="My Requests" />

      <div className="card table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Detail</th>
              <th>Submitted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MY_REQUESTS.map((r) => (
              <tr key={r.id}>
                <td>{r.type}</td>
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
