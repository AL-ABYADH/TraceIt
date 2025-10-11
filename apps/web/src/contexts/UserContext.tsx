"use client";

import { createContext, useContext } from "react";
import { UserDto } from "@repo/shared-schemas";

interface UserContextProps {
  user: UserDto;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = UserContext.Provider;
