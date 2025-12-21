// src/pages/RecipeDetailPage.js
// COOKIE SESSION ONLY (credentials: "include")
// FIX: 2025-12-21-V2

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { API_BASE } from "../api.js";

function RecipeDetailPage({ me, meLoading }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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

  // message ที่ไม่ใช่ fatal error
  const [actionMsg, setActionMsg] = useState("");

  const isAuthed = !!me;

  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      try {
        setError("");
        setActionMsg("");
        setLoadingRecipe(true);

        // 1) recipe (public)
        const resRecipe = await fetch(`${API_BASE}/recipes/${id}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const dataRecipe = await resRecipe.json().catch(() => ({}));
        if (!resRecipe.ok) {
          if (!alive) return;
          setError(dataRecipe.message || "Failed to load recipe.");
          setRecipe(null);
          return;
        }

        if (!alive) return;
        setRecipe(dataRecipe);

        // 2) feedback (rating + comments)
        const resFeedback = await fetch(`${API_BASE}/recipes/${id}/feedback`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const dataFeedback = await resFeedback.json().catch(() => ({}));
        if (!alive) return;

        if (resFeedback.ok) {
          setAvgRating(Number(dataFeedback.avgRating || 0));
          setRatingCount(Number(dataFeedback.ratingCount || 0));
          setComments(Array.isArray(dataFeedback.comments) ? dataFeedback.comments : []);

          // backend ของคุณตอนนี้ยังไม่ได้ส่ง myRating ใน /feedback
          // ถ้าวันหลัง backend รองรับ ก็จะโชว์ได้เอง
          if (dataFeedback.myRating != null) setMyRating(Number(dataFeedback.myRating));
        }
      } catch (err) {
        if (!alive) return;
        setError("Error connecting to server.");
      } finally {
        if (!alive) return;
        setLoadingRecipe(false);
      }
    };

    fetchData();
    return () => {
      alive = false;
    };
  }, [id]);

  const stepLines = useMemo(() => {
    if (typeof recipe?.steps !== "string") return [];
    return recipe.steps
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [recipe]);

  const requireLogin = (msg = "Please log in to rate or comment.") => {
    setActionMsg(msg);
    navigate("/login", {
      replace: true,
      state: { from: location.pathname }, // ✅ กลับมาหน้าเดิมหลังล็อกอิน
    });
  };

  const handleRate = async (value) => {
    // กันเคสกำลังเช็ค session อยู่ แล้วผู้ใช้กดเร็ว
    if (meLoading) {
      setActionMsg("Checking session... please try again.");
      return;
    }

    if (!isAuthed) {
      requireLogin("Please log in to rate this recipe.");
      return;
    }

    try {
      setActionMsg("");
      setRatingSubmitting(true);

      const res = await fetch(`${API_BASE}/recipes/${id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ rating: value }),
      });

      if (res.status === 401) {
        requireLogin("Session expired. Please log in again to rate.");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setActionMsg(data.message || "Could not submit rating.");
        return;
      }

      setMyRating(data.myRating ?? value);
      setAvgRating(Number(data.avgRating || 0));
      setRatingCount(Number(data.ratingCount || 0));
      setActionMsg("Rating saved.");
    } catch (err) {
      setActionMsg("Cannot connect to server.");
    } finally {
      setRatingSubmitting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (meLoading) {
      setActionMsg("Checking session... please try again.");
      return;
    }

    if (!isAuthed) {
      requireLogin("Please log in to comment on this recipe.");
      return;
    }

    try {
      setActionMsg("");
      setSubmittingComment(true);

      const res = await fetch(`${API_BASE}/recipes/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ text: commentText.trim() }),
      });

      if (res.status === 401) {
        requireLogin("Session expired. Please log in again to comment.");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setActionMsg(data.message || "Could not add comment.");
        return;
      }

      if (data.comment) {
        setComments((prev) => [data.comment, ...prev]);
      }
      setCommentText("");
      setActionMsg("Comment posted.");
    } catch (err) {
      setActionMsg("Cannot connect to server.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderStars = () => {
    const displayValue = myRating ?? Math.round(avgRating);

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleRate(value)}
            className="btn btn-ghost"
            style={{ padding: "0 6px", fontSize: 20, lineHeight: "24px" }}
            disabled={ratingSubmitting || meLoading}
            title={
              meLoading
                ? "Checking session..."
                : ratingSubmitting
                ? "Submitting..."
                : `Rate ${value}`
            }
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
        <p className="muted" style={{ fontSize: 13 }}>Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="alert alert-error">{error || "Recipe not found."}</div>
        <button onClick={() => navigate(-1)} className="btn btn-ghost mt-3">
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="btn btn-ghost mb-3">
        ← Back
      </button>

      <div className="app-card p-6">
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{recipe.name}</h1>

        <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
          Recipe ID:{" "}
          <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
            {recipe._id}
          </span>
        </p>

        {/* Rating */}
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          {renderStars()}
          <div className="muted" style={{ fontSize: 12 }}>
            <span style={{ fontWeight: 800 }}>
              {avgRating ? avgRating.toFixed(1) : "0.0"} / 5
            </span>{" "}
            <span style={{ opacity: 0.75 }}>
              ({ratingCount} rating{ratingCount !== 1 ? "s" : ""})
            </span>
            {myRating != null && (
              <span className="muted" style={{ marginLeft: 10 }}>
                Your rating: <span style={{ fontWeight: 800 }}>{myRating}</span>
              </span>
            )}
          </div>
        </div>

        {actionMsg && (
          <div className="alert mt-4" style={{ background: "rgba(255,255,255,0.6)" }}>
            <span className="muted">{actionMsg}</span>
          </div>
        )}

        {/* Ingredients */}
        {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
          <div className="mt-6">
            <h2 style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Ingredients</h2>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ing, idx) => (
                <span key={`${ing}-${idx}`} className="tag">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Steps */}
        {stepLines.length > 0 && (
          <div className="mt-6">
            <h2 style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>
              Cooking Instructions
            </h2>
            <ol
              className="list-decimal list-inside space-y-2"
              style={{ fontSize: 14, lineHeight: 1.7 }}
            >
              {stepLines.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Comments */}
      <section className="mt-6 app-card p-6">
        <h2 style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>Comments</h2>

        {meLoading ? (
          <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
            Checking session...
          </p>
        ) : !isAuthed ? (
          <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
            Log in to rate and comment.{" "}
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="nav-link"
              style={{ fontWeight: 800, textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              Login →
            </Link>
          </p>
        ) : (
          <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
            Logged in as <span style={{ fontWeight: 800 }}>{me?.name || "User"}</span>
          </p>
        )}

        <form onSubmit={handleAddComment} className="mt-4">
          <textarea
            className="input"
            style={{ minHeight: 96, borderRadius: 14, padding: 12 }}
            rows={3}
            placeholder="Share your experience, tips, adjustments, or review of this recipe..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={submittingComment}
          />
          <div className="mt-3">
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim() || meLoading}
              className="btn btn-primary"
            >
              {submittingComment ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>

        {comments.length === 0 ? (
          <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {comments.map((c) => (
              <div key={c._id} className="app-card p-4" style={{ boxShadow: "none" }}>
                <div className="flex items-center justify-between">
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 800 }}>
                    {c.userName || "User"}
                  </p>
                  {c.createdAt && (
                    <p className="muted" style={{ margin: 0, fontSize: 11 }}>
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <p className="muted" style={{ marginTop: 8, fontSize: 13, whiteSpace: "pre-line" }}>
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cooking Tips */}
      <section className="mt-6 app-card p-6">
        <h2 style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>Cooking Tips</h2>
        <div className="app-card p-4 mt-3" style={{ boxShadow: "none" }}>
          <ul className="list-disc list-inside space-y-1.5" style={{ fontSize: 13 }}>
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
