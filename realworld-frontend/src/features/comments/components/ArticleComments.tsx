import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getComments } from "../api/commentsApi";
import ArticleMeta from "@/features/articles/components/ArticleMeta";

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
          <p className="text-sm text-(--color-text-secondary) mb-2">
            {comment.body}
          </p>
        </div>
      ))}
    </section>
  );
}

export default ArticleComments;
