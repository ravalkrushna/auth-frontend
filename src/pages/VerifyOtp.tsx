import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtp } from "../api/auth";

const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

type OtpForm = z.infer<typeof otpSchema>;

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = (location.state as { email?: string })?.email || "";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: OtpForm) => {
      if (!email) throw new Error("Email missing, please signup again");
      return verifyOtp({ email, otp: data.otp.trim() });
    },
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : "OTP verification failed. Invalid OTP!";

      setError("otp", { type: "manual", message });
    },
  });

  const onSubmit = (data: OtpForm) => verifyOtpMutation.mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Verify OTP
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            value={email}
            disabled
            className="w-full mb-4 px-4 py-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
          />

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter OTP"
            {...register("otp")}
            className="w-full mb-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {errors.otp && (
            <p className="text-sm text-center text-red-600 mb-4">
              {errors.otp.message}
            </p>
          )}

          <button
            type="submit"
            disabled={verifyOtpMutation.isPending || !email}
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {!email && (
          <p className="text-sm text-center text-red-600 mt-4">
            Email missing. Please signup again.
          </p>
        )}
      </div>
    </div>
  );
}

export default VerifyOtp;
