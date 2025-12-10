// src/pages/RecipeDetailPage.js
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../api";   // ✅ เพิ่มเพื่อใช้ URL ของ backend จริง

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [error, setError] = useState("");

  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [myRating, setMyRating] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  // โหลดเมนู + feedback
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");

        // ✅ ดึงเมนูจาก backend จริง
        const resRecipe = await fetch(`${API_BASE}/recipes/${id}`);
        const dataRecipe = await resRecipe.json();
        if (!resRecipe.ok) {
          setError(dataRecipe.message || "Failed to load recipe.");
          setLoadingRecipe(false);
          return;
        }
        setRecipe(dataRecipe);

        // ✅ ดึง feedback (rating + comments)
        const resFeedback = await fetch(`${API_BASE}/recipes/${id}/feedback`);
        const dataFeedback = await resFeedback.json();
        if (resFeedback.ok) {
          setAvgRating(dataFeedback.avgRating || 0);
          setRatingCount(dataFeedback.ratingCount || 0);
          setComments(dataFeedback.comments || []);
        }
      } catch (err) {
        setError("Error connecting to server.");
      } finally {
        setLoadingRecipe(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRate = async (value) => {
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนให้คะแนน 😊");
      return;
    }

    try {
      setRatingSubmitting(true);

      // ✅ POST rating → backend จริง
      const res = await fetch(`${API_BASE}/recipes/${id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ rating: value }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "ไม่สามารถให้คะแนนได้");
        return;
      }

      setMyRating(data.myRating);
      setAvgRating(data.avgRating);
      setRatingCount(data.ratingCount);
    } catch (err) {
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setRatingSubmitting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น 😊");
      return;
    }
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);

      // ✅ POST comment → backend จริง
      const res = await fetch(`${API_BASE}/recipes/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ text: commentText }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "ไม่สามารถเพิ่มคอมเมนต์ได้");
        return;
      }

      // ใส่คอมเมนต์ใหม่ขึ้นด้านบน
      setComments((prev) => [data.comment, ...prev]);
      setCommentText("");
    } catch (err) {
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderStars = () => {
    const displayValue = myRating || Math.round(avgRating);

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleRate(value)}
            className="text-xl"
            disabled={ratingSubmitting}
          >
            {value <= displayValue ? "★" : "☆"}
          </button>
        ))}
      </div>
    );
  };

  if (loadingRecipe) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-sm text-gray-600">Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-sm text-red-600 mb-4">
          {error || "Recipe not found."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-700 underline"
        >
          ← Back
        </button>
      </div>
    );
  }

  const stepLines =
    typeof recipe.steps === "string"
      ? recipe.steps
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-gray-500 mb-4 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-semibold mb-2">{recipe.name}</h1>

      <p className="text-xs text-gray-500 mb-6">
        Recipe ID: <span className="font-mono">{recipe._id}</span>
      </p>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-6">
        {renderStars()}
        <div className="text-xs text-gray-600">
          <span className="font-medium">
            {avgRating ? avgRating.toFixed(1) : "0.0"} / 5
          </span>{" "}
          <span className="text-gray-400">
            ({ratingCount} rating{ratingCount !== 1 ? "s" : ""})
          </span>
          {myRating && (
            <span className="ml-2 text-gray-500">
              Your rating: <span className="font-medium">{myRating}</span>
            </span>
          )}
        </div>
      </div>

      {/* Ingredients */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-2">Ingredients</h2>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.map((ing) => (
              <span
                key={ing}
                className="px-3 py-1 rounded-full border text-xs bg-gray-50"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Steps */}
      {stepLines.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold mb-2">Cooking Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            {stepLines.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Comments */}
      <section className="border-t border-gray-200 pt-6">
        <h2 className="text-sm font-semibold mb-3">Comments</h2>

        {!token && (
          <p className="text-xs text-gray-500 mb-3">
            Log in to leave a comment.{" "}
            <Link to="/login" className="text-gray-900 font-medium hover:underline">
              Login →
            </Link>
          </p>
        )}

        {token && (
          <form onSubmit={handleAddComment} className="mb-5 space-y-2">
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              rows={3}
              placeholder="Share your experience, tips, adjustments, or review of this recipe..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-xs hover:bg-black disabled:opacity-60"
            >
              {submittingComment ? "Posting..." : "Post comment"}
            </button>
          </form>
        )}

        {comments.length === 0 && (
          <p className="text-xs text-gray-500">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}

        <div className="space-y-3">
          {comments.map((c) => (
            <div
              key={c._id}
              className="border border-gray-200 rounded-xl px-3 py-2 bg-white"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-gray-900">
                  {c.userName || "User"}
                </p>
                {c.createdAt && (
                  <p className="text-[10px] text-gray-400">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-700 whitespace-pre-line">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cooking Tips */}
      <section className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-sm font-semibold mb-3">Cooking Tips</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <ul className="list-disc list-inside text-xs text-gray-700 space-y-1.5">
            <li>Prep all ingredients before you start cooking.</li>
            <li>Don&apos;t overcrowd the pan – cook in batches.</li>
            <li>Adjust cooking time based on your stove&apos;s heat.</li>
            <li>Feel free to substitute ingredients as needed.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default RecipeDetailPage;
