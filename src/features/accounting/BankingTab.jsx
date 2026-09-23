import { useEffect, useState } from "react";
import { BoxInput, Field } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toast } from "../../components/ui/Toast";

const EMPTY_ACCOUNT = { name: "", currency: "", balance: "" };
const EMPTY_TX = { label: "", amount: "", entry_date: new Date().toISOString().slice(0, 10) };

export function BankingTab({ country, currency, flag }) {
  const [accounts, setAccounts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [accountForm, setAccountForm] = useState(EMPTY_ACCOUNT);
  const [txForm, setTxForm] = useState(EMPTY_TX);
  const [busy, setBusy] = useState(false);

  const loadAccounts = () => {
    fetch(`/api/banking/accounts?country=${country}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setAccounts)
      .catch(() => setAccounts([]));
  };

  useEffect(() => {
    loadAccounts();
    setSelected(null);
  }, [country]);

  const loadTransactions = (accountId) => {
    fetch(`/api/banking/accounts/${accountId}/transactions`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setTransactions)
      .catch(() => setTransactions([]));
  };

  useEffect(() => {
    if (!selected) {
      setTransactions([]);
      return;
    }
    loadTransactions(selected.id);
  }, [selected]);

  const addAccount = async (e) => {
    e.preventDefault();
    if (!accountForm.name || !accountForm.currency) return;
    setBusy(true);
    try {
      await fetch("/api/banking/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          name: accountForm.name,
          currency: accountForm.currency,
          balance: Number(accountForm.balance || 0),
        }),
      });
      setAccountForm(EMPTY_ACCOUNT);
      loadAccounts();
      toast("Account added", "ok");
    } catch {
      toast("Could not add account", "err");
    } finally {
      setBusy(false);
    }
  };

  const removeAccount = async (id) => {
    if (!window.confirm("Remove this account and all its transactions?")) return;
    await fetch(`/api/banking/accounts/${id}`, { method: "DELETE" }).catch(() => {});
    if (selected?.id === id) setSelected(null);
    loadAccounts();
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!selected || !txForm.label || !txForm.amount) return;
    setBusy(true);
    try {
      await fetch(`/api/banking/accounts/${selected.id}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_id: selected.id,
          label: txForm.label,
          amount: Number(txForm.amount),
          entry_date: txForm.entry_date,
        }),
      });
      setTxForm(EMPTY_TX);
      loadAccounts();
      loadTransactions(selected.id);
      toast("Transaction recorded", "ok");
    } catch {
      toast("Could not save transaction", "err");
    } finally {
      setBusy(false);
    }
  };

  const removeTransaction = async (txId) => {
    if (!selected) return;
    await fetch(`/api/banking/accounts/${selected.id}/transactions/${txId}`, { method: "DELETE" }).catch(() => {});
    loadAccounts();
    loadTransactions(selected.id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Bank accounts</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {accounts.map((a, i) => (
            <div
              key={a.id}
              className={i === 0 ? "card-ink" : "card"}
              style={{ padding: "20px", cursor: "pointer", outline: selected?.id === a.id ? "2px solid var(--color-brand)" : "none", position: "relative" }}
              onClick={() => setSelected(a)}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAccount(a.id);
                }}
                style={{
                  position: "absolute", top: "12px", right: "12px", fontSize: "11px", fontWeight: "700",
                  color: i === 0 ? "rgba(255,255,255,0.7)" : "var(--color-danger)",
                }}
              >
                Remove
              </button>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.14em", color: i === 0 ? "rgba(255,255,255,0.6)" : "var(--color-muted)" }}>
                  {a.currency} Account
                </p>
                <span style={{ fontSize: "16px" }}>{flag}</span>
              </div>
              <h3 style={{ marginTop: "8px", fontSize: "17px", fontWeight: "700" }}>{a.name}</h3>
              <p style={{ marginTop: "20px", fontSize: "28px", fontWeight: "800" }}>
                {a.currency} {a.balance.toLocaleString()}
              </p>
            </div>
          ))}
          {accounts.length === 0 ? (
            <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>No accounts yet for {country}.</p>
          ) : null}
        </div>

        <form onSubmit={addAccount} className="card" style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", alignItems: "end" }}>
          <Field label="account name">
            <BoxInput value={accountForm.name} onChange={(e) => setAccountForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="currency">
            <BoxInput value={accountForm.currency} onChange={(e) => setAccountForm((f) => ({ ...f, currency: e.target.value }))} placeholder={currency} />
          </Field>
          <Field label="opening balance">
            <BoxInput type="number" step="0.01" value={accountForm.balance} onChange={(e) => setAccountForm((f) => ({ ...f, balance: e.target.value }))} />
          </Field>
          <Button variant="brand" type="submit" loading={busy}>
            Add account
          </Button>
        </form>
      </div>

      {selected ? (
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>
            Transactions — {selected.name}
          </h2>
          <form onSubmit={addTransaction} className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", alignItems: "end", marginBottom: "16px" }}>
            <Field label="label">
              <BoxInput value={txForm.label} onChange={(e) => setTxForm((f) => ({ ...f, label: e.target.value }))} />
            </Field>
            <Field label="amount (+ deposit / − withdrawal)">
              <BoxInput type="number" step="0.01" value={txForm.amount} onChange={(e) => setTxForm((f) => ({ ...f, amount: e.target.value }))} />
            </Field>
            <Field label="date">
              <BoxInput type="date" value={txForm.entry_date} onChange={(e) => setTxForm((f) => ({ ...f, entry_date: e.target.value }))} />
            </Field>
            <Button variant="brand" type="submit" loading={busy}>
              Add transaction
            </Button>
          </form>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "24px 16px", textAlign: "center", color: "var(--color-muted)" }}>
                      No transactions yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.label}</td>
                      <td style={{ color: t.amount < 0 ? "var(--color-danger)" : "var(--color-success)", fontWeight: "600" }}>
                        {t.amount > 0 ? "+" : ""}{t.amount.toLocaleString()}
                      </td>
                      <td>{t.entry_date}</td>
                      <td>
                        <button type="button" onClick={() => removeTransaction(t.id)} style={{ color: "var(--color-danger)", fontSize: "12px", fontWeight: "600" }}>
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
      ) : null}
    </div>
  );
}
