// src/pages/MyRecipesPage.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../api";   // ✅ นำเข้าตัวแปร API_BASE

function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSaved = async () => {
      if (!token) {
        setLoading(false);
        setRecipes([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/saved-recipes`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load saved recipes.");
        } else {
          // รองรับหลายรูปแบบข้อมูล
          const list = Array.isArray(data)
            ? data
            : data.recipes || data.savedRecipes || [];
          setRecipes(list);
        }
      } catch (err) {
        setError("Error connecting to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [token]);

  // ถ้าไม่ได้ Login
  if (!token) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-1">What Will You Cook?</h1>
        <p className="text-sm text-gray-600 mb-6">
          All your saved recipes in one place.
        </p>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-semibold mb-2">My Recipes</h2>
          <p className="text-sm text-gray-500 mb-4">
            Please log in to see and manage your saved recipes.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-900 text-white hover:bg-black"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-1">What Will You Cook?</h1>
      <p className="text-sm text-gray-600 mb-6">
        All your saved recipes in one place — quick, smart, and simple.
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">My Recipes</h2>
            <p className="text-xs text-gray-500">
              Recipes you&apos;ve saved to cook again later.
            </p>
          </div>

          {recipes.length > 0 && (
            <p className="text-xs text-gray-500">
              Total{" "}
              <span className="font-medium text-gray-900">
                {recipes.length}
              </span>{" "}
              recipe{recipes.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {loading && (
          <p className="text-sm text-gray-600">Loading your recipes...</p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-600 mb-3">{error}</p>
        )}

        {!loading && !error && recipes.length === 0 && (
          <p className="text-sm text-gray-500">
            You don&apos;t have any saved recipes yet. Go back to Home and save
            some dishes you like!
          </p>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {recipes.map((item) => (
            <Link
              key={item._id}
              to={`/recipes/${item._id}`}
              className="group border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition-shadow hover:shadow-md"
            >
              <div className="h-32 bg-gray-200 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                  {item.name}
                </h3>

                {item.steps && (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {item.steps}
                  </p>
                )}

                {item.ingredients && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.ingredients.slice(0, 4).map((ing) => (
                      <span
                        key={ing}
                        className="px-2 py-0.5 rounded-full bg-white border text-[11px] text-gray-700"
                      >
                        {ing}
                      </span>
                    ))}
                    {item.ingredients.length > 4 && (
                      <span className="text-[11px] text-gray-400">
                        +{item.ingredients.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  className="mt-1 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-900 text-white group-hover:bg-black"
                >
                  View recipe →
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyRecipesPage;
