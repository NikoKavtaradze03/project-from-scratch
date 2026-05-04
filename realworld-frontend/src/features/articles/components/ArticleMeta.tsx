import UserAvatar from "@/components/shared/UserAvatar";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

type ArticleMetaProps = {
  username: string;
  image: string | null;
  createdAt: string;
};

function ArticleMeta({ username, image, createdAt }: ArticleMetaProps) {
  return (
    <Link
      to="/profile/$username"
      params={{ username }}
      className="flex gap-3 items-center cursor-pointer"
    >
      <UserAvatar username={username} image={image} />
      <div>
        <CardTitle>{username}</CardTitle>
        <CardDescription className="text-xs text-(--color-text-secondary)">
          {createdAt.trim().split("T")[0]}
        </CardDescription>
      </div>
    </Link>
  );
}

export default ArticleMeta;
