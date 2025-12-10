import { useState } from "react";
import { API_BASE } from "../api";   // ✅ ใช้ URL จากไฟล์ api.js

export default function Search() {
  const [ingredientsText, setIngredientsText] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    const token = localStorage.getItem("token");

    setMessage("Searching...");
    setResults([]);

    try {
      const res = await fetch(`${API_BASE}/recipes/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,   // เผื่อ backend ใช้ทีหลัง
        },
        body: JSON.stringify({ ingredientsText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Search failed.");
        return;
      }

      setResults(data.recipes || []);
      setMessage(`Found ${data.recipes?.length || 0} recipe(s).`);
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">What ingredients do you have?</h1>

      <input
        className="border p-2 w-full rounded"
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

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}

      <div className="mt-6">
        {results.map((item) => (
          <div
            key={item._id}
            className="p-3 border rounded mb-3 bg-white shadow"
          >
            <h2 className="font-bold text-lg">{item.name}</h2>
            <p className="text-sm text-gray-600">
              {item.ingredients.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
