"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";

import { authClient } from "@/modules/core/auth/api/clients/auth-client";
import { RegisterDto, registerSchema } from "@repo/shared-schemas";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";

import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const signupMutation = useMutation({
    mutationFn: (payload: RegisterDto) => authClient.register(payload),
    onSuccess: () => {
      showNotification({
        title: "Account Created",
        message: "Your account has been created successfully!",
        color: "green",
        autoClose: 4000,
      });
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

      const msg = err?.response?.data?.message ?? err?.message ?? "Sign up failed";
      setErrorMsg(msg);
    },
  });

  function onSubmit(values: RegisterDto) {
    const payload: RegisterDto = {
      displayName: values.displayName,
      password: values.password,
      ...(values.username ? { username: values.username } : {}),
      ...(values.email ? { email: values.email } : {}),
    } as RegisterDto;

    signupMutation.mutate(payload);
  }

  if (signupMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading isOpen={signupMutation.isPending} message="Creating your account..." />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={errorMsg} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Create account</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block mb-4">
            <span className="text-sm font-medium text-foreground mb-1 block">Display Name</span>
            <input
              {...register("displayName")}
              className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.displayName && (
              <p className="mt-2 text-sm text-destructive">{errors.displayName.message}</p>
            )}
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-foreground mb-1 block">Username</span>
            <input
              {...register("username")}
              className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.username && (
              <p className="mt-2 text-sm text-destructive">{errors.username.message}</p>
            )}
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-foreground mb-1 block">Email</span>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-destructive">{errors.email.message}</p>
            )}
          </label>

          <label className="block mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-foreground">Password</span>
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-sm text-primary hover:text-primary-hover underline"
              >
                {showPassword ? "Hide" : "Show"} Password
              </button>
            </div>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-destructive">{errors.password.message}</p>
            )}
          </label>

          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-60 transition"
            >
              Create account
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-primary hover:text-primary-hover underline"
            >
              Already have an account?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
