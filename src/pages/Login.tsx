import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { login } from "../api/auth";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import { Loader2, LockKeyhole, Mail } from "lucide-react";


import forestBg from "../assets/forest.png";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required should not be empty"),
});

type LoginForm = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/dashboard", { replace: true });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Login failed, please try again";
      setError("password", { type: "manual", message });
    },
  });

  const onSubmit = (data: LoginForm) => loginMutation.mutate(data);

  const apiError =
    loginMutation.error instanceof Error ? loginMutation.error.message : "";

  return (
    <div className="min-h-screen bg-[#0b1410]">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[60%_40%]">  
        {/* ✅ LEFT SIDE IMAGE */}
        <div className="relative hidden lg:block">
          <img
            src={forestBg}
            alt="Forest background"
            className="h-full w-full object-cover"
          />

          {/* soft dark overlay for readability */}
          <div className="absolute inset-0 bg-linear-to-tr from-black/60 via-black/20 to-transparent" />

          {/* optional text overlay */}
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <p className="text-sm opacity-90">Welcome to Auth Learning</p>
            <h2 className="text-3xl font-bold leading-tight mt-2">
              Secure login,
              <br />
              inspired by nature 🌲
            </h2>
            <p className="text-sm opacity-80 mt-3 max-w-md">
              A calm, secure experience with cookie-based authentication.
            </p>
          </div>
        </div>

        {/* ✅ RIGHT SIDE FORM */}
        <div className="flex items-center justify-center px-5 py-10 bg-linear-to-br from-[#f6f3ea] via-[#f3f0e6] to-[#efeadd]">
          <Card className="w-full max-w-md border border-black/10 shadow-2xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#1f2a1f]">
                  Welcome Back
                </h1>
                <p className="text-sm text-[#4c5a4c] mt-1">
                  Login to continue securely
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* API error */}
              {apiError && (
                <Alert variant="destructive">
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#2b3a2b]">
                    Email
                  </Label>

                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64755f]"
                      size={18}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 bg-white/70 border-black/10 focus-visible:ring-[#3a5a40]"
                      {...register("email")}
                      disabled={loginMutation.isPending}
                    />
                  </div>

                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#2b3a2b]">
                    Password
                  </Label>

                  <div className="relative">
                    <LockKeyhole
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64755f]"
                      size={18}
                    />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 bg-white/70 border-black/10 focus-visible:ring-[#3a5a40]"
                      {...register("password")}
                      disabled={loginMutation.isPending}
                    />
                  </div>

                  {errors.password && (
                    <p className="text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-[#3a5a40] hover:bg-[#2f4d35] text-white shadow-md"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1 bg-black/10" />
                  <span className="text-xs text-[#5a6a5a]">or</span>
                  <Separator className="flex-1 bg-black/10" />
                </div>

                {/* Links */}
                <div className="flex justify-between items-center text-sm">
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-medium text-[#3a5a40] hover:underline"
                  >
                    Create Account
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/forgotpassword")}
                    className="font-medium text-[#3a5a40] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>

              <p className="text-xs text-center text-[#6b7c6b]">
                Protected using secure cookie-based authentication.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;
