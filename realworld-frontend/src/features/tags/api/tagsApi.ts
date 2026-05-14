import { axiosFetch } from "@/lib/axios-api";

type getTagsResponse = {
  tags: string[];
};

export function getTags() {
  return axiosFetch<getTagsResponse>("/tags");
}
