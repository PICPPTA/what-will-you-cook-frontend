// FORCE REBUILD 2025-12-17-V15
import "./forceRebuild.js";

import { useState, useEffect } from "react";
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

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const updateToken = () => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200">
        <div className="w-full px-8 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="font-semibold text-xl tracking-tight text-gray-900"
          >
            What Will You Cook?
          </Link>

          <div className="flex items-center space-x-6 text-base">
            <Link to="/" className="hover:text-gray-900 text-gray-700">
              Home
            </Link>

            {token ? (
              <Link to="/my-recipes" className="hover:text-gray-900 text-gray-700">
                My Recipes
              </Link>
            ) : (
              <span
                className="text-gray-400 cursor-not-allowed"
                title="Log in to view your recipes"
              >
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

            {!token && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm border rounded-full hover:bg-gray-50"
                >
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

            {token && (
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

          <Route path="/my-recipes" element={<MyRecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />

          <Route path="/login" element={<Login updateToken={updateToken} />} />
          <Route path="/register" element={<Register />} />

          <Route path="/add-recipe" element={<AddRecipePage />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-500 text-center">
          <p>© 2025 What Will You Cook — Cook smarter with what you have.</p>
          <p className="mt-1">
            <button
              type="button"
              className="hover:text-gray-700 underline underline-offset-2"
            >
              Privacy Policy
            </button>
            <span className="mx-1 text-gray-400">|</span>
            <button
              type="button"
              className="hover:text-gray-700 underline underline-offset-2"
            >
              Terms of Service
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
