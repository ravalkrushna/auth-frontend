import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { changePassword } from "../api/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { KeyRound, Lock, ShieldCheck } from "lucide-react";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

function ChangePassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onTouched",
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordForm) =>
      changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      // ✅ better than alert (optional)
      navigate("/login", { replace: true });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Change password failed";
      setError("oldPassword", { type: "manual", message });
    },
  });

  const onSubmit = (data: ChangePasswordForm) => {
    changePasswordMutation.mutate(data);
  };

  const apiError =
    changePasswordMutation.error instanceof Error
      ? changePasswordMutation.error.message
      : "";

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-sky-100 to-purple-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl border">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck size={18} />
            </div>

            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Change Password
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Update your password securely
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ✅ API error */}
          {apiError && (
            <Alert variant="destructive">
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Old Password */}
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Old Password</Label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="oldPassword"
                  type="password"
                  placeholder="Enter old password"
                  className="pl-10"
                  {...register("oldPassword")}
                  disabled={changePasswordMutation.isPending}
                />
              </div>
              {errors.oldPassword && (
                <p className="text-sm text-red-600">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <KeyRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="pl-10"
                  {...register("newPassword")}
                  disabled={changePasswordMutation.isPending}
                />
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <div className="relative">
                <KeyRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="pl-10"
                  {...register("confirmNewPassword")}
                  disabled={changePasswordMutation.isPending}
                />
              </div>
              {errors.confirmNewPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <Button
              type="submit"
              className="w-full"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/dashboard")}
              disabled={changePasswordMutation.isPending}
            >
              Back to Dashboard
            </Button>
          </form>

          {/* ✅ small helper note */}
          <p className="text-xs text-muted-foreground text-center">
            After successful password change, you'll be redirected to login.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChangePassword;
