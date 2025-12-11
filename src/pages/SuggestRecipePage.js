import { useState } from "react";
import { API_BASE } from "../api.js";

export default function SuggestRecipePage() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState("");

  const handleSuggest = async () => {
    setMessage("Processing...");
    setSuggestions([]);

    try {
      const res = await fetch(`${API_BASE}/recipes/suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Suggestion failed");
        return;
      }

      setMessage(`พบเมนูที่ใกล้เคียง ${data.recipes.length} รายการ`);
      setSuggestions(data.recipes);
    } catch (err) {
      setMessage("Cannot connect to server");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-orange-600">✨ Suggest Menu</h1>

      <textarea
        className="w-full border p-3 rounded"
        rows="3"
        placeholder="พิมพ์วัตถุดิบ เช่น egg, rice, garlic"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleSuggest}
        className="mt-3 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        Suggest Menu
      </button>

      {message && <p className="mt-4 text-lg font-medium">{message}</p>}

      <div className="mt-6">
        {suggestions.map((item) => (
          <div key={item._id} className="p-4 bg-white shadow rounded mb-3">
            <h2 className="text-xl font-bold text-orange-700">{item.name}</h2>

            <p className="text-gray-600">
              Ingredients: {item.ingredients.join(", ")}
            </p>

            <p className="mt-2 text-gray-800 whitespace-pre-line">
              {item.steps}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
