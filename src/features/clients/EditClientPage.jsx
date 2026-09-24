import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { BoxInput, BoxSelect, Field } from "../../components/ui/Input";
import { toast } from "../../components/ui/Toast";
import { PASSPORT_FIELDS, BUSINESS_FIELDS } from "./fields";
import { withToken } from "../../store/auth";

const ALL_FIELDS = [...PASSPORT_FIELDS, ...BUSINESS_FIELDS, "visa_status"];

export function EditClientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => (r.ok ? r.json() : []))
      .then((clients) => {
        const found = (Array.isArray(clients) ? clients : []).find((c) => String(c.id) === String(id));
        if (found) {
          setForm(Object.fromEntries(ALL_FIELDS.map((k) => [k, found[k] ?? ""])));
          setPhotoUrl(found.user_photo ? withToken(found.user_photo) : "");
        } else {
          toast("Client not found", "err");
          navigate("/clients");
        }
      })
      .catch(() => toast("Could not load client", "err"));
  }, [id, navigate]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoUrl(URL.createObjectURL(file));
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const save = async () => {
    setBusy(true);
    try {
      const user_photo = photoFile ? await fileToDataUrl(photoFile) : "";
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_photo }),
      });
      if (!res.ok) throw new Error("fail");
      toast("Client updated", "ok");
      navigate(`/clients/${id}`);
    } catch {
      toast("Could not update client", "err");
    } finally {
      setBusy(false);
    }
  };

  if (!form) {
    return <p style={{ color: "var(--color-muted)" }}>Loading…</p>;
  }

  return (
    <div style={{ margin: "0 auto", maxWidth: "900px" }}>
      <Link to={`/clients/${id}`} style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-brand)" }}>
        ← Back to client
      </Link>
      <h1 style={{ marginTop: "16px", fontSize: "28px", fontWeight: "700" }}>Edit client</h1>

      <div className="card" style={{ marginTop: "20px" }}>
        <label className="upload-dropzone" style={{ display: "block" }}>
          <div style={{ fontWeight: "600", fontSize: "15px", color: "var(--color-ink)" }}>Replace client photo</div>
          <div style={{ marginTop: "4px", fontSize: "13px", color: "var(--color-muted)" }}>Optional</div>
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={onPhotoSelect} />
        </label>
        {photoUrl ? (
          <img src={photoUrl} alt="" className="preview-img-portrait" style={{ marginTop: "12px" }} />
        ) : null}

        <h2 style={{ marginTop: "32px", marginBottom: "8px", fontSize: "15px", fontWeight: "700", color: "var(--color-ink)" }}>
          Passport information
        </h2>
        <div className="grid-2">
          {PASSPORT_FIELDS.map((key) => (
            <Field key={key} label={key.replaceAll("_", " ")}>
              {key === "sex" ? (
                <BoxSelect value={form.sex} onChange={set("sex")}>
                  <option value="">Select</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                  <option value="X">X</option>
                </BoxSelect>
              ) : (
                <BoxInput type={key.includes("date") ? "date" : "text"} value={form[key]} onChange={set(key)} />
              )}
            </Field>
          ))}
        </div>

        <h2 style={{ marginTop: "32px", marginBottom: "8px", fontSize: "15px", fontWeight: "700", color: "var(--color-ink)" }}>
          Contact & business
        </h2>
        <div className="grid-2">
          <Field label="visa status">
            <BoxSelect value={form.visa_status} onChange={set("visa_status")}>
              <option value="">Select</option>
              <option value="not_started">Not started</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </BoxSelect>
          </Field>
          {BUSINESS_FIELDS.map((key) => (
            <Field key={key} label={key.replaceAll("_", " ")}>
              <BoxInput
                type={key === "prix_dossier" ? "number" : key === "email" ? "email" : "text"}
                value={form[key]}
                onChange={set(key)}
              />
            </Field>
          ))}
        </div>

        <div style={{ marginTop: "24px" }}>
          <Button variant="brand" loading={busy} onClick={save}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
