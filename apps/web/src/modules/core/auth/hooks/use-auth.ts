"use client";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../store/auth-slice";

export function useAuth() {
  const auth = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  return {
    token: auth.token,
    isAuthenticated: !!auth.token,
    logout: () => dispatch(logoutAction()),
  };
}
