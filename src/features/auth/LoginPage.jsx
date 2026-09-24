import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Cast } from "../../components/Cast";
import { Button } from "../../components/ui/Button";
import { Field, UnderlineInput } from "../../components/ui/Input";
import { IconEye } from "../../components/ui/Icons";
import { toast } from "../../components/ui/Toast";
import { EASE, gsap, useGSAP } from "../../lib/gsap";
import { useAuth } from "../../store/auth";
import { useI18n } from "../../store/i18n";

export function LoginPage() {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const signup = useAuth((s) => s.signup);
  const login = useAuth((s) => s.login);
  const token = useAuth((s) => s.token);
  const t = useI18n((s) => s.t);

  const [mode, setMode] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reaction, setReaction] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    remember: true,
  });

  const play = (kind) => {
    setReaction(kind);
    setTimeout(() => setReaction(""), 700);
  };

  useGSAP(
    () => {
      const items = panelRef.current?.querySelectorAll("[data-enter]");
      if (!items?.length) return;
      gsap.from(items, {
        y: 14,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: EASE,
      });
    },
    { scope: panelRef, dependencies: [mode] }
  );

  if (token) return <Navigate to="/" replace />;

  const onChange = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.email.includes("@")) next.email = true;
    if (!form.password || form.password.length < (mode === "signup" ? 8 : 1)) next.password = true;
    if (mode === "signup" && !form.name.trim()) next.name = true;
    setErrors(next);
    if (Object.keys(next).length) {
      play("shake");
      toast(
        mode === "signup" && next.password
          ? "Password must be at least 8 characters"
          : "Please check the highlighted fields",
        "err"
      );
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await signup({ name: form.name, email: form.email, password: form.password });
        play("nod");
        toast(t("auth.pendingApproval"), "ok");
        setMode("login");
        setForm((f) => ({ ...f, password: "" }));
        return;
      }

      await login({
        email: form.email,
        password: form.password,
        remember: form.remember,
      });
      play("nod");
      toast(t("auth.welcomeBack"), "ok");
      navigate("/");
    } catch (err) {
      play("shake");
      toast(err.message || "Authentication failed", "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-view-wrapper">
      <div className="login-card">
        <div className="login-stage-container">
          <Cast reaction={reaction} />
        </div>

        <div ref={panelRef} className="login-panel">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <img src="./logo.png" className="login-logo" data-enter alt="Logo" />
            <p className="login-subtitle" data-enter>
              {mode === "signup" ? t("auth.signUpSubtitle") : t("auth.signInSubtitle")}
            </p>
          </div>

          <form className="login-form" onSubmit={submit} noValidate>
            {mode === "signup" ? (
              <Field label={t("auth.fullName")} error={errors.name}>
                <div data-enter>
                  <UnderlineInput
                    value={form.name}
                    onChange={onChange("name")}
                    placeholder="Your name"
                    error={errors.name}
                  />
                </div>
              </Field>
            ) : null}

            <Field label={t("auth.email")} error={errors.email}>
              <div data-enter>
                <UnderlineInput
                  value={form.email}
                  onChange={onChange("email")}
                  autoComplete="username"
                  placeholder="agent@gmail.com"
                  error={errors.email}
                />
              </div>
            </Field>

            <Field label={t("auth.password")} error={errors.password}>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
                data-enter
              >
                <UnderlineInput
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={onChange("password")}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  error={errors.password}
                />
                <button
                  type="button"
                  className="input-eye-toggle"
                  aria-label="Show password"
                  onClick={() => setShowPass((v) => !v)}
                >
                  <IconEye />
                </button>
              </div>
            </Field>

            {mode !== "signup" ? (
              <div className="login-row-remember" data-enter>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={onChange("remember")}
                  />
                  {t("auth.rememberMe")}
                </label>
              </div>
            ) : null}

            <div data-enter>
              <Button type="submit" variant="brand" loading={loading}>
                {mode === "signup" ? t("auth.requestAccount") : t("auth.signIn")}
              </Button>
            </div>

            <div className="signup-prompt-row" data-enter>
              {mode === "signup" ? t("auth.alreadyHaveAccount") : t("auth.dontHaveAccount")}{" "}
              <button
                type="button"
                className="signup-link-btn"
                onClick={() => {
                  setMode((m) => (m === "login" ? "signup" : "login"));
                  setErrors({});
                  play("nod");
                }}
              >
                {mode === "signup" ? t("auth.signIn") : t("auth.signUp")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
