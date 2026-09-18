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
    <div className="mx-auto max-w-[900px]">
      <Link to="/clients" className="text-[13px] font-semibold text-brand">
        ← Clients
      </Link>
      <h1 className="mt-4 text-[28px] font-bold">Scan passport</h1>
      <p className="mb-6 text-[14px] text-muted">Same extraction flow as before — now inside the clients module.</p>

      <div className="rounded-card bg-white p-8">
        <label className="block cursor-pointer rounded-drop border-2 border-dashed border-[#d1d5db] bg-[#fafafa] px-6 py-8 text-center hover:border-brand hover:bg-[#f5f3ff]">
          <div className="font-semibold">Upload passport image</div>
          <div className="mt-1 text-[13px] text-muted">PNG, JPG — Qwen2.5-VL</div>
          <input type="file" accept="image/*" className="hidden" onChange={onFile} />
        </label>
        {status ? <p className="mt-3 text-center text-[12.5px] text-muted">{status}</p> : null}

        <div className="mt-6 flex flex-wrap justify-center gap-6">
          <div className="text-center">
            <p className="mb-2 text-[13px] font-semibold text-muted">Original</p>
            {passportUrl ? (
              <img src={passportUrl} alt="" className="h-[130px] w-[200px] rounded-[14px] border-2 border-line object-cover" />
            ) : (
              <div className="flex h-[130px] w-[200px] items-center justify-center rounded-[14px] border-2 border-line bg-surface text-[12px] text-muted">
                Waiting
              </div>
            )}
          </div>
          {photo ? (
            <div className="text-center">
              <p className="mb-2 text-[13px] font-semibold text-muted">Portrait</p>
              <img src={photo} alt="" className="h-[130px] w-[110px] rounded-[14px] border-2 border-brand object-cover" />
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
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
        <Button className="mt-2" loading={busy} onClick={save}>
          Save client to database
        </Button>
      </div>
    </div>
  );
}
