// src/pages/SearchPage.js
import { useState } from "react";
import { Link } from "react-router-dom";
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

export default function SearchPage() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [savingId, setSavingId] = useState(null);

  const token = localStorage.getItem("token");

  const toggleIngredient = (name) => {
    setSelectedIngredients((prev) =>
      prev.includes(name)
        ? prev.filter((x) => x !== name)
        : [...prev, name]
    );
  };

  const renderChip = (name) => {
    const active = selectedIngredients.includes(name);
    return (
      <button
        key={name}
        type="button"
        onClick={() => toggleIngredient(name)}
        className={
          "px-3 py-1 rounded-full border text-sm mb-2 mr-2 transition " +
          (active
            ? "bg-black text-white border-black"
            : "bg-white text-gray-800 hover:bg-gray-50")
        }
      >
        {name}
      </button>
    );
  };

  const suggestionTags =
    searchText.trim().length === 0
      ? []
      : [...MEAT, ...VEGETABLES, ...OTHERS].filter(
          (tag) =>
            tag.toLowerCase().includes(searchText.trim().toLowerCase()) &&
            !selectedIngredients.includes(tag)
        );

  const handleSearch = async () => {
    if (selectedIngredients.length === 0) {
      setMessage("Please select at least one ingredient tag.");
      return;
    }

    setLoading(true);
    setMessage("");
    setResults([]);

    try {
      const lowerTags = selectedIngredients.map((t) => t.toLowerCase());

      const res = await fetch(`${API_BASE}/recipes/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: lowerTags,
          matchMode: "any",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Search failed");
      } else {
        setMessage(`Found ${data.matchedCount} recipe(s)`);
        setResults(data.recipes || []);
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

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero */}
      <section className="py-8">
        <h1 className="text-3xl font-semibold mb-1">What Will You Cook?</h1>
        <p className="text-sm text-gray-600 mb-8">
          Find dishes you can make from the ingredients you already have — quick, smart, and simple.
        </p>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-2 text-center">
            What will you cook today?
          </h2>

          <div className="max-w-xl mx-auto">
            {/* Search bar */}
            <input
              type="text"
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Type to search ingredient tags..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {/* Suggestions */}
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
                    className="px-3 py-1 rounded-full border text-xs mr-2 mb-2 hover:bg-gray-50"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Ingredient Categories */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Meat</h3>
              <div className="flex flex-wrap">{MEAT.map(renderChip)}</div>

              <h3 className="font-medium mt-4 mb-2">Vegetables</h3>
              <div className="flex flex-wrap">{VEGETABLES.map(renderChip)}</div>

              <h3 className="font-medium mt-4 mb-2">Others</h3>
              <div className="flex flex-wrap">{OTHERS.map(renderChip)}</div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSearch}
                className="px-4 py-2 rounded-full bg-black text-white text-sm"
                disabled={loading || selectedIngredients.length === 0}
              >
                {loading ? "Searching..." : "Find Recipes"}
              </button>

              <button
                onClick={handleClear}
                className="px-4 py-2 rounded-full border text-sm hover:bg-gray-50"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {saveMessage && (
            <p className="text-xs mt-3 text-gray-700">{saveMessage}</p>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="mt-8 mb-10">
        {message && <p className="text-sm mb-3">{message}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          {results.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-2"
            >
              <Link to={`/recipes/${item._id}`} className="hover:opacity-90">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-xs text-gray-500">
                  {item.ingredients.join(", ")}
                </p>
              </Link>

              {token && (
                <button
                  className="self-start px-3 py-1 text-xs rounded-full border hover:bg-gray-50"
                  disabled={savingId === item._id}
                >
                  Save Recipe
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
