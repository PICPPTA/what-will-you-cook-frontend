// src/pages/MyRecipesPage.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../api.js";

function MyRecipesPage({ me, meLoading }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setError("");

      if (meLoading) return;

      if (!me) {
        setRecipes([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/recipes/my`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load recipes");
        }

        if (!cancelled) setRecipes(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Server error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [me, meLoading]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="py-8">
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>My Recipes</h1>
        <p className="muted" style={{ marginTop: 8 }}>
          All your shared recipes in one place.
        </p>
      </section>

      <div className="app-card p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Manage recipes</h2>
            <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>
              Recipes you have shared.
            </p>
          </div>

          {me && (
            <Link to="/add-recipe" className="btn btn-primary">
              + Add Recipe
            </Link>
          )}
        </div>

        <div className="mt-5">
          {meLoading && <p className="muted" style={{ fontSize: 13 }}>Checking session...</p>}

          {!meLoading && !me && (
            <div className="app-card p-4" style={{ boxShadow: "none" }}>
              <p style={{ fontSize: 13, margin: 0 }}>
                Please log in to see and manage your recipes.
              </p>
              <Link to="/login" className="btn btn-primary mt-3" style={{ width: "fit-content" }}>
                Log in
              </Link>
            </div>
          )}

          {me && loading && <p className="muted" style={{ fontSize: 13 }}>Loading recipes...</p>}

          {me && error && <div className="alert alert-error mt-3">{error}</div>}

          {me && !loading && !error && recipes.length === 0 && (
            <p className="muted" style={{ fontSize: 13 }}>
              You haven&apos;t shared any recipes yet.{" "}
              <Link to="/add-recipe" className="nav-link" style={{ fontWeight: 800, textDecoration: "underline", textUnderlineOffset: 3 }}>
                Add your first recipe
              </Link>
            </p>
          )}

          {me && recipes.length > 0 && (
            <ul className="mt-4 grid gap-3">
              {recipes.map((r) => (
                <li key={r._id} className="app-card p-4" style={{ boxShadow: "none" }}>
                  <Link to={`/recipes/${r._id}`} style={{ fontWeight: 800 }}>
                    {r.name}
                  </Link>
                  <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                    {Array.isArray(r.ingredients) ? r.ingredients.slice(0, 8).join(", ") : ""}
                    {Array.isArray(r.ingredients) && r.ingredients.length > 8 ? " …" : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyRecipesPage;
