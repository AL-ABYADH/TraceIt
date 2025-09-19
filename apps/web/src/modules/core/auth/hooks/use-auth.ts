"use client";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction, setUser } from "../store/auth-slice";

export function useAuth() {
  const auth = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: !!auth.token,
    setUser: (u: any) => dispatch(setUser(u)),
    logout: () => dispatch(logoutAction()),
  };
}
