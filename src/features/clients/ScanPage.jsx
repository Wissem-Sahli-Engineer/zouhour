import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { BoxInput, BoxSelect, Field } from "../../components/ui/Input";
import { toast } from "../../components/ui/Toast";

const EMPTY = {
  country: "",
  passport_number: "",
  type: "",
  nationality: "",
  given_name: "",
  surname: "",
  date_of_birth: "",
  sex: "",
  place_of_birth: "",
  date_of_issue: "",
  date_of_expiry: "",
  issued_by: "",
};

export function ScanPage() {
  const [form, setForm] = useState(EMPTY);
  const [passportUrl, setPassportUrl] = useState("");
  const [photo, setPhoto] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPassportUrl(URL.createObjectURL(file));
    setStatus("Extracting with Qwen2.5-VL…");
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("/api/extract", { method: "POST", body });
      if (!res.ok) throw new Error("fail");
      const data = await res.json();
      setForm((f) => ({ ...f, ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, data[k] || ""])) }));
      setPhoto(data.user_photo || "");
      setStatus("Extracted.");
      toast("Passport details extracted!", "ok");
    } catch {
      setStatus("Extraction failed. Is the backend running on :8001?");
      toast("Failed to extract passport", "err");
    }
  };

  const save = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_photo: photo }),
      });
      if (!res.ok) throw new Error("fail");
      toast("Client saved", "ok");
    } catch {
      toast("Could not save client", "err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ margin: "0 auto", maxWidth: "900px" }}>
      <Link to="/clients" style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-brand)" }}>
        ← Clients
      </Link>
      <h1 style={{ marginTop: "16px", fontSize: "28px", fontWeight: "700" }}>Scan passport</h1>
      <p style={{ marginBottom: "24px", fontSize: "14px", color: "var(--color-muted)" }}>
        Same extraction flow as before — now inside the clients module.
      </p>

      <div className="card">
        <label className="upload-dropzone" style={{ display: "block" }}>
          <div style={{ fontWeight: "600", fontSize: "15px", color: "var(--color-ink)" }}>Upload passport image</div>
          <div style={{ marginTop: "4px", fontSize: "13px", color: "var(--color-muted)" }}>PNG, JPG — Qwen2.5-VL</div>
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={onFile} />
        </label>
        {status ? (
          <p style={{ marginTop: "12px", textAlign: "center", fontSize: "12.5px", color: "var(--color-muted)" }}>
            {status}
          </p>
        ) : null}

        <div className="preview-grid" style={{ marginTop: "24px" }}>
          <div className="preview-box">
            <label>Original</label>
            {passportUrl ? (
              <img src={passportUrl} alt="" className="preview-img-passport" />
            ) : (
              <div
                className="preview-img-passport flex-center"
                style={{ fontSize: "12px", color: "var(--color-muted)" }}
              >
                Waiting
              </div>
            )}
          </div>
          {photo ? (
            <div className="preview-box">
              <label>Portrait</label>
              <img src={photo} alt="" className="preview-img-portrait" />
            </div>
          ) : null}
        </div>

        <div className="grid-2" style={{ marginTop: "32px" }}>
          {Object.keys(EMPTY).map((key) => (
            <Field key={key} label={key.replaceAll("_", " ")}>
              {key === "sex" ? (
                <BoxSelect value={form.sex} onChange={set("sex")}>
                  <option value="">Select</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                  <option value="X">X</option>
                </BoxSelect>
              ) : (
                <BoxInput
                  type={key.includes("date") ? "date" : "text"}
                  value={form[key]}
                  onChange={set(key)}
                />
              )}
            </Field>
          ))}
        </div>
        <div style={{ marginTop: "8px" }}>
          <Button variant="brand" loading={busy} onClick={save}>
            Save client to database
          </Button>
        </div>
      </div>
    </div>
  );
}
