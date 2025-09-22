"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";

import { authClient } from "@/modules/core/auth/api/clients/auth-client";
import { LoginDto, loginSchema } from "@repo/shared-schemas";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";

export default function LoginPage() {
  const router = useRouter();
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
      router.replace("/");
    },
    onError: (err: any) => {
      if (isApiValidationError(err)) {
        const serverErrors = err.data.errors as ApiFieldValidationError[];
        serverErrors.forEach(({ field, message }) => {
          setError(field as any, { type: "server", message });
        });
        return;
      }

      const msg = err?.response?.data?.message ?? err?.message ?? "Login failed";

      showNotification({
        title: "Login Failed",
        message: msg,
        color: "red",
        autoClose: 4000,
        styles: (theme) => ({
          root: {
            backgroundColor: "var(--card)",
            color: "var(--foreground)",
            border: `1px solid var(--border)`,
            minWidth: "300px",
          },
          title: {
            color: "var(--destructive-foreground)",
          },
          description: {
            color: "var(--foreground)",
          },
        }),
      });
    },
  });

  function onSubmit(values: LoginDto) {
    loginMutation.mutate(values);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Welcome back</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Username */}
          <label className="block mb-4">
            <span className="text-sm font-medium text-foreground mb-1 block">Username</span>
            <input
              {...register("username")}
              className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              type="text"
              autoComplete="username"
            />
            {errors.username && <p className="mt-2 text-sm">{errors.username.message}</p>}
          </label>

          {/* Password */}
          <label className="block mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-foreground">Password</span>
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-sm text-primary hover:text-primary-hover underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              {...register("password")}
              className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-destructive">{errors.password.message}</p>
            )}
          </label>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-60 transition"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              className="text-sm text-primary hover:text-primary-hover underline"
              onClick={() => router.push("/signup")}
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
