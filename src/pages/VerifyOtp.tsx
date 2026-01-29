import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { verifyOtp } from "../api/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import type { ControllerRenderProps } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

  const form = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
    mode: "onTouched",
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

      form.setError("otp", { type: "manual", message });
    },
  });

  const onSubmit = (data: OtpForm) => verifyOtpMutation.mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Verify OTP
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email missing warning */}
          {!email && (
            <Alert variant="destructive">
              <AlertDescription>
                Email missing. Please signup again.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email (disabled) */}
              <div className="space-y-2">
                <FormLabel>Email</FormLabel>
                <Input value={email} disabled />
              </div>

              {/* OTP */}
              <FormField
                control={form.control}
                name="otp"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<OtpForm, "otp">;
                }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit OTP"
                        inputMode="numeric"
                        maxLength={6}
                        autoComplete="one-time-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={verifyOtpMutation.isPending || !email}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyOtp;
