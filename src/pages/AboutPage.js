// src/pages/AboutPage.js
import React from "react";

function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Title เหมือนทุกหน้า */}
      <h1 className="text-3xl font-semibold mb-1">What Will You Cook?</h1>
      <p className="text-sm text-gray-600 mb-6">
        Find dishes you can make from the ingredients you already have — quick,
        smart, and simple.
      </p>

      {/* กล่องตรงกลาง: ใช้สไตล์เดียวกับ ContactPage */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
        <h2 className="text-sm font-semibold mb-3">
          About What Will You Cook?
        </h2>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            Welcome to <span className="font-semibold">What Will You Cook?</span>{" "}
            — your personal cooking companion and community platform designed to
            make meal planning effortless and exciting!
          </p>

          <p>
            We understand that deciding what to cook can be challenging,
            especially when you want to use ingredients you already have at
            home. That&apos;s why we created this platform to help you discover
            delicious recipes based on what&apos;s in your kitchen right now.
          </p>

          <div>
            <h3 className="font-semibold text-sm mb-2">How It Works</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Select any ingredients you have from our ingredient categories.</li>
              <li>
                Recipes will show dishes that use{" "}
                <span className="font-medium">ANY</span> combination of your
                selected ingredients.
              </li>
              <li>
                Recipes are ranked by how many of your ingredients they use, so
                the best matches appear first.
              </li>
              <li>
                Browse and view recipes as a guest, or log in for more powerful
                features.
              </li>
              <li>
                When logged in: save recipes, rate dishes, leave comments, and
                follow other cooks.
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Community Features</h3>
            <p>
              Join our food community! Follow other users, share recipe tips in
              comments, rate dishes you&apos;ve tried, and discover new culinary
              inspiration from fellow home cooks around the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
