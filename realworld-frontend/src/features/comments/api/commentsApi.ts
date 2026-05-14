import { apiFetch, apiFetchVoid } from "@/lib/api";
import type {
  GetCommentsResponse,
  CreateCommentResponse,
} from "../types/commentsTypes";

export function getComments(slug: string) {
  return apiFetch<GetCommentsResponse>(`/articles/${slug}/comments`);
}

export function createComment(slug: string, body: string) {
  return apiFetch<CreateCommentResponse>(`/articles/${slug}/comments`, {
    method: "POST",
    body: JSON.stringify({
      comment: {
        body,
      },
    }),
  });
}

export function deleteComment(slug: string, commentId: number) {
  return apiFetchVoid(`/articles/${slug}/comments/${commentId}`, {
    method: "DELETE",
  });
}
