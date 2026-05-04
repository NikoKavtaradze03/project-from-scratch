import { apiFetch } from "@/lib/api";

export type Profile = {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
};

type GetProfileResponse = {
  profile: Profile;
};

export function getProfile(username: string) {
  return apiFetch<GetProfileResponse>(`/profiles/${username}`);
}

export function followProfile(username: string) {
  return apiFetch<GetProfileResponse>(`/profiles/${username}/follow`, {
    method: "POST",
  });
}

export function unfollowProfile(username: string) {
  return apiFetch<GetProfileResponse>(`/profiles/${username}/follow`, {
    method: "DELETE",
  });
}
