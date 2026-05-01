import { apiFetch } from "@/lib/api";

type getTagsResponse = {
  tags: string[];
};

export function getTags() {
  return apiFetch<getTagsResponse>("/tags");
}
