"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authClient } from "@/modules/core/auth/api/clients/auth-client";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

  const signupMutation = useMutation({
    mutationFn: (payload: {
      displayName: string;
      username: string;
      email: string;
      password: string;
    }) => authClient.register(payload),
    onSuccess: () => {
      setServerError(null);
      router.replace("/");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? "Sign up failed";
      setServerError(msg);
    },
  });

  function validateEmail(v: string) {
    return /\S+@\S+\.\S+/.test(v);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!displayName) {
      setServerError("Please provide a display name.");
      return;
    }
    if (!username && !email) {
      setServerError("Please provide either a username or an email.");
      return;
    }
    if (email && !validateEmail(email)) {
      setServerError("Please provide a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setServerError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setServerError("Passwords do not match.");
      return;
    }

    const payload: any = { displayName, password };
    if (username) payload.username = username;
    if (email) payload.email = email;

    signupMutation.mutate(payload);
  }

  return (
    <div className="mx-auto my-12 max-w-md p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Create account</h2>

      {serverError && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{serverError}</div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block mb-3">
          <div className="text-sm text-gray-700 mb-1">Display name</div>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
          />
        </label>

        <label className="block mb-3">
          <div className="text-sm text-gray-700 mb-1">Username</div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
          />
        </label>

        <label className="block mb-3">
          <div className="text-sm text-gray-700 mb-1">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
            type="email"
            autoComplete="email"
          />
        </label>

        <label className="block mb-3">
          <div className="text-sm text-gray-700 mb-1">Password</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
            type="password"
            autoComplete="new-password"
          />
        </label>

        <label className="block mb-3">
          <div className="text-sm text-gray-700 mb-1">Confirm password</div>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-900"
            type="password"
            autoComplete="new-password"
          />
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
