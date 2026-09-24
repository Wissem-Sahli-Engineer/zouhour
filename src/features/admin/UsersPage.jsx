import { useEffect, useState } from "react";
import { PageTitle } from "../../components/ui/Card";
import { BoxSelect } from "../../components/ui/Input";
import { toast } from "../../components/ui/Toast";
import { useAuth } from "../../store/auth";

const STATUS_TONE = {
  active: "badge-success",
  pending: "badge-warning",
  rejected: "badge-danger",
};

export function UsersPage() {
  const currentUser = useAuth((s) => s.user);
  const [users, setUsers] = useState([]);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    fetch("/api/auth/users")
      .then((r) => (r.ok ? r.json() : []))
      .then(setUsers)
      .catch(() => setUsers([]));
  };

  useEffect(load, []);

  const act = async (id, action) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/auth/users/${id}/${action}`, { method: "POST" });
      if (!res.ok) throw new Error("fail");
      load();
      toast(action === "approve" ? "Account approved" : "Account rejected", "ok");
    } catch {
      toast("Could not update this account", "err");
    } finally {
      setBusyId(null);
    }
  };

  const changeRole = async (id, role) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/auth/users/${id}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("fail");
      load();
      toast(`Role changed to ${role}`, "ok");
    } catch {
      toast("Could not change this account's role", "err");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Remove this account permanently?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/auth/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("fail");
      load();
      toast("Account removed", "ok");
    } catch {
      toast("Could not remove this account", "err");
    } finally {
      setBusyId(null);
    }
  };

  const pending = users.filter((u) => u.status === "pending");
  const others = users.filter((u) => u.status !== "pending");

  return (
    <div className="page-container-max">
      <PageTitle kicker="Administration" title="Users" />

      {pending.length > 0 ? (
        <div className="card table-wrapper" style={{ marginBottom: "24px" }}>
          <h2 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "700" }}>Pending signup requests</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pending.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      disabled={busyId === u.id}
                      onClick={() => act(u.id, "approve")}
                      className="btn btn-brand"
                      style={{ width: "auto", padding: "6px 14px", fontSize: "12px" }}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={busyId === u.id}
                      onClick={() => act(u.id, "reject")}
                      style={{ color: "var(--color-danger)", fontSize: "12px", fontWeight: "600" }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="card table-wrapper">
        <h2 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "700" }}>All accounts</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {others.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-muted)" }}>
                  No accounts yet.
                </td>
              </tr>
            ) : (
              others.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td style={{ maxWidth: "140px" }}>
                    {u.id !== currentUser?.id ? (
                      <BoxSelect
                        value={u.role}
                        disabled={busyId === u.id}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                      >
                        <option value="Agent">Agent</option>
                        <option value="Admin">Admin</option>
                      </BoxSelect>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td>
                    <span className={`badge ${STATUS_TONE[u.status] || "badge-brand"}`}>{u.status}</span>
                  </td>
                  <td>
                    {u.id !== currentUser?.id ? (
                      <button
                        type="button"
                        disabled={busyId === u.id}
                        onClick={() => remove(u.id)}
                        style={{ color: "var(--color-danger)", fontSize: "12px", fontWeight: "600" }}
                      >
                        Remove
                      </button>
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--color-muted)" }}>You</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
