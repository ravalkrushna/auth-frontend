import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { getEmailFromToken } from "../utils/jwt";
import { logout } from "../api/auth";

function Dashboard() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userEmail = token ? getEmailFromToken(token) : null;

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      localStorage.removeItem("token");
      navigate("/login");
    }
  });

  const handleLogout = () => {
    if (!token) {
      navigate("/login");
      return;
    }
  logoutMutation.mutate();

  }


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Auth Learning</h1>
            <p className="text-sm text-gray-600">
              Logged in as:{" "}
              <span className="font-medium">{userEmail || "Unknown User"}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/changepassword")}
              className="text-sm bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-600 transition"
            >
              Change Password
            </button>

            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="text-sm bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition disabled:opacity-60"
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </div>
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
            <p className="text-gray-500 mt-2">
              {userEmail ? `You are logged in as ${userEmail}` : "Not logged in"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">Security</h3>
            <p className="text-gray-500 mt-2">
              JWT Auth Enabled: <span className="font-medium">{token ? "YES " : "NO "}</span>
            </p>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;