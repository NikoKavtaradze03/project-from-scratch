import { apiFetch, apiFetchVoid } from "@/lib/api";
import type { GetProfileResponse } from "../types/profileTypes";

export function getProfile(username: string) {
  return apiFetch<GetProfileResponse>(`/profiles/${username}`);
}

export function followProfile(username: string) {
  return apiFetchVoid(`/profiles/${username}/follow`, {
    method: "POST",
  });
}

export function unfollowProfile(username: string) {
  return apiFetchVoid(`/profiles/${username}/follow`, {
    method: "DELETE",
  });
}
