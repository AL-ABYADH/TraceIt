import { http } from "@/services/api/http";
import { authEndpoints } from "../auth-endpoints";
import { LoginDto, RegisterDto } from "@repo/shared-schemas";

async function login(payload: LoginDto) {
  return http.post(authEndpoints.login, { body: payload });
}

async function register(payload: RegisterDto) {
  return http.post(authEndpoints.register, { body: payload });
}

async function logout() {
  return http.post(authEndpoints.logout);
}

export const authClient = {
  login,
  register,
  logout,
};
