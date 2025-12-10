// src/components/RecipeCard.jsx
import { Link } from "react-router-dom";

export default function RecipeCard({
  recipe,
  onSave,                  // ฟังก์ชันเวลาคลิก Save
  isSaved = false,         // true = แสดงเป็น Saved แล้ว
  showSaveButton = true,   // บางหน้าจะไม่ต้องมีปุ่ม Save ก็ได้
}) {
  if (!recipe) return null;

  const description =
    recipe.description || recipe.steps || "No description yet.";

  const handleSaveClick = (e) => {
    if (!onSave) return;
    e.preventDefault();
    e.stopPropagation();
    onSave(recipe._id);
  };

  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : [];

  const visibleTags = ingredients.slice(0, 4);
  const extraCount =
    ingredients.length > visibleTags.length
      ? ingredients.length - visibleTags.length
      : 0;

  return (
    <article className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm flex flex-col">
      {/* รูป + คลิกเข้าไปดูเมนู */}
      <Link to={`/recipes/${recipe._id}`} className="block">
        <div className="h-40 md:h-48 bg-gray-200 overflow-hidden">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
        </div>
      </Link>

      {/* เนื้อหา */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h4 className="font-semibold text-sm text-gray-900">
          {recipe.name}
        </h4>

        <p className="text-xs text-gray-600 leading-snug">
          {typeof description === "string"
            ? description.slice(0, 140)
            : ""}
        </p>

        {/* แท็กวัตถุดิบด้านล่างเหมือน Figma */}
        {visibleTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {visibleTags.map((ing, idx) => (
              <span
                key={idx}
                className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-700"
              >
                {ing}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="inline-flex px-2 py-0.5 rounded-full border border-dashed border-gray-300 text-[11px] text-gray-500">
                + {extraCount} more
              </span>
            )}
          </div>
        )}

        {/* ปุ่มด้านล่าง */}
        <div className="mt-3 flex gap-2">
          <Link
            to={`/recipes/${recipe._id}`}
            className="flex-1 text-center text-xs rounded-full bg-gray-900 text-white py-1.5 hover:bg-black"
          >
            View Recipe
          </Link>

          {showSaveButton && (
            <button
              type="button"
              onClick={handleSaveClick}
              className="flex-1 text-xs rounded-full border py-1.5 hover:bg-gray-50"
            >
              {isSaved ? "Saved" : "Save Recipe"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
