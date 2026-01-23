import { useState } from "react";
import { verifyOtp } from "../api/auth";

function VerifyOtp() {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleVerify = async () => {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await verifyOtp({ email, otp });
      setMessage(res);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Verify OTP</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {message && (
          <p className="text-sm text-center text-green-600 mt-3">
            {message}
          </p>
        )}

        {error && (
          <p className="text-sm text-center text-red-600 mt-3">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default VerifyOtp;
