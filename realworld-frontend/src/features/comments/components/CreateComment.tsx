import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { createComment } from "../api/commentsApi";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { queryKeys } from "@/lib/queryKeys";
import { commentSchema } from "../utils/commentSchema";

type CreateCommentProps = {
  slug: string;
};

function CreateComment({ slug }: CreateCommentProps) {
  const bodySchema = commentSchema.shape.body;
  const [error, setError] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const queryClient = useQueryClient();

  const { data: currentUserResponse } = useCurrentUser();
  const currentUser = currentUserResponse?.user;

  const createCommentMutation = useMutation({
    mutationFn: (body: string) => createComment(slug, body),
    onSuccess: async () => {
      setCommentBody("");

      await queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byArticle(slug),
      });
    },
  });

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = bodySchema.safeParse(commentBody);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid Comment");
      return;
    }

    createCommentMutation.mutate(result.data);
  }

  return (
    <div>
      {currentUser ? (
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Textarea
            value={commentBody}
            onChange={(event) => {
              setCommentBody(event.target.value);

              if (error) {
                const result = bodySchema.safeParse(event.target.value);

                if (result.success) {
                  setError("");
                }
              }
            }}
            placeholder="Write a comment..."
            className="min-h-28"
          />

          {error ? (
            <p className="text-sm text-(--color-danger)">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={createCommentMutation.isPending || !commentBody.trim()}
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
