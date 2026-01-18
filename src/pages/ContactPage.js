// src/pages/ContactPage.js
export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Contact</h1>
      <p className="muted" style={{ marginTop: 8, marginBottom: 18 }}>
        Find dishes you can make from the ingredients you already have — quick, smart, and simple.
      </p>

      <div className="app-card p-6">
        <h2 style={{ fontSize: 16, fontWeight: 800, marginTop: 0 }}>Contact Us</h2>
        <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
          We&apos;d love to hear from you! Whether you have feedback, suggestions, or just want to share your cooking success stories, feel free to reach out.
        </p>

        <div className="app-card p-4 mt-4" style={{ boxShadow: "none" }}>
          <p style={{ margin: 0, fontSize: 13 }}>
            <span style={{ fontWeight: 800 }}>Email:</span> pichayathida.pt@gmail.com
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 13 }}>
            <span style={{ fontWeight: 800 }}>Support:</span> support@whatwillyoucook.com
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 13 }}>
            <span style={{ fontWeight: 800 }}>Follow us:</span> @whatwillyoucook
          </p>
        </div>

        <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
          We typically respond within 24–48 hours. Thank you for being part of our cooking community!
        </p>
      </div>
    </div>
  );
}
