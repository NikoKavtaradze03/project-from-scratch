import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getComments } from "../api/commentsApi";
import ArticleMeta from "@/features/articles/components/ArticleMeta";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { createComment } from "../api/commentsApi";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";

type ArticleCommentsProps = {
  slug: string;
};

function ArticleComments({ slug }: ArticleCommentsProps) {
  const {
    data: commentsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.comments.byArticle(slug),
    queryFn: () => getComments(slug),
  });

  const [commentBody, setCommentBody] = useState("");
  const queryClient = useQueryClient();
  const { data: currentUserResponse } = useCurrentUser();

  const currentUser = currentUserResponse?.user;

  const createCommentMutation = useMutation({
    mutationFn: () => createComment(slug, commentBody),
    onSuccess: async () => {
      setCommentBody("");

      await queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byArticle(slug),
      });
    },
  });

  if (isLoading) {
    return (
      <p className="text-sm text-(--color-text-muted)">Loading comments...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-(--color-danger)">Failed to load comments.</p>
    );
  }

  return (
    <section className="space-y-4 border-t border-(--color-border) pt-4 mt-4">
      <h2 className="text-lg font-semibold text-(--color-text)">Comments</h2>
      {currentUser ? (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();

            if (!commentBody.trim()) {
              return;
            }

            createCommentMutation.mutate();
          }}
        >
          <Textarea
            value={commentBody}
            onChange={(event) => setCommentBody(event.target.value)}
            placeholder="Write a comment..."
            className="min-h-28"
          />

          <Button
            type="submit"
            disabled={createCommentMutation.isPending}
            className="bg-(--color-accent) font-bold text-(--color-text) hover:bg-(--color-accent-hover) py-4 cursor-pointer"
          >
            {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-(--color-text-muted)">
          <Link to="/login" className="text-(--color-accent)">
            Sign in
          </Link>{" "}
          to write a comment.
        </p>
      )}
      {commentsResponse?.comments.map((comment) => (
        <div
          key={comment.id}
          className="p-4 border border-(--color-border) rounded-md space-y-2"
        >
          <ArticleMeta
            username={comment.author.username}
            createdAt={comment.createdAt}
            image={null}
          />
          <p className="text-sm text-(--color-text) mb-2 bg-(--color-surface-elevated) p-3 rounded-md">
            {comment.body}
          </p>
        </div>
      ))}
    </section>
  );
}

export default ArticleComments;
