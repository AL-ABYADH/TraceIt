"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authClient } from "@/modules/core/auth/api/clients/auth-client";
import { LoginDto, loginSchema } from "@repo/shared-schemas";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginDto) => authClient.login(payload),
    onSuccess: () => {
      setServerError(null);
      router.replace("/");
    },
    onError: (err: any) => {
      setServerError(null);

      if (isApiValidationError(err)) {
        const serverErrors = err.data.errors as ApiFieldValidationError[];
        serverErrors.forEach(({ field, message }) => {
          setError(field as any, { type: "server", message });
        });
        return;
      }

      const msg = err?.response?.data?.message ?? err?.message ?? "Login failed";
      setServerError(msg);
    },
  });

  function onSubmit(values: LoginDto) {
    setServerError(null);
    loginMutation.mutate(values);
  }

  return (
    <div className="mx-auto my-12 max-w-md p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl text-gray-700 font-semibold mb-6">Welcome back</h2>

      {serverError && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="block mb-3">
          <div className="text-sm text-gray-700 mb-1">Username</div>
          <input
            {...register("username")}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
            type="username"
            autoComplete="username"
            required
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-700">{errors.username.message}</p>
          )}
        </label>

        <label className="block mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm text-gray-700">Password</div>
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-sm underline text-blue-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <input
            {...register("password")}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-700">{errors.password.message}</p>
          )}
        </label>

        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className="text-sm text-blue-600 underline"
            onClick={() => router.push("/signup")}
          >
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
