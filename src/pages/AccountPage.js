// src/pages/AccountPage.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../api.js";

function AccountPage() {
  const [user, setUser] = useState(null);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        // 1) ตรวจสถานะ login จาก cookie
        const meRes = await fetch(`${API_BASE}/auth/me`, {
          method: "GET",
          credentials: "include",
          cache: "no-store", // ✅ กัน cache
        });

        if (!meRes.ok) {
          setUser(null);
          setMyRecipes([]);
          return;
        }

        const meData = await meRes.json().catch(() => ({}));
        const meUser = meData.user ?? meData;
        setUser(meUser);

        // 2) โหลดเมนูของฉัน
        const myRes = await fetch(`${API_BASE}/recipes/my`, {
          method: "GET",
          credentials: "include",
          cache: "no-store", // ✅ กัน cache
        });

        if (myRes.ok) {
          const recipes = await myRes.json().catch(() => []);
          setMyRecipes(Array.isArray(recipes) ? recipes : []);
        } else {
          setMyRecipes([]);
        }
      } catch (err) {
        console.error("Load account error:", err);
        setUser(null);
        setMyRecipes([]);
      } finally {
        // ✅ กัน loading ค้างเสมอ
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSaveRecipe = async (recipeId) => {
    try {
      const res = await fetch(`${API_BASE}/saved-recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ recipeId }),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }
    } catch (err) {
      console.error("Save from account error:", err);
    }
  };

  const displayName = user?.name || (loading ? "Loading..." : "My Account");
  const displayEmail = user?.email || "";

  const stats = {
    followers: 0,
    following: 0,
    recipesShared: myRecipes.length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-semibold mb-1">What Will You Cook?</h1>
          <p className="text-sm text-gray-600">
            Find dishes you can make from the ingredients you already have —
            quick, smart, and simple.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden" />
              <div>
                <h2 className="text-xl font-semibold">{displayName}</h2>
                <p className="text-xs text-gray-500">{displayEmail}</p>

                {!loading && !user && (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="mt-2 text-xs rounded-full bg-gray-900 text-white px-3 py-1.5 hover:bg-black"
                  >
                    Log in
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-8 text-sm text-gray-700">
              <div className="text-center">
                <p className="font-semibold">{stats.followers}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{stats.following}</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{stats.recipesShared}</p>
                <p className="text-xs text-gray-500">Recipes Shared</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-1">About</h3>
            <p className="text-sm text-gray-600">
              Home cook who loves experimenting with Asian fusion dishes. Always
              looking for new flavor combinations!
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">My Shared Recipes</h3>

              <button
                onClick={() => navigate("/add-recipe")}
                className="hidden md:inline-flex px-3 py-1.5 text-xs rounded-full bg-gray-900 text-white hover:bg-black disabled:opacity-60"
                disabled={!user}
                title={!user ? "Please log in first" : ""}
              >
                + Add Recipe
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">Loading your recipes...</p>
            ) : !user ? (
              <p className="text-sm text-gray-500">
                Please log in to view your shared recipes.
              </p>
            ) : myRecipes.length === 0 ? (
              <p className="text-sm text-gray-500">
                You haven&apos;t shared any recipes yet.&nbsp;
                <button
                  type="button"
                  onClick={() => navigate("/add-recipe")}
                  className="text-gray-900 font-medium underline underline-offset-2"
                >
                  Add your first recipe →
                </button>
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {myRecipes.map((recipe) => {
                  const description =
                    recipe.description || recipe.steps || "No description yet.";

                  return (
                    <article
                      key={recipe._id}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col"
                    >
                      <div className="h-40 bg-gray-200 overflow-hidden">
                        {recipe.imageUrl ? (
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>

                      <div className="p-4 space-y-2 flex-1 flex flex-col">
                        <h4 className="font-semibold text-sm">{recipe.name}</h4>
                        <p className="text-xs text-gray-600">
                          {typeof description === "string"
                            ? description.slice(0, 160)
                            : ""}
                        </p>

                        {Array.isArray(recipe.ingredients) &&
                          recipe.ingredients.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {recipe.ingredients.slice(0, 8).map((ing, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-700"
                                >
                                  {ing}
                                </span>
                              ))}
                            </div>
                          )}

                        <div className="mt-3 flex gap-2">
                          <Link
                            to={`/recipes/${recipe._id}`}
                            className="flex-1 text-center text-xs rounded-full bg-gray-900 text-white py-1.5 hover:bg-black"
                          >
                            View Recipe
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleSaveRecipe(recipe._id)}
                            className="flex-1 text-xs rounded-full border py-1.5 hover:bg-gray-50"
                          >
                            Save Recipe
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AccountPage;
