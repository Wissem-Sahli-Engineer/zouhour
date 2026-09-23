import { useEffect, useState } from "react";
import { BoxInput, BoxSelect, Field } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toast } from "../../components/ui/Toast";
import Magnet from "../../components/ui/magnet";

const EMPTY_FORM = {
  doc_type: "facture",
  client_name: "",
  client_passport: "",
  client_mf: "",
  company_name: "",
  service_type: "",
  issue_date: new Date().toISOString().slice(0, 10),
  tva_rate: "0.19",
  timbre: "1",
  amount_paid: "",
};

const EMPTY_ITEM = { designation: "", quantity: "1", unit_price: "" };

export function InvoicesTab({ country }) {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [busy, setBusy] = useState(false);

  const load = () => {
    fetch(`/api/invoices?country=${country}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setInvoices)
      .catch(() => setInvoices([]));
  };

  useEffect(load, [country]);

  const downloadInvoice = async (inv) => {
    try {
      const res = await fetch(inv.pdf_url);
      if (!res.ok) throw new Error("fail");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${inv.number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      toast("Could not download the PDF", "err");
    }
  };

  const removeInvoice = async (id) => {
    if (!window.confirm("Remove this invoice/receipt?")) return;
    await fetch(`/api/invoices/${id}`, { method: "DELETE" }).catch(() => {});
    load();
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const setItem = (i, key) => (e) =>
    setItems((rows) => rows.map((row, idx) => (idx === i ? { ...row, [key]: e.target.value } : row)));

  const addItemRow = () => setItems((rows) => [...rows, { ...EMPTY_ITEM }]);
  const removeItemRow = (i) => setItems((rows) => rows.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.client_name) {
      toast("Client name is required", "err");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        country,
        doc_type: form.doc_type,
        client_name: form.client_name,
        client_passport: form.client_passport || null,
        client_mf: form.client_mf || null,
        company_name: form.company_name || null,
        service_type: form.service_type || null,
        issue_date: form.issue_date,
        tva_rate: Number(form.tva_rate || 0.19),
        timbre: Number(form.timbre || 1),
        amount_paid: Number(form.amount_paid || 0),
        items:
          form.doc_type === "facture"
            ? items
                .filter((i) => i.designation && i.unit_price)
                .map((i) => ({
                  designation: i.designation,
                  quantity: Number(i.quantity || 1),
                  unit_price: Number(i.unit_price),
                }))
            : [],
      };
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("fail");
      setForm(EMPTY_FORM);
      setItems([{ ...EMPTY_ITEM }]);
      load();
      toast("Document created", "ok");
    } catch {
      toast("Could not create document", "err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <form onSubmit={submit} className="card">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
          <Field label="document type">
            <BoxSelect value={form.doc_type} onChange={set("doc_type")}>
              <option value="facture">Facture</option>
              <option value="recu">Reçu</option>
            </BoxSelect>
          </Field>
          <Field label="client name">
            <BoxInput value={form.client_name} onChange={set("client_name")} />
          </Field>
          <Field label="client passport">
            <BoxInput value={form.client_passport} onChange={set("client_passport")} />
          </Field>
          <Field label="matricule fiscal">
            <BoxInput value={form.client_mf} onChange={set("client_mf")} />
          </Field>
          <Field label="company name">
            <BoxInput value={form.company_name} onChange={set("company_name")} />
          </Field>
          {form.doc_type === "recu" ? (
            <Field label="service type">
              <BoxInput value={form.service_type} onChange={set("service_type")} />
            </Field>
          ) : null}
          <Field label="issue date">
            <BoxInput type="date" value={form.issue_date} onChange={set("issue_date")} />
          </Field>
          {form.doc_type === "facture" ? (
            <>
              <Field label="TVA rate">
                <BoxInput type="number" step="0.01" value={form.tva_rate} onChange={set("tva_rate")} />
              </Field>
              <Field label="timbre">
                <BoxInput type="number" step="0.01" value={form.timbre} onChange={set("timbre")} />
              </Field>
            </>
          ) : null}
          <Field label="amount already paid">
            <BoxInput type="number" step="0.01" value={form.amount_paid} onChange={set("amount_paid")} />
          </Field>
        </div>

        {form.doc_type === "facture" ? (
          <div style={{ marginTop: "20px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--color-ink)", marginBottom: "8px" }}>Line items</p>
            {items.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "10px", marginBottom: "8px" }}>
                <BoxInput placeholder="Designation" value={row.designation} onChange={setItem(i, "designation")} />
                <BoxInput type="number" placeholder="Qty" value={row.quantity} onChange={setItem(i, "quantity")} />
                <BoxInput type="number" step="0.01" placeholder="Unit price" value={row.unit_price} onChange={setItem(i, "unit_price")} />
                <button type="button" onClick={() => removeItemRow(i)} style={{ color: "var(--color-danger)", fontWeight: "600", fontSize: "12px" }}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addItemRow} style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-brand)" }}>
              + Add line item
            </button>
          </div>
        ) : null}

        <div style={{ marginTop: "20px" }}>
          <Button variant="brand" type="submit" loading={busy}>
            Create {form.doc_type === "recu" ? "reçu" : "facture"}
          </Button>
        </div>
      </form>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-line)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700" }}>Documents — {country}</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Type</th>
              <th>Client</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-muted)" }}>
                  No invoices or receipts yet.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: "600" }}>{inv.number}</td>
                  <td style={{ textTransform: "capitalize" }}>{inv.doc_type}</td>
                  <td>{inv.client_name}</td>
                  <td>{inv.issue_date}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    <Magnet padding={22} magnetStrength={14}>
                      <button
                        type="button"
                        onClick={() => downloadInvoice(inv)}
                        className="btn btn-brand"
                        style={{ width: "auto", padding: "6px 14px", fontSize: "12px", display: "inline-flex" }}
                      >
                        Download PDF
                      </button>
                    </Magnet>
                    <button
                      type="button"
                      onClick={() => removeInvoice(inv.id)}
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
