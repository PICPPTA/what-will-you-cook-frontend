import { useState } from "react";
import { API_BASE } from "../api.js";

export default function SearchPage() {
  const [ingredientsText, setIngredientsText] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    console.log("Sending:", { ingredientsText });

    setMessage("Searching...");
    setResults([]);

    try {
      // ✅ เปลี่ยน URL ไปใช้ API_BASE
      const res = await fetch(`${API_BASE}/recipes/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredientsText }),
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (!res.ok) {
        setMessage(data.message || "Search failed");
        return;
      }

      setMessage(`Found ${data.matchedCount} recipe(s)`);
      setResults(data.recipes);
    } catch (error) {
      console.error(error);
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 Search Recipes</h1>

      <textarea
        className="w-full border p-3 rounded"
        rows="3"
        placeholder="เช่น egg, cheese, butter"
        value={ingredientsText}
        onChange={(e) => setIngredientsText(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}

      <div className="mt-6">
        {results.map((item) => (
          <div key={item._id} className="p-4 bg-white shadow rounded mb-3">
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-gray-600">
              Ingredients: {item.ingredients.join(", ")}
            </p>
            <p className="text-gray-700 mt-2 whitespace-pre-line">
              {item.steps}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
