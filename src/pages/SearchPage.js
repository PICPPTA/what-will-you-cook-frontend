// src/pages/SearchPage.js
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../api.js";

const MEAT = [
  "Chicken", "Pork", "Beef", "Duck", "Fish", "Shrimp", "Squid", "Dried Squid",
  "Mussel", "Clam", "Scallop", "Crab", "Cuttlefish", "Oyster", "Bacon",
  "Pork Belly", "Minced Pork", "Minced Chicken", "Chicken Liver", "Sausage",
  "Ham", "Egg", "Quail Egg", "Meatball", "Dried Shrimp"
];

const VEGETABLES = [
  "Cabbage", "Chinese Cabbage", "Carrot", "Morning Glory", "Kale",
  "Coriander", "Spring Onion", "Onion", "Shallot", "Garlic", "Chili",
  "Tomato", "Eggplant", "Green Eggplant", "Pumpkin", "Cucumber", "Long Bean",
  "Bean Sprout", "Baby Corn", "Straw Mushroom", "Shiitake Mushroom",
  "Enoki Mushroom", "King Oyster Mushroom", "Spinach", "Lettuce",
  "Iceberg Lettuce", "Sweet Pepper", "Broccoli", "Cauliflower", "Bamboo Shoot",
  "Asparagus", "Holy Basil", "Sweet Basil", "Kaffir Lime Leaves", "Mint Leaves",
  "Wild Betel Leaves", "Bitter Melon", "Fingerroot", "Galangal", "Ginger"
];

const OTHERS = [
  "Glass Noodles", "Rice Noodles", "Vermicelli", "Big Flat Noodles",
  "Thin Noodles", "Instant Noodles", "Rice", "Sticky Rice", "Bread", "Tofu",
  "Fried Tofu", "Yellow Tofu", "Egg Tofu", "Tofu Skin", "Coconut Milk",
  "Fresh Milk", "Condensed Milk", "Butter", "Cheese", "Flour", "Rice Flour",
  "Tapioca Flour", "Coconut Flesh", "Peanut", "White Sesame", "Cashew Nut",
  "Noodles Sheet", "Bean Curd Sheet", "Bread Crumbs", "Seaweed"
];

export default function SearchPage({ me, meLoading }) {
  const navigate = useNavigate();

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");
  const [savingId, setSavingId] = useState(null);

  const toggleIngredient = (name) => {
    setSelectedIngredients((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const chipStyle = (active) => ({
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid var(--border)`,
    fontSize: 12,
    background: active ? "var(--text)" : "rgba(255,255,255,0.85)",
    color: active ? "white" : "var(--text)",
    cursor: "pointer",
  });

  const suggestionTags = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return [];
    const all = [...MEAT, ...VEGETABLES, ...OTHERS];
    return all
      .filter((tag) => tag.toLowerCase().includes(q) && !selectedIngredients.includes(tag))
      .slice(0, 24);
  }, [searchText, selectedIngredients]);

  const handleSearch = async () => {
    if (selectedIngredients.length === 0) {
      setMessage("Please select at least one ingredient tag.");
      return;
    }

    setLoading(true);
    setMessage("");
    setResults([]);
    setSaveMessage("");

    try {
      const lowerTags = selectedIngredients.map((t) => t.toLowerCase());

      const res = await fetch(`${API_BASE}/recipes/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          ingredients: lowerTags,
          matchMode: "any",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.message || "Search failed");
      } else {
        setMessage(`Found ${data.matchedCount} recipe(s)`);
        setResults(Array.isArray(data.recipes) ? data.recipes : []);
      }
    } catch (err) {
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedIngredients([]);
    setSearchText("");
    setResults([]);
    setMessage("");
    setSaveMessage("");
  };

  const handleSaveRecipe = async (recipeId) => {
    setSaveMessage("");

    if (meLoading) return;

    if (!me) {
      setSaveMessage("Please log in first.");
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

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setSaveMessage("Session expired. Please log in again.");
        navigate("/login", { replace: true });
        return;
      }

      if (!res.ok) {
        setSaveMessage(data.message || "Failed to save recipe");
        return;
      }

      setSaveMessage("Saved successfully!");
    } catch (err) {
      setSaveMessage("Error saving recipe");
    } finally {
      setSavingId(null);
    }
  };

  const renderChip = (name) => {
    const active = selectedIngredients.includes(name);
    return (
      <button
        key={name}
        type="button"
        onClick={() => toggleIngredient(name)}
        style={chipStyle(active)}
        className="mb-2 mr-2"
        title={active ? "Selected" : "Click to select"}
      >
        {name}
      </button>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="py-8">
        <h1 style={{ fontSize: 34, fontWeight: 900, margin: 0 }}>What Will You Cook?</h1>
        <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
          Find dishes you can make from the ingredients you already have — quick, smart, and simple.
        </p>

        <div className="app-card p-6 mt-6">
          <h2 style={{ fontSize: 16, fontWeight: 900, textAlign: "center", margin: 0 }}>
            What will you cook today?
          </h2>

          <div className="max-w-xl mx-auto mt-4">
            <input
              type="text"
              className="input"
              placeholder="Type to search ingredient tags..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {suggestionTags.length > 0 && (
              <div className="mt-3 flex flex-wrap">
                {suggestionTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      toggleIngredient(tag);
                      setSearchText("");
                    }}
                    className="btn btn-ghost mr-2 mb-2"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6">
              <h3 style={{ fontWeight: 900, fontSize: 13, marginBottom: 10 }}>Meat</h3>
              <div className="flex flex-wrap">{MEAT.map(renderChip)}</div>

              <h3 style={{ fontWeight: 900, fontSize: 13, marginTop: 14, marginBottom: 10 }}>Vegetables</h3>
              <div className="flex flex-wrap">{VEGETABLES.map(renderChip)}</div>

              <h3 style={{ fontWeight: 900, fontSize: 13, marginTop: 14, marginBottom: 10 }}>Others</h3>
              <div className="flex flex-wrap">{OTHERS.map(renderChip)}</div>
            </div>

            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <button
                onClick={handleSearch}
                className="btn btn-primary"
                disabled={loading || selectedIngredients.length === 0}
              >
                {loading ? "Searching..." : "Find Recipes"}
              </button>

              <button onClick={handleClear} className="btn">
                Clear Selection
              </button>

              {meLoading ? (
                <span className="muted" style={{ fontSize: 12 }}>Checking session...</span>
              ) : me ? (
                <span className="muted" style={{ fontSize: 12 }}>
                  Logged in as <span style={{ fontWeight: 900 }}>{me.name || "User"}</span>
                </span>
              ) : (
                <span className="muted" style={{ fontSize: 12 }}>
                  Guest mode (log in to save recipes)
                </span>
              )}
            </div>

            {saveMessage && (
              <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
                {saveMessage}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 mb-10">
        {message && <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>{message}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          {results.map((item) => (
            <div key={item._id} className="app-card p-4" style={{ boxShadow: "none" }}>
              <Link to={`/recipes/${item._id}`} className="nav-link" style={{ fontWeight: 900 }}>
                {item.name}
              </Link>

              <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
                {Array.isArray(item.ingredients) ? item.ingredients.join(", ") : ""}
              </p>

              <div className="mt-3 flex gap-2 flex-wrap">
                <Link to={`/recipes/${item._id}`} className="btn btn-primary">
                  View Recipe
                </Link>

                <button
                  type="button"
                  onClick={() => handleSaveRecipe(item._id)}
                  className="btn"
                  disabled={savingId === item._id}
                >
                  {savingId === item._id ? "Saving..." : "Save Recipe"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
