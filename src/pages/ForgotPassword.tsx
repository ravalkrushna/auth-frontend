import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { sendForgotOtp } from "../api/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { Mail, ShieldCheck } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Please enter email").email("Enter a valid email"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const sendOtpMutation = useMutation({
    mutationFn: sendForgotOtp,
    onSuccess: () => {
      const email = getValues("email");
      sessionStorage.setItem("resetEmail", email);
      navigate("/resetpassword", { replace: true });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Sending OTP failed";
      // show under form instead of annoying alert popup
      console.error(message);
    },
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    sendOtpMutation.mutate(data);
  };

  const apiError =
    sendOtpMutation.error instanceof Error ? sendOtpMutation.error.message : "";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-slate-50 via-indigo-50 to-sky-50">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl border border-white/60">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700">
              <ShieldCheck size={18} />
            </div>

            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Forgot Password
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                We’ll send an OTP to your email for verification
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ✅ API error (soft, not bright) */}
          {apiError && (
            <Alert variant="destructive">
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="pl-10"
                  {...register("email")}
                  disabled={sendOtpMutation.isPending}
                />
              </div>

              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
            </Button>

            {/* Back */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
              disabled={sendOtpMutation.isPending}
            >
              Back to Login
            </Button>
          </form>

          {/* ✅ Soft helper note */}
          <p className="text-xs text-muted-foreground text-center">
            Make sure to check your inbox & spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPassword;
