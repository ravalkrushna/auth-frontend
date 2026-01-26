import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendForgotOtp } from "../api/auth";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    try {
      setLoading(true);

      await sendForgotOtp({ email });

      sessionStorage.setItem("resetEmail", email);

      alert("OTP sent to your email ✅");

      navigate("/resetpassword");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 outline-none border border-gray-700 focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full bg-gray-700 hover:bg-gray-600 transition p-3 rounded-lg font-semibold"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}
