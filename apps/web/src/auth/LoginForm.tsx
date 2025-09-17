"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, projectDetailSchema, ProjectStatus } from "@repo/shared-schemas";
import type { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

type LoginFormType = z.infer<typeof loginSchema>;
// type projectschemType = z.infer<typeof projectDetailSchema>
// const project: projectschemType = {
//   id: "123",
//   name: "My Project",
//   status: ProjectStatus.ACTIVE,
//   createdAt: new Date().toISOString(),
//   owner: {
//     id: "user-1",
//     username: "john",
//     displayName: "John",
//     email: "john@example.com",
//     emailVerified: true,
//     createdAt: new Date().toISOString(),
//     // etc...
//   },
//   useCases: [
//     {
//       id: "uc1",
//       name: "Login Use Case",
//       createdAt: new Date().toISOString(),
//       // etc...
//     },
//   ],
//   // etc...,
// };
// project.useCases[0].
export default function LoginForm({
  onSuccess,
  onToggleMode,
}: {
  onSuccess: () => void;
  onToggleMode: () => void;
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      setLoginError(null);
      // At least one of email or username must be provided
      if (!data.email && !data.username) {
        throw new Error("Either email or username must be provided");
      }

      const payload = {
        ...(data.email && { email: data.email }),
        ...(data.username && { username: data.username }),
        password: data.password,
      };

      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { accessToken, refreshToken } = await res.json();
      // Store tokens (adjust based on your storage strategy)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      onSuccess();
    } catch (err: any) {
      console.error("Login error:", err);
      setLoginError(err.message || "An error occurred during login");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Watch email and username fields to show/hide validation message
  const emailValue = watch("email");
  const usernameValue = watch("username");

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
        <p className="mt-2 text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onToggleMode}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email (optional)
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              autoComplete="email"
              className={`mt-1 block w-full rounded-md border ${
                errors?.email ? "border-red-300" : "border-gray-300"
              } text-black px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="you@example.com"
            />
            {errors?.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username (optional)
            </label>
            <input
              id="username"
              {...register("username")}
              type="text"
              autoComplete="username"
              className={`mt-1 block w-full rounded-md border ${
                errors?.username ? "border-red-300" : "border-gray-300"
              } text-black px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="your_username"
            />
            {errors?.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {!emailValue && !usernameValue && (
            <p className="text-sm text-red-600">Please provide either email or username</p>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                {...register("password")}
                type={passwordVisible ? "text" : "password"}
                autoComplete="current-password"
                className={`mt-1 block w-full rounded-md border ${
                  errors?.password ? "border-red-300" : "border-gray-300"
                } text-black px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-2 px-2 flex items-center text-gray-500"
                tabIndex={-1}
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors?.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        </div>

        {loginError && <div className="text-red-600 text-sm text-center">{loginError}</div>}

        <div>
          <button
            type="submit"
            disabled={isSubmitting || (!emailValue && !usernameValue)}
            className="w-full flex justify-center items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md text-xs text-blue-800 space-y-1">
        <p className="font-semibold">Validation Rules:</p>
        <ul className="list-disc pl-4">
          <li>Either email or username must be provided</li>
          <li>Password: 8+ chars with uppercase, number, and special char</li>
        </ul>
      </div>
    </>
  );
}
