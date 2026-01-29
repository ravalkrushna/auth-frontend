import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { signup } from "../api/auth";

const registerSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      const email = getValues("email");
      navigate("/verifyotp", { state: { email } });
    },
  });

  const onSubmit = (data: RegisterForm) => {
    signupMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  const errorMessage =
    signupMutation.error instanceof Error ? signupMutation.error.message : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full mb-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mb-3">
              {errors.email.message}
            </p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full mb-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mb-4">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full bg-pink-600 text-white py-2 rounded-md font-medium hover:bg-pink-700 transition disabled:opacity-60"
          >
            {signupMutation.isPending ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-pink-700 font-medium hover:underline"
          >
            Login
          </button>
        </p>

        {errorMessage && (
          <p className="text-sm text-center text-red-600 mt-4">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;