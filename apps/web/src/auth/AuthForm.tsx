"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Mode = "login" | "register";

export default function AuthFormContainer() {
  const [mode, setMode] = useState<Mode>("login");
  const [loggedIn, setLoggedIn] = useState(false);

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  if (loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 text-center">
        <h1 className="text-2xl font-bold text-green-700">Hello, you're logged in!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {mode === "login" ? (
          <LoginForm onSuccess={() => setLoggedIn(true)} onToggleMode={toggleMode} />
        ) : (
          <RegisterForm onSuccess={() => setLoggedIn(true)} onToggleMode={toggleMode} />
        )}
      </div>
    </div>
  );
}
