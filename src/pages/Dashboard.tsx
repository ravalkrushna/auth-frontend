import { useNavigate } from "react-router-dom";
import { getEmailFromToken } from "../utils/jwt";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userEmail = token ? getEmailFromToken(token) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Auth Learning</h1>
            <p className="text-sm text-gray-600">
              Logged in as:{" "}
              <span className="font-medium">
                {userEmail || "Unknown User"}
              </span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">Profile</h3>
            <p className="text-gray-500 mt-2">
              Email: <span className="font-medium">{userEmail || "N/A"}</span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">Login Status</h3>
            <p className="text-gray-500 mt-2">You are logged in as {userEmail}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">Security</h3>
            <p className="text-gray-500 mt-2">JWT Auth Enabled </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
