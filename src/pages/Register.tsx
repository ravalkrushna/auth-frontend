import { useState } from "react";
import { signup } from "../api/auth";

function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async () => {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const responseMessage = await signup({ email, password });
      setMessage(responseMessage);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Signing up..." : "Sign Up"}
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

export default Register;
