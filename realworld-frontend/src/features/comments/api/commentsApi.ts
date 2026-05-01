import { apiFetch } from "@/lib/api";

export type Comment = {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
};

type GetCommentsResponse = {
  comments: Comment[];
};

type CreateCommentResponse = {
  comment: Comment;
};

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
  return apiFetch(`/articles/${slug}/comments/${commentId}`, {
    method: "DELETE",
  });
}
