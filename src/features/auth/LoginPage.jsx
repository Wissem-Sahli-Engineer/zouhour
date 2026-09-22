import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Cast } from "../../components/Cast";
import { Button } from "../../components/ui/Button";
import { Field, UnderlineInput } from "../../components/ui/Input";
import { IconEye } from "../../components/ui/Icons";
import { toast } from "../../components/ui/Toast";
import { EASE, gsap, useGSAP } from "../../lib/gsap";
import { useAuth } from "../../store/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const signup = useAuth((s) => s.signup);
  const login = useAuth((s) => s.login);
  const token = useAuth((s) => s.token);

  const [mode, setMode] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reaction, setReaction] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "wissem@gmail.com",
    password: "azerty",
    role: "Agent",
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
    if (!form.password || form.password.length < 3) next.password = true;
    if (mode === "signup") {
      if (!form.name.trim()) next.name = true;
    }
    setErrors(next);
    if (Object.keys(next).length) {
      play("shake");
      toast("Please check the highlighted fields", "err");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await signup({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          remember: form.remember,
        });
        play("nod");
        toast("Account created and saved to admin.json!", "ok");
        navigate("/");
        return;
      }

      await login({
        email: form.email,
        password: form.password,
        remember: form.remember,
      });
      play("nod");
      toast("Welcome back!", "ok");
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
              {mode === "signup"
                ? "Sign up to add your account to admin.json"
                : "Sign in with admin.json credentials"}
            </p>
          </div>

          <form className="login-form" onSubmit={submit} noValidate>
            {mode === "signup" ? (
              <Field label="Full name" error={errors.name}>
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

            <Field label="Email" error={errors.email}>
              <div data-enter>
                <UnderlineInput
                  value={form.email}
                  onChange={onChange("email")}
                  autoComplete="username"
                  placeholder="agent@zouhour.com"
                  error={errors.email}
                />
              </div>
            </Field>

            <Field label="Password" error={errors.password}>
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

            {mode === "signup" ? (
              <Field label="Role">
                <div data-enter>
                  <UnderlineInput
                    value={form.role}
                    onChange={onChange("role")}
                    placeholder="Agent / Officer / Admin"
                  />
                </div>
              </Field>
            ) : (
              <div className="login-row-remember" data-enter>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={onChange("remember")}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => {
                    play("nod");
                    toast(
                      `Check credentials in admin.json`,
                      "ok"
                    );
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <div data-enter>
              <Button type="submit" variant="brand" loading={loading}>
                {mode === "signup" ? "Sign up" : "Sign in"}
              </Button>
            </div>

            <div className="signup-prompt-row" data-enter>
              {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                className="signup-link-btn"
                onClick={() => {
                  setMode((m) => (m === "login" ? "signup" : "login"));
                  setErrors({});
                  play("nod");
                }}
              >
                {mode === "signup" ? "Sign in" : "Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
