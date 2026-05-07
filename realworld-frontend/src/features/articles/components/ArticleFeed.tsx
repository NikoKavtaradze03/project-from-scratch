import ArticlePreviewCard from "./ArticlePreviewCard";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getArticles, getFeedArticles } from "../api/articlesApi";
import { useState } from "react";
import Pagination from "@/components/shared/pagination";
import ArticleFeedSkeleton from "./ArticleFeedSkeleton";

type ArticleFeedProps = {
  author?: string;
  favorited?: string;
  tag?: string;
  feedType?: "global" | "personal" | "tag";
};

export default function ArticleFeed({
  author,
  favorited,
  tag,
  feedType,
}: ArticleFeedProps) {
  const [page, setPage] = useState(1);
  const ARTICLES_PER_PAGE = 6;

  const {
    data: articlesResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.articles.list({
      page,
      author,
      favorited,
      tag,
      feedType,
    }),

    queryFn: () => {
      if (feedType === "personal") {
        return getFeedArticles({
          page,
          limit: ARTICLES_PER_PAGE,
        });
      }

      return getArticles({
        page,
        limit: ARTICLES_PER_PAGE,
        author,
        favorited,
        tag,
      });
    },
  });

  if (isLoading) {
    return <ArticleFeedSkeleton count={ARTICLES_PER_PAGE} />;
  }

  if (isError) {
    return (
      <p className="text-sm text-(--color-danger)">Failed to load articles.</p>
    );
  }

  const articles = articlesResponse?.articles ?? [];

  const totalPages = articlesResponse
    ? Math.ceil(articlesResponse.articlesCount / ARTICLES_PER_PAGE)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {articles.map((article) => (
        <ArticlePreviewCard article={article} key={article.slug} />
      ))}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
