import { Skeleton } from "@/components/ui/skeleton";

function ArticlePreviewSkeleton() {
  const skeletonClass = "bg-(--color-border)";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-(--color-border) p-6">
      <div className="flex items-center gap-3">
        <Skeleton className={`h-10 w-10 rounded-full ${skeletonClass}`} />

        <div className="flex flex-col gap-2">
          <Skeleton className={`h-4 w-24 ${skeletonClass}`} />
          <Skeleton className={`h-3 w-16 ${skeletonClass}`} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className={`h-6 w-2/3 ${skeletonClass}`} />
        <Skeleton className={`h-4 w-full ${skeletonClass}`} />
        <Skeleton className={`h-4 w-5/6 ${skeletonClass}`} />
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className={`h-4 w-24 ${skeletonClass}`} />

        <Skeleton className={`h-8 w-16 rounded-md ${skeletonClass}`} />
      </div>
    </div>
  );
}

export default ArticlePreviewSkeleton;
