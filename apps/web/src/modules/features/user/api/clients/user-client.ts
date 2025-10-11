import { http } from "@/services/api/http";
import { userEndpoints } from "../user-endpoints";
import { UserDto } from "@repo/shared-schemas";

async function getCurrentUser(): Promise<UserDto> {
  return http.get(userEndpoints.me);
}

export const userClient = {
  getCurrentUser,
};
