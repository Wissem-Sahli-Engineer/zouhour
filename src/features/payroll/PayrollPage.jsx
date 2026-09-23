import { useEffect, useState } from "react";
import { PageTitle } from "../../components/ui/Card";
import { BoxInput, Field } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toast } from "../../components/ui/Toast";

export function PayrollPage() {
  const [rows, setRows] = useState([]);
  const [period, setPeriod] = useState(new Date().toLocaleString("en", { month: "long", year: "numeric" }));
  const [busyRow, setBusyRow] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    fetch("/api/payroll/payslips")
      .then((r) => (r.ok ? r.json() : []))
      .then(setHistory)
      .catch(() => setHistory([]));
  };

  useEffect(loadHistory, []);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("/api/payroll/parse-pointage", { method: "POST", body });
      if (!res.ok) throw new Error("fail");
      const data = await res.json();
      setRows(data.map((r) => ({ ...r, hourly_rate: "" })));
      toast(`Parsed ${data.length} employee${data.length === 1 ? "" : "s"} from the file`, "ok");
    } catch {
      toast("Could not read the Excel file", "err");
    } finally {
      setUploading(false);
    }
  };

  const setRate = (i, value) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, hourly_rate: value } : r)));

  const generate = async (row, i) => {
    if (!row.hourly_rate) {
      toast("Enter an hourly rate first", "err");
      return;
    }
    setBusyRow(i);
    try {
      const res = await fetch("/api/payroll/payslips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_name: row.employee_name,
          period_label: period,
          hours: row.hours,
          hourly_rate: Number(row.hourly_rate),
          currency: "TND",
        }),
      });
      if (!res.ok) throw new Error("fail");
      const payslip = await res.json();
      window.open(`/api/payroll/payslips/${payslip.id}/pdf`, "_blank");
      loadHistory();
      toast("Payslip generated", "ok");
    } catch {
      toast("Could not generate payslip", "err");
    } finally {
      setBusyRow(null);
    }
  };

  const removePayslip = async (id) => {
    if (!window.confirm("Remove this payslip?")) return;
    await fetch(`/api/payroll/payslips/${id}`, { method: "DELETE" }).catch(() => {});
    loadHistory();
  };

  const downloadPayslip = async (p) => {
    try {
      const res = await fetch(`/api/payroll/payslips/${p.id}/pdf`);
      if (!res.ok) throw new Error("fail");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip-${p.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      toast("Could not download the PDF", "err");
    }
  };

  return (
    <div className="page-container-max">
      <PageTitle kicker="Human resources" title="Fiche de paie" />

      <div className="card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", alignItems: "end", marginBottom: "20px" }}>
        <div>
          <label className="upload-dropzone" style={{ display: "block" }}>
            <div style={{ fontWeight: "600", fontSize: "15px", color: "var(--color-ink)" }}>
              Upload pointage (Excel)
            </div>
            <div style={{ marginTop: "4px", fontSize: "13px", color: "var(--color-muted)" }}>
              Columns: employee name, hours worked — {uploading ? "reading…" : ".xlsx"}
            </div>
            <input type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={onFile} />
          </label>
        </div>
        <Field label="pay period">
          <BoxInput value={period} onChange={(e) => setPeriod(e.target.value)} />
        </Field>
      </div>

      {rows.length > 0 ? (
        <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "20px" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Hours</th>
                <th>Hourly rate (TND)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.employee_name}</td>
                  <td>{row.hours}</td>
                  <td style={{ maxWidth: "140px" }}>
                    <BoxInput
                      type="number"
                      step="0.01"
                      value={row.hourly_rate}
                      onChange={(e) => setRate(i, e.target.value)}
                    />
                  </td>
                  <td>
                    <Button variant="brand" loading={busyRow === i} onClick={() => generate(row, i)} style={{ width: "auto", padding: "8px 14px", fontSize: "12px" }}>
                      Generate fiche de paie
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-line)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700" }}>Generated payslips</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Period</th>
              <th>Hours</th>
              <th>Gross total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-muted)" }}>
                  No payslips generated yet.
                </td>
              </tr>
            ) : (
              history.map((p) => (
                <tr key={p.id}>
                  <td>{p.employee_name}</td>
                  <td>{p.period_label}</td>
                  <td>{p.hours}</td>
                  <td>{p.currency} {p.gross_total.toLocaleString()}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => downloadPayslip(p)}
                      className="btn btn-brand"
                      style={{ width: "auto", padding: "6px 14px", fontSize: "12px", display: "inline-flex" }}
                    >
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => removePayslip(p.id)}
                      style={{ color: "var(--color-danger)", fontSize: "12px", fontWeight: "600" }}
                    >
                      Remove
                    </button>
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
