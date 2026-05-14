import { axiosFetch } from "@/lib/axios-api";
import type {
  GetCommentsResponse,
  CreateCommentResponse,
} from "../types/commentsTypes";

export function getComments(slug: string) {
  return axiosFetch<GetCommentsResponse>(`/articles/${slug}/comments`);
}

export function createComment(slug: string, body: string) {
  return axiosFetch<CreateCommentResponse>(`/articles/${slug}/comments`, {
    method: "POST",
    body: JSON.stringify({
      comment: {
        body,
      },
    }),
  });
}

export function deleteComment(slug: string, commentId: number) {
  return axiosFetch(`/articles/${slug}/comments/${commentId}`, {
    method: "DELETE",
  });
}
