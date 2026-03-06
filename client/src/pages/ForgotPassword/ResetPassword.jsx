import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const res = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token,
            newPassword: password
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful!");

        setTimeout(() => {
          navigate("/login");
        }, 2000);

      } else {
        setMessage(data.message);
      }

    } catch (err) {
      setMessage("Server error. Try again later.");
    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-300 relative overflow-hidden">

      {/* Gradient Blur Shapes */}
      <div className="absolute w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-30 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-30 bottom-10 right-10"></div>

      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md relative">

        <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
          MediConnect
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Reset your password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            placeholder="New Password"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

        {message && (
          <p className="text-center text-sm text-green-600 mt-4">
            {message}
          </p>
        )}

      </div>

    </div>

  );
}