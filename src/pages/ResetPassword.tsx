import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth";

export default function ResetPassword() {
  const navigate = useNavigate();

  const email = sessionStorage.getItem("resetEmail") || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email missing. Please start Forgot Password again.");
      return;
    }

    if (!otp || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({ email, otp, newPassword });

      alert("Password reset successful ");

      sessionStorage.removeItem("resetEmail");

      navigate("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            value={email}
            disabled
            className="w-full p-3 rounded-lg bg-gray-800 outline-none border border-gray-700 opacity-70"
          />

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 outline-none border border-gray-700 focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 outline-none border border-gray-700 focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 outline-none border border-gray-700 focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition p-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>
      </div>
    </div>
  );
}
