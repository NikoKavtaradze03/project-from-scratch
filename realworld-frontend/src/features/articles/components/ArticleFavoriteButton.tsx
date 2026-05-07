import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  favoriteArticle,
  unfavoriteArticle,
  type Article,
} from "../api/articlesApi";
import { queryKeys } from "@/lib/queryKeys";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useNavigate } from "@tanstack/react-router";

type ArticleFavoriteButtonProps = {
  slug: string;
  favoritesCount: number;
  favorited: boolean;
  className: string;
};

type ArticleDetailResponse = {
  article: Article;
};

type ArticlesListResponse = {
  articles: Article[];
  articlesCount: number;
};

type FavoriteMutationContext = {
  previousDetail?: ArticleDetailResponse;
  previousLists: [readonly unknown[], ArticlesListResponse | undefined][];
};

function ArticleFavoriteButton({
  slug,
  favoritesCount,
  favorited,
  className,
}: ArticleFavoriteButtonProps) {
  const { data: currentUserResponse } = useCurrentUser();
  const currentUser = currentUserResponse?.user;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation<
    unknown,
    Error,
    void,
    FavoriteMutationContext
  >({
    mutationFn: () =>
      favorited ? unfavoriteArticle(slug) : favoriteArticle(slug),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.articles.all,
      });

      const previousDetail = queryClient.getQueryData<ArticleDetailResponse>(
        queryKeys.articles.detail(slug),
      );

      const previousLists = queryClient.getQueriesData<ArticlesListResponse>({
        queryKey: queryKeys.articles.all,
      });

      queryClient.setQueryData<ArticleDetailResponse>(
        queryKeys.articles.detail(slug),
        (old) => {
          if (!old) return old;

          return {
            article: {
              ...old.article,
              favorited: !old.article.favorited,
              favoritesCount:
                old.article.favoritesCount + (old.article.favorited ? -1 : 1),
            },
          };
        },
      );

      queryClient.setQueriesData<ArticlesListResponse>(
        { queryKey: queryKeys.articles.all },
        (old) => {
          if (!old || !Array.isArray(old.articles)) return old;

          return {
            ...old,
            articles: old.articles.map((article) => {
              if (article.slug !== slug) return article;

              return {
                ...article,
                favorited: !article.favorited,
                favoritesCount:
                  article.favoritesCount + (article.favorited ? -1 : 1),
              };
            }),
          };
        },
      );

      return { previousDetail, previousLists };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          queryKeys.articles.detail(slug),
          context.previousDetail,
        );
      }

      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.articles.all,
      });
    },
  });

  return (
    <Button
      variant="outline"
      size="sm"
      className={`${className} ${
        favorited ? "bg-(--color-accent) text-(--color-text)" : ""
      }`}
      onClick={
        !currentUser
          ? () => navigate({ to: "/login" })
          : () => favoriteMutation.mutate()
      }
      disabled={favoriteMutation.isPending}
    >
      <Heart /> {favoritesCount}
    </Button>
  );
}

export default ArticleFavoriteButton;
