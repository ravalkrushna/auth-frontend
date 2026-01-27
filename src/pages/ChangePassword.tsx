import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { changePassword } from "../api/auth";

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1,"Old password is required"),
  newPassword: z.string().min(6,"New password must be at least 6 characters long"),
  confirmNewPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

function ChangePassword() {
  const navigate = useNavigate();

  const {register , handleSubmit , setError , formState: {errors} , } = useForm<ChangePasswordForm> ({
    resolver: zodResolver(changePasswordSchema), defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  
  const changePasswordMutation = useMutation ({
    mutationFn: (data: ChangePasswordForm) => 
      changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }),
      onSuccess: () => {
        alert("Password changed successfully. Please login again.");
        navigate("/login");
      },
      onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Change password failed";

      setError("oldPassword", { type: "manual", message });
    },
  });

  const onSubmit = (data: ChangePasswordForm) => {
    changePasswordMutation.mutate(data);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-sky-100 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-white shadow-xl rounded-2xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          <p className="text-sm text-gray-600 mt-1">
            Update your password securely
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              type="password"
              placeholder="Enter old password"
              {...register("oldPassword")}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition"
            />
            {errors.oldPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              {...register("newPassword")}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              {...register("confirmNewPassword")}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition"
            />
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="w-full rounded-xl bg-indigo-600 text-white font-semibold py-3 shadow-md hover:bg-indigo-700 active:scale-[0.99] transition disabled:opacity-60"
          >
            {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold py-3 shadow-sm hover:bg-gray-50 transition"
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;