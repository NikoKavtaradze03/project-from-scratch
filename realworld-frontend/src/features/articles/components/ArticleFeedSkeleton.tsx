import ArticlePreviewSkeleton from "./ArticlePreviewSkeleton";

type ArticleFeedSkeletonProps = {
  count?: number;
};

function ArticleFeedSkeleton({ count = 10 }: ArticleFeedSkeletonProps) {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ArticlePreviewSkeleton key={index} />
      ))}
    </div>
  );
}

export default ArticleFeedSkeleton;
