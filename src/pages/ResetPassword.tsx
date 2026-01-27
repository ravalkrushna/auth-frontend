import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPassword } from "../api/auth";

const resetPasswordSchema = z.object({
    otp: z
      .string()
      .min(1, "OTP is required")
      .length(6, "OTP must be exactly 6 digits")
      .regex(/^\d+$/, "OTP must contain only digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPassword() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("resetEmail") || "";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetMutation = useMutation({
    mutationFn: (data: ResetPasswordForm) => {
      if (!email) {
        throw new Error("Email missing. Please start Forgot Password again.");
      }

      return resetPassword({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      alert("Password reset successful ");
      sessionStorage.removeItem("resetEmail");
      navigate("/login", { replace: true });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Reset failed";

      setError("otp", { type: "manual", message });
    },
  });

  const onSubmit = (data: ResetPasswordForm) => {
    resetMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-indigo-100 to-sky-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-white shadow-xl rounded-2xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-sm text-gray-600 mt-1">
            Enter OTP and set your new password
          </p>
        </div>

        {!email && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-2 text-sm">
            Email missing. Please start Forgot Password again.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 shadow-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">OTP</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter OTP"
              {...register("otp")}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition"
            />
            {errors.otp && (
              <p className="text-sm text-red-600 mt-2">{errors.otp.message}</p>
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
              <p className="text-sm text-red-600 mt-2">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={resetMutation.isPending || !email}
            className="w-full rounded-xl bg-green-600 text-white font-semibold py-3 shadow-md hover:bg-green-700 active:scale-[0.99] transition disabled:opacity-60"
          >
            {resetMutation.isPending ? "Updating..." : "Update Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold py-3 shadow-sm hover:bg-gray-50 transition"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;