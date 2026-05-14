import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getTags } from "../api/tagsApi";
import TagList from "./TagList";
import TagsSkeleton from "./TagsSkeleton";

function PopularTagsCard() {
  const {
    data: tags,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: getTags,
  });

  if (isLoading) {
    return (
      <Card className="h-fit border-(--color-border) bg-(--color-surface-elevated) ring-(--color-border)">
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <TagsSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="h-fit border-(--color-border) bg-(--color-surface-elevated) ring-(--color-border)">
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <p className="text-sm text-(--color-danger)">Failed to load tags.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit border-(--color-border) bg-(--color-surface-elevated) ring-(--color-border)">
      <CardHeader>
        <CardTitle>Popular Tags</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <TagList tags={tags?.tags ?? []} />
      </CardContent>
    </Card>
  );
}

export default PopularTagsCard;
