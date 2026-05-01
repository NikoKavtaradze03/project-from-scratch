import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getTags } from "../api/tagsApi";
import TagList from "./TagList";

function PopularTagsCard() {
  const {
    data: tags,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: getTags,
  });

  return (
    <Card className="h-fit border-(--color-border) bg-(--color-surface-elevated) ring-(--color-border)">
      <CardHeader>
        <CardTitle>Popular Tags</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        {isLoading ? (
          <p className="text-sm text-(--color-text-muted)">Loading tags...</p>
        ) : isError ? (
          <p className="text-sm text-(--color-danger)">Failed to load tags.</p>
        ) : (
          <TagList tags={tags?.tags ?? []} />
        )}
      </CardContent>
    </Card>
  );
}

export default PopularTagsCard;
