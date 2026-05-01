import type { ReactNode } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { getArticle } from "../api/articlesApi";
import { queryKeys } from "@/lib/queryKeys";
import ArticleMeta from "../components/ArticleMeta";
import TagList from "@/features/tags/components/TagList";
import ArticleContent from "../components/ArticleContent";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import ArticleActions from "../components/ArticleActions";
import ArticleComments from "@/features/comments/components/ArticleComments";

function ArticlePageMessage({ children }: { children: ReactNode }) {
  return (
    <main>
      <PageContainer variant="reading">{children}</PageContainer>
    </main>
  );
}

function ArticlePage() {
  const { slug } = useParams({ from: "/article/$slug" });

  const {
    data: articleResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.articles.detail(slug),
    queryFn: () => getArticle(slug),
  });

  const { data: currentUserResponse } = useCurrentUser();

  if (isLoading) {
    return (
      <ArticlePageMessage>
        <p className="text-sm text-(--color-text-muted)">Loading article...</p>
      </ArticlePageMessage>
    );
  }

  if (isError || !articleResponse) {
    return (
      <ArticlePageMessage>
        <p className="text-sm text-(--color-danger)">Failed to load article.</p>
      </ArticlePageMessage>
    );
  }

  const article = articleResponse.article;
  const currentUser = currentUserResponse?.user;
  const isAuthor = currentUser?.username === article.author.username;

  return (
    <main>
      <PageContainer variant="reading">
        <article className="min-w-0 space-y-4">
          <header className="space-y-4">
            <TagList tags={article.tagList} />

            <ArticleContent
              title={article.title}
              description={article.description}
              variant="full"
            />
          </header>

          <div className="flex flex-col gap-4 border-y border-(--color-border) py-4 sm:flex-row sm:items-center sm:justify-between">
            <ArticleMeta
              username={article.author.username}
              image={article.author.image}
              createdAt={article.createdAt}
            />
            <ArticleActions article={article} isAuthor={isAuthor} />
          </div>

          <section className="prose prose-invert max-w-none min-w-0">
            <p className="whitespace-pre-line wrap-break-word leading-8 text-(--color-text)">
              {article.body}
            </p>
          </section>
        </article>
        <ArticleComments slug={article.slug} />
      </PageContainer>
    </main>
  );
}

export default ArticlePage;
