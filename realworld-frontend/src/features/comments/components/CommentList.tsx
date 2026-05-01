import ArticleMeta from "@/features/articles/components/ArticleMeta";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment, type Comment } from "../api/commentsApi";
import { queryKeys } from "@/lib/queryKeys";

type CommentListProps = {
  slug: string;
  comments: Comment[];
};
const dangerButtonStyle =
  "h-full cursor-pointer border-(--color-danger) text-(--color-danger) hover:bg-(--color-danger) hover:text-(--color-text) disabled:cursor-not-allowed";

export function CommentList({ slug, comments }: CommentListProps) {
  const { data: currentUserResponse } = useCurrentUser();
  const currentUser = currentUserResponse?.user;

  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(slug, commentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byArticle(slug),
      });
    },
  });

  return (
    <div className="space-y-4">
      {comments?.map((comment) => (
        <div
          key={comment.id}
          className="p-4 border border-(--color-border) rounded-md space-y-2"
        >
          <div className="flex justify-between">
            <ArticleMeta
              username={comment.author.username}
              createdAt={comment.createdAt}
              image={comment.author.image}
            />
            {currentUser?.username === comment.author.username && (
              <Button
                type="button"
                variant="outline"
                className={`${dangerButtonStyle} py-1`}
                onClick={() => deleteCommentMutation.mutate(comment.id)}
                disabled={deleteCommentMutation.isPending}
              >
                <Trash size={16} strokeWidth={3} />
                Delete Comment
              </Button>
            )}
          </div>

          <p className="text-sm text-(--color-text) mb-2 bg-(--color-surface-elevated) p-3 rounded-md">
            {comment.body}
          </p>
        </div>
      ))}
    </div>
  );
}
