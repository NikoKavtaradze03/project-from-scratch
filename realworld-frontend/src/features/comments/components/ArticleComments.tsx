import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getComments } from "../api/commentsApi";
import { CommentList } from "./CommentList";
import CreateComment from "./CreateComment";

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
      <CreateComment slug={slug} />
      <CommentList comments={commentsResponse?.comments || []} slug={slug} />
    </section>
  );
}

export default ArticleComments;
