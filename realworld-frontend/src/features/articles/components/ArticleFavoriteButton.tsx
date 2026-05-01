import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

type ArticleFavoriteButtonProps = {
  favoritesCount: number;
  favorited: boolean;
  style: string;
};

function ArticleFavoriteButton({
  favoritesCount,
  favorited,
  style,
}: ArticleFavoriteButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`${style} ${favorited ? "bg-(--color-accent) text-(--color-text)" : ""}`}
    >
      <Heart /> {favoritesCount}
    </Button>
  );
}

export default ArticleFavoriteButton;
