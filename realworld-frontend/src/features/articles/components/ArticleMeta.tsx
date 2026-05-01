import UserAvatar from "@/components/shared/UserAvatar";
import { CardDescription, CardTitle } from "@/components/ui/card";

type ArticleMetaProps = {
  username: string;
  image: string | null;
  createdAt: string;
};

function ArticleMeta({ username, image, createdAt }: ArticleMetaProps) {
  return (
    <div className="flex gap-3 items-center">
      <UserAvatar username={username} image={image} />
      <div>
        <CardTitle>{username}</CardTitle>
        <CardDescription className="text-xs text-(--color-text-secondary)">
          {createdAt.trim().split("T")[0]}
        </CardDescription>
      </div>
    </div>
  );
}

export default ArticleMeta;
