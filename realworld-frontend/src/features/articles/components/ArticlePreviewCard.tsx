import { Card, CardHeader, CardFooter, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Article } from "../api/articlesApi";
import { Link } from "@tanstack/react-router";

import TagList from "@/features/tags/components/TagList";
import ArticleMeta from "./ArticleMeta";
import ArticleFavoriteButton from "./ArticleFavoriteButton";
import ArticleContent from "./ArticleContent";

type ArticlePreviewCardProps = {
  article: Article;
};

const buttonStyle =
  "border-(--color-accent) text-(--color-accent) hover:bg-(--color-accent-hover) hover:text-(--color-text) cursor-pointer";

function ArticlePreviewCard({ article }: ArticlePreviewCardProps) {
  return (
    <Card className="border-(--color-border) bg-(--color-surface-elevated) ring-(--color-border)">
      <CardHeader>
        <CardAction>
          <ArticleFavoriteButton
            slug={article.slug}
            favoritesCount={article.favoritesCount}
            favorited={article.favorited}
            className={buttonStyle}
          />
        </CardAction>

        <ArticleMeta
          username={article.author.username}
          image={article.author.image}
          createdAt={article.createdAt}
        />
      </CardHeader>
      <ArticleContent title={article.title} description={article.description} />
      <CardFooter className="py-3 border-t-0 flex justify-between gap-2">
        <Link to="/article/$slug" params={{ slug: article.slug }}>
          <Button variant="outline" size="sm" className={buttonStyle}>
            Read More
          </Button>
        </Link>
        <TagList tags={article.tagList} />
      </CardFooter>
    </Card>
  );
}

export default ArticlePreviewCard;
