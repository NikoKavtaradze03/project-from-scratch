import ArticleMeta from "@/features/articles/components/ArticleMeta";
import type { Comment } from "../api/commentsApi";

type CommentListProps = {
  comments: Comment[];
};

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments?.map((comment) => (
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
    </div>
  );
}
