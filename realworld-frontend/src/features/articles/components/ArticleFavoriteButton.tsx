import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteArticle, unfavoriteArticle } from "../api/articlesApi";
import { queryKeys } from "@/lib/queryKeys";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useNavigate } from "@tanstack/react-router";

type ArticleFavoriteButtonProps = {
  slug: string;
  favoritesCount: number;
  favorited: boolean;
  className: string;
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
  const favoriteMutation = useMutation({
    mutationFn: () =>
      favorited ? unfavoriteArticle(slug) : favoriteArticle(slug),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.articles.all,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.articles.detail(slug),
      });
    },
  });

  return (
    <Button
      variant="outline"
      size="sm"
      className={`${className} ${favorited ? "bg-(--color-accent) text-(--color-text)" : ""}`}
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
