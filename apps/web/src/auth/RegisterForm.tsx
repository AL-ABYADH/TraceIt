"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@repo/shared-schemas";
import type { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterForm({
  onSuccess,
  onToggleMode,
}: {
  onSuccess: () => void;
  onToggleMode: () => void;
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setSignupError(null);
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const { accessToken, refreshToken } = await res.json();
      // Store tokens (adjust based on your storage strategy)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      onSuccess();
    } catch (err: any) {
      console.error("Signup error:", err);
      setSignupError(err.message || "An error occurred during registration");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onToggleMode}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              {...register("username")}
              type="text"
              autoComplete="username"
              className={`mt-1 block w-full rounded-md border ${
                errors?.username ? "border-red-300" : "border-gray-300"
              } text-black px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Username"
            />
            {errors?.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              id="displayName"
              {...register("displayName")}
              type="text"
              autoComplete="name"
              className={`mt-1 block w-full rounded-md border ${
                errors.displayName ? "border-red-300" : "border-gray-300"
              } text-black px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="John Doe"
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                {...register("password")}
                type={passwordVisible ? "text" : "password"}
                autoComplete="new-password"
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

        {signupError && <div className="text-red-600 text-sm text-center">{signupError}</div>}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md text-xs text-blue-800 space-y-1">
        <p className="font-semibold">Validation Rules:</p>
        <ul className="list-disc pl-4">
          <li>Email must be valid</li>
          <li>Username: 3–20 chars, alphanumeric + underscores</li>
          <li>Password: 8+ chars with uppercase, number, and special char</li>
          <li>Display name is required (3–50 chars)</li>
        </ul>
      </div>
    </>
  );
}
