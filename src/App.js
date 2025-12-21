// src/App.js
// FORCE REBUILD 2025-12-21-V3-SESSION

import { useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchPage from "./pages/SearchPage";
import AddRecipePage from "./pages/AddRecipePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import MyRecipesPage from "./pages/MyRecipesPage";
import AccountPage from "./pages/AccountPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";

import { API_BASE } from "./api.js";

function App() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [meLoading, setMeLoading] = useState(true);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refreshingRef = useRef(false);

  const refreshMe = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;

    if (mountedRef.current) setMeLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        if (mountedRef.current) setMe(null);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (mountedRef.current) setMe(data.user ?? data);
    } catch {
      if (mountedRef.current) setMe(null);
    } finally {
      refreshingRef.current = false;
      if (mountedRef.current) setMeLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  // ✅ เวลา user สลับแท็บกลับมา ให้เช็ค session อีกรอบ (ช่วยกันเคส session เปลี่ยน)
  useEffect(() => {
    const onFocus = () => refreshMe();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshMe]);

  const updateToken = useCallback(async () => {
    await refreshMe();
  }, [refreshMe]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch {
      // ignore
    } finally {
      setMe(null);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const isAuthed = !!me;

  return (
    <div className="min-h-screen flex flex-col app-bg">
      {/* NAVBAR */}
      <nav className="app-nav">
        <div className="w-full px-8 py-3 flex items-center justify-between">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true" />
            <span style={{ fontSize: 18 }}>What Will You Cook?</span>
          </Link>

          <div className="flex items-center space-x-6 text-base">
            <Link to="/" className="nav-link">
              Home
            </Link>

            {isAuthed ? (
              <Link to="/my-recipes" className="nav-link">
                My Recipes
              </Link>
            ) : (
              <span className="muted" style={{ opacity: 0.65 }} title="Log in to view your recipes">
                My Recipes
              </span>
            )}

            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>

            <span className="h-5 w-px" style={{ background: "var(--border)" }} />

            {!isAuthed && meLoading && (
              <span className="muted" style={{ fontSize: 12 }}>
                Checking session...
              </span>
            )}

            {!isAuthed && !meLoading && (
              <>
                <Link to="/login" className="btn">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}

            {isAuthed && (
              <>
                <button onClick={() => navigate("/account")} className="btn btn-primary">
                  My Account
                </button>
                <button onClick={handleLogout} className="btn">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="py-8 flex-1">
        <Routes>
          <Route path="/" element={<SearchPage me={me} meLoading={meLoading} />} />
          <Route path="/search" element={<SearchPage me={me} meLoading={meLoading} />} />

          <Route path="/my-recipes" element={<MyRecipesPage me={me} meLoading={meLoading} />} />

          {/* ✅ ส่ง me/meLoading ให้ RecipeDetailPage ด้วย */}
          <Route path="/recipes/:id" element={<RecipeDetailPage me={me} meLoading={meLoading} />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ✅ แนะนำส่ง me/meLoading ให้ AccountPage ด้วย (ถ้าหน้านี้อยากใช้ state กลาง) */}
          <Route path="/account" element={<AccountPage me={me} meLoading={meLoading} />} />

          <Route path="/login" element={<Login updateToken={updateToken} />} />
          <Route path="/register" element={<Register />} />

          <Route path="/add-recipe" element={<AddRecipePage me={me} meLoading={meLoading} />} />

          {/* fallback */}
          <Route path="*" element={<SearchPage me={me} meLoading={meLoading} />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-center muted">
          <p style={{ margin: 0 }}>© 2025 What Will You Cook — Cook smarter with what you have.</p>
          <p className="mt-1" style={{ marginBottom: 0 }}>
            <button type="button" className="btn btn-ghost" style={{ padding: "6px 10px" }}>
              Privacy Policy
            </button>
            <span className="mx-1" style={{ color: "var(--border)" }}>
              |
            </span>
            <button type="button" className="btn btn-ghost" style={{ padding: "6px 10px" }}>
              Terms of Service
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
