import { useEffect, useState } from "react";
import { BoxInput, BoxSelect, Field } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toast } from "../../components/ui/Toast";
import { useI18n } from "../../store/i18n";

const EMPTY_ENTRY = {
  kind: "spending",
  product_name: "",
  price: "",
  entry_date: new Date().toISOString().slice(0, 10),
  recorded_by: "",
  counterparty: "",
};

export function TreasuryTab({ country, currency }) {
  const t = useI18n((s) => s.t);
  const [data, setData] = useState(null);
  const [form, setForm] = useState(EMPTY_ENTRY);
  const [busy, setBusy] = useState(false);

  const load = () => {
    fetch(`/api/treasury?country=${country}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setData({ current_month: { spending: 0, gathering: 0, net: 0, entries: [] }, history: [] }));
  };

  useEffect(load, [country]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.product_name || !form.price) {
      toast(t("treasuryTab.required"), "err");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/treasury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, country, price: Number(form.price) }),
      });
      if (!res.ok) throw new Error("fail");
      setForm(EMPTY_ENTRY);
      load();
      toast(t("treasuryTab.recorded"), "ok");
    } catch {
      toast(t("treasuryTab.saveFailed"), "err");
    } finally {
      setBusy(false);
    }
  };

  const removeEntry = async (id) => {
    await fetch(`/api/treasury/${id}`, { method: "DELETE" }).catch(() => {});
    load();
  };

  if (!data) return null;
  const month = data.current_month;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div className="card" style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)" }}>
            {t("treasuryTab.gatheringThisMonth")}
          </p>
          <p style={{ marginTop: "6px", fontSize: "22px", fontWeight: "700", color: "var(--color-success)" }}>
            {currency} {month.gathering.toLocaleString()}
          </p>
        </div>
        <div className="card" style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)" }}>
            {t("treasuryTab.spendingThisMonth")}
          </p>
          <p style={{ marginTop: "6px", fontSize: "22px", fontWeight: "700", color: "var(--color-danger)" }}>
            {currency} {month.spending.toLocaleString()}
          </p>
        </div>
        <div className="card" style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)" }}>
            {t("treasuryTab.netResets")}
          </p>
          <p style={{ marginTop: "6px", fontSize: "22px", fontWeight: "700", color: "var(--color-brand)" }}>
            {currency} {month.net.toLocaleString()}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", alignItems: "end" }}>
        <Field label={t("treasuryTab.kind")}>
          <BoxSelect value={form.kind} onChange={set("kind")}>
            <option value="spending">{t("treasuryTab.spending")}</option>
            <option value="gathering">{t("treasuryTab.gathering")}</option>
          </BoxSelect>
        </Field>
        <Field label={t("treasuryTab.productService")}>
          <BoxInput value={form.product_name} onChange={set("product_name")} />
        </Field>
        <Field label={t("treasuryTab.price")}>
          <BoxInput type="number" step="0.01" value={form.price} onChange={set("price")} />
        </Field>
        <Field label={t("treasuryTab.date")}>
          <BoxInput type="date" value={form.entry_date} onChange={set("entry_date")} />
        </Field>
        <Field label={t("treasuryTab.recordedBy")}>
          <BoxInput value={form.recorded_by} onChange={set("recorded_by")} placeholder={t("treasuryTab.recordedByPlaceholder")} />
        </Field>
        <Field label={t("treasuryTab.counterparty")}>
          <BoxInput value={form.counterparty} onChange={set("counterparty")} placeholder={t("treasuryTab.counterpartyPlaceholder")} />
        </Field>
        <Button variant="brand" type="submit" loading={busy}>
          {t("treasuryTab.addEntry")}
        </Button>
      </form>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-line)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700" }}>{t("treasuryTab.thisMonthTx")}</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("treasuryTab.kindCol")}</th>
              <th>{t("treasuryTab.productCol")}</th>
              <th>{t("treasuryTab.priceCol")}</th>
              <th>{t("treasuryTab.dateCol")}</th>
              <th>{t("treasuryTab.recordedByCol")}</th>
              <th>{t("treasuryTab.counterpartyCol")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {month.entries.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-muted)" }}>
                  {t("treasuryTab.noEntries")}
                </td>
              </tr>
            ) : (
              month.entries.map((e) => (
                <tr key={e.id}>
                  <td>
                    <span className={`badge ${e.kind === "gathering" ? "badge-success" : "badge-danger"}`}>{e.kind === "gathering" ? t("treasuryTab.gathering") : t("treasuryTab.spending")}</span>
                  </td>
                  <td>{e.product_name}</td>
                  <td>{currency} {e.price.toLocaleString()}</td>
                  <td>{e.entry_date}</td>
                  <td>{e.recorded_by || "—"}</td>
                  <td>{e.counterparty || "—"}</td>
                  <td>
                    <button type="button" onClick={() => removeEntry(e.id)} style={{ color: "var(--color-danger)", fontSize: "12px", fontWeight: "600" }}>
                      {t("treasuryTab.remove")}
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
