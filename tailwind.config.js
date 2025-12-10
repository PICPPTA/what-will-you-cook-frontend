/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",   // ← บอก Tailwind ให้ scan ไฟล์ทั้งหมดใน src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
