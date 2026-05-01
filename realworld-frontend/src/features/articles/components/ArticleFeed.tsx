import ArticlePreviewCard from "./ArticlePreviewCard";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "../api/articlesApi";
import { useState } from "react";
import Pagination from "@/components/shared/pagination";

export default function ArticleFeed() {
  const [page, setPage] = useState(1);
  const ARTICLES_PER_PAGE = 10;

  const {
    data: articlesResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.articles.list(page),
    queryFn: () => getArticles(page, ARTICLES_PER_PAGE),
  });

  const totalPages = articlesResponse
    ? Math.ceil(articlesResponse.articlesCount / ARTICLES_PER_PAGE)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {isLoading ? (
        <p className="text-sm text-(--color-text-muted)">Loading articles...</p>
      ) : isError ? (
        <p className="text-sm text-(--color-danger)">
          Failed to load articles.
        </p>
      ) : (
        articlesResponse?.articles.map((article) => (
          <ArticlePreviewCard key={article.slug} article={article} />
        ))
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
