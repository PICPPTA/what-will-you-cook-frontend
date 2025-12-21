// src/pages/Register.js
// force rebuild 2025-12-11

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../api.js";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Register failed. Please try again.");
        return;
      }

      setSuccess("Account created! You can now log in.");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err) {
      console.error(err);
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
            Create your cooking account
          </h1>
          <p className="muted" style={{ fontSize: 13, textAlign: "center", marginTop: 8 }}>
            Sign up to save recipes, track your favorites, and discover new ideas.
          </p>

          {error && <div className="alert alert-error mt-4">{error}</div>}
          {success && <div className="alert alert-success mt-4">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            <div>
              <label className="muted" style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>
                Name
              </label>
              <input
                type="text"
                className="input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="muted" style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>
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
              <label className="muted" style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                className="input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>
        </div>

        <p className="muted" style={{ textAlign: "center", fontSize: 12, marginTop: 14 }}>
          Already have an account?{" "}
          <Link to="/login" className="nav-link" style={{ fontWeight: 800, textDecoration: "underline", textUnderlineOffset: 3 }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
