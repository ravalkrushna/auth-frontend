import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { verifyOtp } from "../api/auth";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = (location.state as { email?: string })?.email || "";

  const email = emailFromState;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);

    try {
      await verifyOtp({ email, otp });
      setShowSuccessModal(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-indigo-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Verify OTP
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled
            className="w-full mb-4 px-4 py-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
          />

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {error && (
            <p className="text-sm text-center text-red-600 mt-4">{error}</p>
          )}
        </div>
      </div>

      {showSuccessModal && (
        <Modal
          title="Account Verified"
          message="Your account has been successfully verified. You can now log in."
          buttonText="Go to Login"
          onClose={() => {
            setShowSuccessModal(false);
            navigate("/login");
          }}
        />
      )}
    </>
  );
}

export default VerifyOtp;
