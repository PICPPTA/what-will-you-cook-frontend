// src/App.js
// FORCE REBUILD 2025-12-21-V1-FIX

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

  // ✅ กัน setState หลัง unmount (เริ่ม true แล้วปิดตอน unmount)
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ✅ กันเรียก /auth/me ซ้อนกัน
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
    } catch (err) {
      if (mountedRef.current) setMe(null);
    } finally {
      // ✅ สำคัญ: reset เสมอ ไม่ให้ค้างว่า "กำลัง refresh"
      refreshingRef.current = false;
      if (mountedRef.current) setMeLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  // ส่งให้ Login เรียกหลัง login สำเร็จ
  const updateToken = async () => {
    await refreshMe();
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch (e) {
      // ignore
    } finally {
      setMe(null);
      navigate("/login", { replace: true });
    }
  };

  const isAuthed = !!me;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200">
        <div className="w-full px-8 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold text-xl tracking-tight text-gray-900">
            What Will You Cook?
          </Link>

          <div className="flex items-center space-x-6 text-base">
            <Link to="/" className="hover:text-gray-900 text-gray-700">
              Home
            </Link>

            {isAuthed ? (
              <Link to="/my-recipes" className="hover:text-gray-900 text-gray-700">
                My Recipes
              </Link>
            ) : (
              <span className="text-gray-400 cursor-not-allowed" title="Log in to view your recipes">
                My Recipes
              </span>
            )}

            <Link to="/about" className="hover:text-gray-900 text-gray-700">
              About
            </Link>
            <Link to="/contact" className="hover:text-gray-900 text-gray-700">
              Contact
            </Link>

            <span className="h-5 w-px bg-gray-200" />

            {!isAuthed && meLoading && (
              <span className="text-gray-400 text-sm">Checking session...</span>
            )}

            {!isAuthed && !meLoading && (
              <>
                <Link to="/login" className="px-4 py-1.5 text-sm border rounded-full hover:bg-gray-50">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm rounded-full bg-black text-white hover:bg-gray-800"
                >
                  Sign Up
                </Link>
              </>
            )}

            {isAuthed && (
              <>
                <button
                  onClick={() => navigate("/account")}
                  className="px-3 py-1.5 text-xs rounded-full bg-gray-900 text-white hover:bg-gray-800"
                >
                  My Account
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs border rounded-full hover:bg-gray-50"
                >
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
          <Route path="/" element={<SearchPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* ✅ ส่ง me + meLoading ให้ MyRecipesPage */}
          <Route path="/my-recipes" element={<MyRecipesPage me={me} meLoading={meLoading} />} />

          <Route path="/recipes/:id" element={<RecipeDetailPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />

          <Route path="/login" element={<Login updateToken={updateToken} />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ ส่ง me + meLoading ให้ AddRecipePage */}
          <Route path="/add-recipe" element={<AddRecipePage me={me} meLoading={meLoading} />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-500 text-center">
          <p>© 2025 What Will You Cook — Cook smarter with what you have.</p>
          <p className="mt-1">
            <button type="button" className="hover:text-gray-700 underline underline-offset-2">
              Privacy Policy
            </button>
            <span className="mx-1 text-gray-400">|</span>
            <button type="button" className="hover:text-gray-700 underline underline-offset-2">
              Terms of Service
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
