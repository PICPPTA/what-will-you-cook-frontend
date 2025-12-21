// src/pages/SuggestRecipePage.js
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
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ text }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.message || "Suggestion failed");
        return;
      }

      const list = Array.isArray(data.recipes) ? data.recipes : [];
      setMessage(`พบเมนูที่ใกล้เคียง ${list.length} รายการ`);
      setSuggestions(list);
    } catch (err) {
      setMessage("Cannot connect to server");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="app-card p-6">
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>Suggest Menu</h1>
        <p className="muted" style={{ marginTop: 10 }}>
          พิมพ์วัตถุดิบที่มี แล้วให้ระบบช่วยแนะนำเมนูที่ใกล้เคียง
        </p>

        <div className="mt-4">
          <textarea
            className="input"
            style={{ minHeight: 96, borderRadius: 14, padding: 12 }}
            rows="3"
            placeholder="พิมพ์วัตถุดิบ เช่น egg, rice, garlic"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button onClick={handleSuggest} className="btn btn-primary mt-3">
            Suggest Menu
          </button>

          {message && (
            <p className="muted" style={{ marginTop: 12, fontWeight: 900 }}>
              {message}
            </p>
          )}
        </div>

        <div className="mt-5 space-y-3">
          {suggestions.map((item) => (
            <div key={item._id} className="app-card p-4" style={{ boxShadow: "none" }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>{item.name}</h2>

              <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>
                Ingredients: {Array.isArray(item.ingredients) ? item.ingredients.join(", ") : ""}
              </p>

              <p style={{ marginTop: 10, fontSize: 13, whiteSpace: "pre-line" }}>
                {item.steps}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
