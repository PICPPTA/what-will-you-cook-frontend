import { useState } from "react";
import { API_BASE } from "../api.js";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Login failed");
        return;
      }

      // ✅ บันทึก token
      localStorage.setItem("token", data.token);

      alert("เข้าสู่ระบบสำเร็จ!");

      // ✅ ไปหน้า Account หรือหน้า Search ก็ได้
      navigate("/account");

    } catch (error) {
      console.error(error);
      setErrorMessage("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">เข้าสู่ระบบ</h2>

      <form
        onSubmit={handleLogin}
        className="w-96 p-6 rounded-lg shadow-lg border bg-white"
      >
        <input
          type="email"
          placeholder="อีเมล"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="รหัสผ่าน"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-green-600 text-white p-2 rounded mt-3 hover:bg-green-700"
          type="submit"
        >
          เข้าสู่ระบบ
        </button>
      </form>

      {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}
    </div>
  );
}
