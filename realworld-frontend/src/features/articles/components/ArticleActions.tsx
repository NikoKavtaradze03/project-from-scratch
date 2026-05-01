import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteArticle, type Article } from "../api/articlesApi";
import { queryKeys } from "@/lib/queryKeys";
import ArticleFavoriteButton from "./ArticleFavoriteButton";
import DeleteArticleDialog from "./DeleteArticleDialog";

type ArticleActionsProps = {
  article: Article;
  isAuthor: boolean;
};

const actionButtonStyle =
  "h-full cursor-pointer border-(--color-accent) text-(--color-accent) hover:bg-(--color-accent-hover) hover:text-(--color-text) py-2";

function ArticleActions({ article, isAuthor }: ArticleActionsProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteArticle(article.slug),
    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: queryKeys.articles.detail(article.slug),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      navigate({ to: "/" });
    },
  });

  if (isAuthor) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" className={actionButtonStyle}>
          <Link to="/editor/$slug" params={{ slug: article.slug }}>
            <Pencil size={16} strokeWidth={3} />
            Edit Article
          </Link>
        </Button>

        <DeleteArticleDialog
          isDeleting={deleteMutation.isPending}
          errorMessage={
            deleteMutation.isError ? deleteMutation.error.message : undefined
          }
          onDelete={() => deleteMutation.mutate()}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" className={actionButtonStyle}>
        Follow {article.author.username}
      </Button>
      <ArticleFavoriteButton
        slug={article.slug}
        favoritesCount={article.favoritesCount}
        favorited={article.favorited}
        className={actionButtonStyle}
      />
    </div>
  );
}

export default ArticleActions;
