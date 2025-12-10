// src/pages/AccountPage.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../api";  // ✅ ใช้ API จริงจาก Render

function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ตอนนี้ยังเป็น mock data เฉย ๆ เหมือนใน Figma
  const [sharedRecipes, setSharedRecipes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view your account.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/protected/me`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load profile");
        } else {
          setUser(data.user);

          // ตัวอย่างเมนู ยังใช้ Static ตาม Figma
          setSharedRecipes([
            {
              id: 1,
              title: "Chicken with Glass Noodles Stir-Fry",
              description:
                "Quick and easy Thai-style stir-fry with chicken, glass noodles, and veggies.",
              tags: ["chicken", "glass noodles", "garlic", "onion", "carrot"],
              image:
                "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
            },
            {
              id: 2,
              title: "Fried Rice with Egg and Garlic",
              description:
                "Classic fried rice you can make in minutes with egg, garlic, and leftover rice.",
              tags: ["rice", "egg", "garlic", "soy sauce", "onion"],
              image:
                "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
            },
          ]);
        }
      } catch (err) {
        console.error(err);
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <section className="py-8">
        <h1 className="text-3xl font-semibold mb-1">What Will You Cook?</h1>
        <p className="text-sm text-gray-600">
          Find dishes you can make from the ingredients you already have — quick,
          smart, and simple.
        </p>
      </section>

      {/* Profile */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover"
          />

          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-3">{user.email}</p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="font-semibold">{user.followers}</p>
                <p className="text-gray-500">Followers</p>
              </div>
              <div>
                <p className="font-semibold">{user.following}</p>
                <p className="text-gray-500">Following</p>
              </div>
              <div>
                <p className="font-semibold">{user.recipesShared}</p>
                <p className="text-gray-500">Recipes Shared</p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mt-8 space-y-2">
          <h3 className="text-base font-semibold">About</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{user.bio}</p>
        </div>

        {/* My Shared Recipes */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🍜</span>
            <h3 className="text-base font-semibold">My Shared Recipes</h3>
          </div>

          {sharedRecipes.length === 0 ? (
            <p className="text-sm text-gray-500">
              You haven&apos;t shared any recipes yet.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {sharedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col"
                >
                  <div className="h-44 w-full overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    <h4 className="font-semibold text-sm">{recipe.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {recipe.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full border border-gray-200 text-[11px] text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-1.5 text-xs rounded-full border border-gray-900 text-gray-900 hover:bg-gray-50">
                        View Recipe
                      </button>
                      <button className="flex-1 px-3 py-1.5 text-xs rounded-full bg-black text-white hover:bg-gray-800">
                        Save Recipe
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AccountPage;
