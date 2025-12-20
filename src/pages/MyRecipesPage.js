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

      // ยังเช็ค session อยู่ -> อย่าเพิ่งทำอะไร
      if (meLoading) return;

      // ไม่ได้ login -> ไม่ต้อง fetch
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
      <h1 className="text-3xl font-semibold mb-1">What Will You Cook?</h1>
      <p className="text-sm text-gray-600 mb-6">
        All your shared recipes in one place.
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">My Recipes</h2>
            <p className="text-sm text-gray-600">
              Manage recipes you have shared.
            </p>
          </div>

          {me && (
            <Link
              to="/add-recipe"
              className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-900 text-white hover:bg-black"
            >
              + Add Recipe
            </Link>
          )}
        </div>

        <div className="mt-5">
          {meLoading && (
            <p className="text-sm text-gray-500">Checking session...</p>
          )}

          {!meLoading && !me && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-700 mb-3">
                Please log in to see and manage your recipes.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-900 text-white hover:bg-black"
              >
                Log in
              </Link>
            </div>
          )}

          {me && loading && (
            <p className="text-sm text-gray-500">Loading recipes...</p>
          )}

          {me && error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {me && !loading && !error && recipes.length === 0 && (
            <p className="text-sm text-gray-600">
              You haven&apos;t shared any recipes yet.
              <Link to="/add-recipe" className="ml-1 underline">
                Add your first recipe
              </Link>
            </p>
          )}

          {me && recipes.length > 0 && (
            <ul className="mt-3 grid gap-3">
              {recipes.map((r) => (
                <li
                  key={r._id}
                  className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50"
                >
                  <Link to={`/recipes/${r._id}`} className="font-medium">
                    {r.name}
                  </Link>
                  <div className="text-xs text-gray-500 mt-1">
                    {Array.isArray(r.ingredients)
                      ? r.ingredients.slice(0, 8).join(", ")
                      : ""}
                    {Array.isArray(r.ingredients) && r.ingredients.length > 8
                      ? " …"
                      : ""}
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
