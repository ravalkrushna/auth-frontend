import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../api/auth";

export default function ChangePassword() {
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await changePassword({ oldPassword, newPassword });
            alert("Password updated ");
            navigate("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Failed to update password");
            }
        }

        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 text-white">
            <div className="w-full max-w-md bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Change Password</h1>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
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

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="w-full bg-gray-700 hover:bg-gray-600 transition p-3 rounded-lg font-semibold"
                    >
                        Back to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
