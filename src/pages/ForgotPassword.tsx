import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { sendForgotOtp } from "../api/auth";

const forgotPasswordSchema = z.object({
  email: z.string().min(1,"please enter email").email("enter a vaid email"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;


function ForgotPassword() {

  const navigate = useNavigate();
  const {register, handleSubmit, getValues, formState: {errors}, } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema), defaultValues: {
      email: "",
    },
  });
  
  const sendOtpMutation = useMutation({
    mutationFn: sendForgotOtp,
      onSuccess: () => {
        const email = getValues("email");
        sessionStorage.setItem("resetEmail", email);
        alert("OTP sent to your email");
        navigate("/resetpassword" , {replace: true});
      },
      onError: (err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Sending OTP failed";
            
        alert(message);
      }
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    sendOtpMutation.mutate(data);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-100 via-indigo-100 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-white shadow-xl rounded-2xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-sm text-gray-600 mt-1">
            We’ll send an OTP to your email for verification
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              {...register("email")}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition"
            />

            {errors.email && (
              <p className="text-sm text-red-600 mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={sendOtpMutation.isPending}
            className="w-full rounded-xl bg-indigo-600 text-white font-semibold py-3 shadow-md hover:bg-indigo-700 active:scale-[0.99] transition disabled:opacity-60"
          >
            {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
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


export default ForgotPassword;
