// src/pages/Login.js
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { API_BASE } from "../api.js";

function Login({ updateToken }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ถ้ามาจากหน้าก่อนหน้า (เช่น /recipes/:id) จะถูกส่งมาใน state.from
  const from = location.state?.from || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailTrim = String(email).trim();
    const passwordTrim = String(password).trim();

    if (!emailTrim || !passwordTrim) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ email: emailTrim, password: passwordTrim }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      if (typeof updateToken === "function") {
        try {
          await updateToken();
        } catch {
          // ignore
        }
      }

      // ✅ กลับไปหน้าที่มาก่อน
      navigate(from, { replace: true });
    } catch (err) {
      setError("Error connecting to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="app-card p-8">
          <h1 style={{ fontSize: 22, fontWeight: 800, textAlign: "center", margin: 0 }}>
            Log in to your kitchen
          </h1>
          <p className="muted" style={{ fontSize: 13, textAlign: "center", marginTop: 8 }}>
            Welcome back! Enter your details to continue saving and exploring recipes.
          </p>

          {error && <div className="alert alert-error mt-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            <div>
              <label
                className="muted"
                style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}
              >
                Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div>
              <label
                className="muted"
                style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}
              >
                Password
              </label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <p className="muted" style={{ textAlign: "center", fontSize: 12, marginTop: 14 }}>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="nav-link"
            style={{ fontWeight: 800, textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
