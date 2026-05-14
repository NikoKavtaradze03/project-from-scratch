import { axiosFetch } from "@/lib/axios-api";
import type { GetProfileResponse } from "../types/profileTypes";

export function getProfile(username: string) {
  return axiosFetch<GetProfileResponse>(`/profiles/${username}`);
}

export function followProfile(username: string) {
  return axiosFetch<GetProfileResponse>(`/profiles/${username}/follow`, {
    method: "POST",
  });
}

export function unfollowProfile(username: string) {
  return axiosFetch<GetProfileResponse>(`/profiles/${username}/follow`, {
    method: "DELETE",
  });
}
