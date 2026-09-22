import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Cast } from "../../components/Cast";
import { Button } from "../../components/ui/Button";
import { Field, UnderlineInput } from "../../components/ui/Input";
import { IconEye, LogoMark } from "../../components/ui/Icons";
import { toast } from "../../components/ui/Toast";
import { EASE, gsap, useGSAP } from "../../lib/gsap";
import { useAuth } from "../../store/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const requestSignup = useAuth((s) => s.requestSignup);
  const login = useAuth((s) => s.login);
  const token = useAuth((s) => s.token);
  const signupPending = useAuth((s) => s.signupPending);
  const signupEmail = useAuth((s) => s.signupEmail);
  const clearSignupPending = useAuth((s) => s.clearSignupPending);

  const [mode, setMode] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reaction, setReaction] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "demo@example.com",
    password: "password123",
    company: "",
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
    { scope: panelRef, dependencies: [mode, signupPending] }
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
    if (form.password.length < 6) next.password = true;
    if (mode === "signup") {
      if (!form.name.trim()) next.name = true;
      if (!form.company.trim()) next.company = true;
    }
    setErrors(next);
    if (Object.keys(next).length) {
      play("shake");
      toast("Please check the highlighted fields", "err");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 550));
    setLoading(false);

    if (mode === "signup") {
      await requestSignup({
        name: form.name,
        email: form.email,
        password: form.password,
        company: form.company,
        role: form.role,
      });
      play("nod");
      toast("Request sent to admin", "ok");
      return;
    }

    login({ email: form.email, remember: form.remember });
    play("nod");
    toast("Welcome to Zouhour Agency!", "ok");
    navigate("/");
  };

  return (
    <div className="login-view-wrapper">
      <div className="login-card">
        <div className="login-stage-container">
          <Cast reaction={reaction} />
        </div>

        <div ref={panelRef} className="login-panel">
          {signupPending ? (
            <div style={{ width: "100%", textAlign: "left" }} data-enter>
              <LogoMark size={36} className="login-logo" />
              <h1 className="login-title">Request sent</h1>
              <p className="login-subtitle">
                We emailed an admin about <strong style={{ color: "var(--color-ink)" }}>{signupEmail}</strong>. You’ll get access after approval — no account is created yet.
              </p>
              <Button
                variant="brand"
                onClick={() => {
                  clearSignupPending();
                  setMode("login");
                }}
              >
                Back to sign in
              </Button>
            </div>
          ) : (
            <>
              <LogoMark size={36} className="login-logo" data-enter />
              <h1 className="login-title" data-enter>
                Zouhour Agency
              </h1>
              <p className="login-subtitle" data-enter>
                {mode === "signup"
                  ? "Request access — an admin will approve your account"
                  : "Sign in to manage client visa applications"}
              </p>

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
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }} data-enter>
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
                  <>
                    <Field label="Company" error={errors.company}>
                      <div data-enter>
                        <UnderlineInput
                          value={form.company}
                          onChange={onChange("company")}
                          placeholder="Zouhour Visa Agency"
                          error={errors.company}
                        />
                      </div>
                    </Field>
                    <Field label="Role">
                      <div data-enter>
                        <UnderlineInput
                          value={form.role}
                          onChange={onChange("role")}
                          placeholder="Agent / Officer"
                        />
                      </div>
                    </Field>
                  </>
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
                        toast(`Password reset link sent to ${form.email || "your email"}`, "ok");
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <div data-enter>
                  <Button type="submit" variant="brand" loading={loading}>
                    {mode === "signup" ? "Request access" : "Sign in"}
                  </Button>
                </div>

                {mode === "login" ? (
                  <div style={{ marginTop: "10px" }} data-enter>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        login({ email: form.email || "demo@example.com", remember: form.remember });
                        play("nod");
                        toast("Signed in with Google!", "ok");
                        navigate("/");
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden style={{ marginRight: "8px" }}>
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      Continue with Google
                    </Button>
                  </div>
                ) : null}

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
