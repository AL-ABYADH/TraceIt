"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authClient } from "@/modules/core/auth/api/clients/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (payload: { email: string; password: string }) => authClient.login(payload),
    onSuccess: () => {
      setServerError(null);
      router.replace("/");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? "Login failed";
      setServerError(msg);
    },
  });

  function validateEmail(v: string) {
    return /\S+@\S+\.\S+/.test(v);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!email || !password) {
      setServerError("Please provide email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setServerError("Please provide a valid email address.");
      return;
    }
    loginMutation.mutate({ email, password });
  }

  return (
    <div className="mx-auto my-12 max-w-md p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl text-gray-700 font-semibold mb-6">Welcome back</h2>

      {serverError && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{serverError}</div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block mb-3">
          <div className="text-sm text-gray-700 mb-1">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label className="block mb-3">
          <div className="text-sm text-gray-700 mb-1">Password</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
            type="password"
            autoComplete="current-password"
            required
          />
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
