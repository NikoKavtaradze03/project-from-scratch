import { Skeleton } from "@/components/ui/skeleton";

type CommentsSkeletonProps = {
  count?: number;
};

function CommentsSkeleton({ count = 3 }: CommentsSkeletonProps) {
  const skeletonClass = "bg-(--color-border)";

  return (
    <section className="mt-4 space-y-4 rounded-md border border-(--color-border) p-4">
      <Skeleton className={`h-6 w-28 ${skeletonClass}`} />

      <div className="space-y-3">
        <Skeleton className={`h-28 w-full rounded-md ${skeletonClass}`} />
        <Skeleton className={`h-9 w-28 rounded-md ${skeletonClass}`} />
      </div>

      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-md border border-(--color-border) p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className={`h-10 w-10 rounded-full ${skeletonClass}`} />
              <div className="space-y-2">
                <Skeleton className={`h-4 w-24 ${skeletonClass}`} />
                <Skeleton className={`h-3 w-16 ${skeletonClass}`} />
              </div>
            </div>

            <div className="space-y-2 rounded-md bg-(--color-surface-elevated) p-3">
              <Skeleton className={`h-4 w-full ${skeletonClass}`} />
              <Skeleton className={`h-4 w-3/4 ${skeletonClass}`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CommentsSkeleton;
