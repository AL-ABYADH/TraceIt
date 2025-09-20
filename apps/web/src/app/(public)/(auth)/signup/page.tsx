"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authClient } from "@/modules/core/auth/api/clients/auth-client";
import { RegisterDto, registerSchema } from "@repo/shared-schemas";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

      const msg = err?.response?.data?.message ?? err?.message ?? "Sign up failed";
      setServerError(msg);
    },
  });

  function onSubmit(values: RegisterDto) {
    setServerError(null);

    const payload: RegisterDto = {
      displayName: values.displayName,
      password: values.password,
      ...(values.username ? { username: values.username } : {}),
      ...(values.email ? { email: values.email } : {}),
    } as RegisterDto;

    signupMutation.mutate(payload);
  }

  return (
    <div className="mx-auto my-12 max-w-md p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Create account</h2>

      {serverError && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="block mb-3">
          <div className="text-sm text-gray-700 mb-1">Display name</div>
          <input
            {...register("displayName")}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
          />
          {errors.displayName && (
            <p className="mt-1 text-sm text-red-700">{errors.displayName.message}</p>
          )}
        </label>

        <label className="block mb-3">
          <div className="text-sm text-gray-700 mb-1">Username</div>
          <input
            {...register("username")}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-700">{errors.username.message}</p>
          )}
        </label>

        <label className="block mb-3">
          <div className="text-sm text-gray-700 mb-1">Email</div>
          <input
            {...register("email")}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
            type="email"
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>}
        </label>

        <label className="block mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm text-gray-700">Password</div>
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-sm underline text-green-600"
            >
              {showPassword ? "Hide" : "Show"} Password
            </button>
          </div>

          <input
            {...register("password")}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-700">{errors.password.message}</p>
          )}
        </label>

        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60"
          >
            {signupMutation.isPending ? "Creating..." : "Create account"}
          </button>

          <button
            type="button"
            className="text-sm underline text-green-600"
            onClick={() => router.push("/login")}
          >
            Already have an account?
          </button>
        </div>
      </form>
    </div>
  );
}
