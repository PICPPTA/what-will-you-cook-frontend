export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">What Will You Cook?</h1>
      <p className="text-sm text-gray-600 mb-8">
        Find dishes you can make from the ingredients you already have — quick, smart, and simple.
      </p>

      <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
      <p className="text-sm text-gray-700 mb-6">
        We&apos;d love to hear from you! Whether you have feedback, suggestions, or just want to share your cooking
        success stories, feel free to reach out.
      </p>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-sm space-y-2">
        <p>
          <span className="font-medium">Email:</span> hello@whatwillyoucook.com
        </p>
        <p>
          <span className="font-medium">Support:</span> support@whatwillyoucook.com
        </p>
        <p>
          <span className="font-medium">Follow us:</span> @whatwillyoucook on social media
        </p>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        We typically respond within 24–48 hours. Thank you for being part of our cooking community!
      </p>
    </div>
  );
}
