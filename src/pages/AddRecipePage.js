// src/pages/AddRecipePage.js
// FORCE REBUILD 2025-12-21-V2-UNIFY

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../api.js";

function AddRecipePage({ me, meLoading }) {
  const navigate = useNavigate();
  const isAuthed = !!me;

  const [name, setName] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [steps, setSteps] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (meLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Add Recipe</h1>
        <p className="muted" style={{ marginTop: 10 }}>
          Checking session...
        </p>
        <div className="app-card p-6 mt-5">
          <p className="muted" style={{ margin: 0 }}>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Add Recipe</h1>
        <p className="muted" style={{ marginTop: 10 }}>
          Sign in to create and share a new recipe.
        </p>

        <div className="app-card p-6 mt-5">
          <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>Sign in to add recipes</h2>
          <p className="muted" style={{ marginTop: 10 }}>
            You need to be logged in before you can create and share a new recipe.
          </p>

          <div className="flex gap-3 mt-4">
            <Link to="/login" className="btn btn-primary">Log In</Link>
            <Link to="/register" className="btn">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const nameTrim = name.trim();
    const ingTrim = ingredientsText.trim();

    if (!nameTrim || !ingTrim) {
      setError("Please fill in the recipe name and ingredients.");
      return;
    }

    const ingredientsArray = ingTrim
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          name: nameTrim,
          ingredients: ingredientsArray,
          ingredientsText: ingTrim,
          steps: steps.trim() || "",
          cookingTime: cookingTime ? Number(cookingTime) : undefined,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      if (res.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Could not create recipe.");
        return;
      }

      setSuccess("Recipe created successfully!");
      setName("");
      setIngredientsText("");
      setSteps("");
      setCookingTime("");
      setImageUrl("");

      setTimeout(() => navigate("/my-recipes", { replace: true }), 400);
    } catch (err) {
      console.error("Create recipe error:", err);
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-6">
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Add Recipe</h1>
        <p className="muted" style={{ marginTop: 10 }}>
          Share a dish you love. Other cooks can view, save, rate, and comment.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="app-card p-6 md:p-8 space-y-5">
        {error && (
          <div className="app-card p-4" style={{ boxShadow: "none" }}>
            <p style={{ margin: 0, fontSize: 13, color: "var(--danger)" }}>{error}</p>
          </div>
        )}

        {success && (
          <div className="app-card p-4" style={{ boxShadow: "none" }}>
            <p style={{ margin: 0, fontSize: 13, color: "var(--success)" }}>{success}</p>
          </div>
        )}

        <div>
          <label style={{ fontSize: 13, fontWeight: 900 }}>Recipe name</label>
          <input
            type="text"
            className="input mt-2"
            placeholder="e.g. Garlic Fried Rice"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 900 }}>Image URL (optional)</label>
          <input
            type="url"
            className="input mt-2"
            placeholder="https://example.com/my-dish.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
            For now, paste a link to a JPG/PNG image. Later can be file upload.
          </p>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 900 }}>Ingredients</label>
          <textarea
            className="input mt-2"
            style={{ minHeight: 96, borderRadius: 14, padding: 12 }}
            rows={3}
            placeholder="Separate ingredients with commas, e.g. egg, cheese, butter"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
          />
          <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
            The app will split these by comma for matching.
          </p>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 900 }}>Steps / Method</label>
          <textarea
            className="input mt-2"
            style={{ minHeight: 140, borderRadius: 14, padding: 12 }}
            rows={5}
            placeholder={"1. Prep ingredients\n2. Cook\n3. Serve and enjoy"}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
        </div>

        <div style={{ maxWidth: 240 }}>
          <label style={{ fontSize: 13, fontWeight: 900 }}>Cooking time (minutes)</label>
          <input
            type="number"
            min={1}
            className="input mt-2"
            placeholder="e.g. 20"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Saving..." : "Save recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipePage;
