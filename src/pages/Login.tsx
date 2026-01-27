import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '../api/auth';

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required should not be empty"),
});

type LoginForm = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();

  const { register, handleSubmit, setError, formState: { errors }, } = useForm<LoginForm>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" }, });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (!data?.token) {
        throw new Error("Token missing after login");
      }

      localStorage.setItem("token", data.token);

      navigate("/dashboard", { replace: true });
    },


    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Login failed, please try again";
      setError("password", { type: "manual", message });
    }
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full mb-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mb-3">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full mb-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mb-3">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-between items-center mt-4 text-sm">
            <button
              type="button"
              onClick={() => navigate("/register")} 
              className="text-blue-700 font-medium hover:underline"
            >
              Create Account
            </button>

            <button
              type="button"
              onClick={() => navigate("/forgotpassword")}
              className="text-blue-700 font-medium hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login; 