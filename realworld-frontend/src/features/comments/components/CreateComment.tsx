import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { createComment } from "../api/commentsApi";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { queryKeys } from "@/lib/queryKeys";

type CreateCommentProps = {
  slug: string;
};

function CreateComment({ slug }: CreateCommentProps) {
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

  return (
    <div>
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
    </div>
  );
}

export default CreateComment;
