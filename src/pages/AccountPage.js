// src/pages/AccountPage.js
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../api.js";

function AccountPage({ me, meLoading }) {
  const navigate = useNavigate();

  const [myRecipes, setMyRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  const [msg, setMsg] = useState("");
  const [savingId, setSavingId] = useState(null);

  // ชื่อ/อีเมลจาก me (source-of-truth จาก App.js)
  const displayName = useMemo(() => {
    if (meLoading) return "Loading...";
    if (!me) return "My Account";
    return me.name || "User";
  }, [me, meLoading]);

  const displayEmail = useMemo(() => {
    if (!me) return "";
    return me.email || "";
  }, [me]);

  const stats = useMemo(() => {
    return {
      followers: 0,
      following: 0,
      recipesShared: Array.isArray(myRecipes) ? myRecipes.length : 0,
    };
  }, [myRecipes]);

  // โหลด my recipes เมื่อรู้ผล session แล้ว และ me มีค่า
  useEffect(() => {
    let alive = true;

    const loadMyRecipes = async () => {
      setMsg("");

      // ยังเช็ค session อยู่ → ยังไม่ทำอะไร
      if (meLoading) return;

      // guest → เคลียร์และจบ
      if (!me) {
        if (!alive) return;
        setMyRecipes([]);
        setLoadingRecipes(false);
        return;
      }

      try {
        if (!alive) return;
        setLoadingRecipes(true);

        const myRes = await fetch(`${API_BASE}/recipes/my`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!alive) return;

        if (myRes.status === 401) {
          // session หลุด
          setMyRecipes([]);
          setMsg("Session expired. Please log in again.");
          setLoadingRecipes(false);
          navigate("/login", { replace: true });
          return;
        }

        if (myRes.ok) {
          const recipes = await myRes.json().catch(() => []);
          setMyRecipes(Array.isArray(recipes) ? recipes : []);
        } else {
          setMyRecipes([]);
          const data = await myRes.json().catch(() => ({}));
          setMsg(data.message || "Failed to load your recipes.");
        }
      } catch (err) {
        if (!alive) return;
        console.error("Load account error:", err);
        setMyRecipes([]);
        setMsg("Cannot connect to server.");
      } finally {
        if (!alive) return;
        setLoadingRecipes(false);
      }
    };

    loadMyRecipes();

    return () => {
      alive = false;
    };
  }, [me, meLoading, navigate]);

  // Save recipe
  const handleSaveRecipe = async (recipeId) => {
    setMsg("");

    // ยังเช็ค session อยู่
    if (meLoading) return;

    // guest → ไป login
    if (!me) {
      setMsg("Please log in first.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      setSavingId(recipeId);

      const res = await fetch(`${API_BASE}/saved-recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ recipeId }),
      });

      if (res.status === 401) {
        setMsg("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data.message || "Failed to save recipe.");
        return;
      }

      setMsg("Saved successfully!");
    } catch (err) {
      console.error("Save from account error:", err);
      setMsg("Cannot connect to server.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="py-8">
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0 }}>My Account</h1>
        <p className="muted" style={{ marginTop: 10 }}>
          Your profile and recipes in one place.
        </p>
      </section>

      <div className="app-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="brand-mark"
              style={{ width: 64, height: 64, borderRadius: 999 }}
              aria-hidden="true"
            />
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>
                {displayName}
              </h2>
              <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                {displayEmail}
              </p>

              {!meLoading && !me && (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="btn btn-primary mt-2"
                >
                  Log in
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            <div className="text-center">
              <p style={{ fontWeight: 900, margin: 0 }}>{stats.followers}</p>
              <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                Followers
              </p>
            </div>
            <div className="text-center">
              <p style={{ fontWeight: 900, margin: 0 }}>{stats.following}</p>
              <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                Following
              </p>
            </div>
            <div className="text-center">
              <p style={{ fontWeight: 900, margin: 0 }}>{stats.recipesShared}</p>
              <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                Recipes Shared
              </p>
            </div>
          </div>
        </div>

        {msg && (
          <div className="app-card p-4 mt-4" style={{ boxShadow: "none" }}>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              {msg}
            </p>
          </div>
        )}

        <div className="mt-6">
          <h3 style={{ fontSize: 13, fontWeight: 900, marginBottom: 6 }}>
            About
          </h3>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            Home cook who loves experimenting with Asian fusion dishes. Always looking for new flavor combinations!
          </p>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 style={{ fontSize: 13, fontWeight: 900, margin: 0 }}>
              My Shared Recipes
            </h3>

            <button
              onClick={() => navigate("/add-recipe")}
              className="btn btn-primary"
              disabled={meLoading || !me}
              title={!me ? "Please log in first" : ""}
            >
              + Add Recipe
            </button>
          </div>

          {meLoading ? (
            <p className="muted" style={{ fontSize: 13 }}>
              Checking session...
            </p>
          ) : !me ? (
            <p className="muted" style={{ fontSize: 13 }}>
              Please log in to view your shared recipes.
            </p>
          ) : loadingRecipes ? (
            <p className="muted" style={{ fontSize: 13 }}>
              Loading your recipes...
            </p>
          ) : myRecipes.length === 0 ? (
            <p className="muted" style={{ fontSize: 13 }}>
              You haven&apos;t shared any recipes yet.{" "}
              <button
                type="button"
                onClick={() => navigate("/add-recipe")}
                className="btn btn-ghost"
                style={{
                  padding: "0 6px",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
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
                    className="app-card overflow-hidden"
                    style={{ boxShadow: "none" }}
                  >
                    <div style={{ height: 160, background: "var(--surface-2)" }}>
                      {recipe.imageUrl ? (
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 style={{ fontWeight: 900, fontSize: 14, margin: 0 }}>
                        {recipe.name}
                      </h4>

                      <p className="muted" style={{ fontSize: 12, margin: 0 }}>
                        {typeof description === "string"
                          ? description.slice(0, 160)
                          : ""}
                      </p>

                      {Array.isArray(recipe.ingredients) &&
                        recipe.ingredients.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {recipe.ingredients.slice(0, 8).map((ing, idx) => (
                              <span key={idx} className="tag">
                                {ing}
                              </span>
                            ))}
                          </div>
                        )}

                      <div className="mt-3 flex gap-2">
                        <Link
                          to={`/recipes/${recipe._id}`}
                          className="btn btn-primary"
                          style={{ flex: 1 }}
                        >
                          View Recipe
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleSaveRecipe(recipe._id)}
                          className="btn"
                          style={{ flex: 1 }}
                          disabled={savingId === recipe._id}
                        >
                          {savingId === recipe._id ? "Saving..." : "Save Recipe"}
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
    </div>
  );
}

export default AccountPage;
