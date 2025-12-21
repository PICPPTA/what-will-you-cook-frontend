// src/pages/AboutPage.js
import React from "react";

function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>About</h1>
      <p className="muted" style={{ marginTop: 8, marginBottom: 18 }}>
        Find dishes you can make from the ingredients you already have — quick, smart, and simple.
      </p>

      <div className="app-card p-6 md:p-8">
        <h2 style={{ fontSize: 14, fontWeight: 800, marginTop: 0 }}>
          About What Will You Cook?
        </h2>

        <div className="space-y-4" style={{ fontSize: 14, lineHeight: 1.7 }}>
          <p>
            Welcome to <span style={{ fontWeight: 800 }}>What Will You Cook?</span> — your personal cooking companion and community platform designed to make meal planning effortless and exciting!
          </p>

          <p>
            We understand that deciding what to cook can be challenging, especially when you want to use ingredients you already have at home.
          </p>

          <div>
            <h3 style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>How It Works</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Select ingredients you have from categories.</li>
              <li>Recipes will show dishes that match ANY combination of selected ingredients.</li>
              <li>Recipes are ranked by how many ingredients they use.</li>
              <li>Browse as a guest, or log in for more features.</li>
              <li>When logged in: save recipes, rate dishes, leave comments, and follow other cooks.</li>
            </ol>
          </div>

          <div>
            <h3 style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>Community Features</h3>
            <p className="muted" style={{ margin: 0 }}>
              Follow other users, share recipe tips in comments, rate dishes you&apos;ve tried, and discover new culinary inspiration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
