import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlreadyUserModal, setShowAlreadyUserModal] = useState(false);


  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signup({ email, password });
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";

      if (message.toLowerCase().includes("already")) {
        setShowAlreadyUserModal(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-pink-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Sign Up
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-pink-600 text-white py-2 rounded-md font-medium hover:bg-pink-700 transition disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-pink-700 font-medium hover:underline"
            >
              Login
            </button>
          </p>


          {error && (
            <p className="text-sm text-center text-red-600 mt-4">
              {error}
            </p>
          )}
        </div>
      </div>

      {showAlreadyUserModal && (
        <Modal
          title="Account already exists"
          message="This email is already registered. Please login to continue."
          buttonText="Go to Login"
          onClose={() => {
            setShowAlreadyUserModal(false);
            navigate("/login");
          }}
        />
      )}


      {showSuccessModal && (
        <Modal
          title="OTP Sent"
          message="We’ve sent an OTP to your email. Please verify your account to continue."
          buttonText="Verify OTP"
          onClose={() => {
            setShowSuccessModal(false);
            navigate("/verifyotp", {
              state: { email },
            });
          }}
        />
      )}
    </>
  );
}

export default Register;
