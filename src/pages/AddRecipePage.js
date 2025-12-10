// src/pages/AddRecipePage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { API_BASE } from "../api";

function AddRecipePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [steps, setSteps] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ถ้าไม่ได้ login ให้ขึ้นการ์ดให้ไปล็อกอินก่อน
  if (!token) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-1">What Will You Cook?</h1>
        <p className="text-sm text-gray-600 mb-6">
          Add your own recipes and share them with the community.
        </p>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Sign in to add recipes</h2>
          <p className="text-sm text-gray-600 mb-4">
            You need to be logged in before you can create and share a new
            recipe.
          </p>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-900 text-white hover:bg-black"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 rounded-full text-sm border border-gray-300 text-gray-800 hover:bg-gray-50"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !ingredientsText.trim()) {
      setError("Please fill in the recipe name and ingredients.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          name: name.trim(),
          ingredients: ingredientsText, // backend จะแปลง string -> array ให้เอง
          steps: steps.trim(),
          cookingTime: cookingTime ? Number(cookingTime) : undefined,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not create recipe.");
        return;
      }

      setSuccess("Recipe created successfully!");
      // เคลียร์ฟอร์ม
      setName("");
      setIngredientsText("");
      setSteps("");
      setCookingTime("");
      setImageUrl("");

      // ไปหน้า Account หรือ Recipe detail ก็ได้
      // ตอนนี้ให้ไป /account เพื่อเห็นใน My Shared Recipes
      setTimeout(() => {
        navigate("/account");
      }, 800);
    } catch (err) {
      console.error("Create recipe error:", err);
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* หัวแบบเดียวกับหน้าอื่น ๆ */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold mb-1">Add Recipe</h1>
        <p className="text-sm text-gray-600">
          Share a dish you love. Other cooks will be able to view, save, rate,
          and comment on your recipe.
        </p>
      </header>

      {/* การ์ดฟอร์ม */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-5"
      >
        {/* error / success */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            {success}
          </p>
        )}

        {/* Recipe name */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Recipe name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            placeholder="e.g. Garlic Fried Rice"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Image URL (optional)
          </label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            placeholder="https://example.com/my-dish.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            For now, paste a link to a JPG/PNG image. In the future this can be
            changed to file upload.
          </p>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Ingredients
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            rows={3}
            placeholder="Separate ingredients with commas, e.g. egg, cheese, butter"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            The app will split these by comma and match them with other users&apos;
            searches.
          </p>
        </div>

        {/* Steps / Method */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Steps / Method
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            rows={5}
            placeholder={"1. Prep ingredients\n2. Cook\n3. Serve and enjoy"}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
        </div>

        {/* Cooking time */}
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Cooking time (minutes)
          </label>
          <input
            type="number"
            min={1}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            placeholder="e.g. 20"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-2 rounded-full text-sm font-semibold bg-gray-900 text-white hover:bg-black disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipePage;
