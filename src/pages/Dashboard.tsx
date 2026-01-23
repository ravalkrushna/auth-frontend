function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Auth Learning
          </h1>

          <button
            className="text-sm bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            // later: onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Dashboard
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Profile Status
            </h3>
            <p className="text-gray-500 mt-2">
              Your account is active and verified.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Login Sessions
            </h3>
            <p className="text-gray-500 mt-2">
              You are currently logged in.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Security
            </h3>
            <p className="text-gray-500 mt-2">
              JWT-based authentication enabled.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
