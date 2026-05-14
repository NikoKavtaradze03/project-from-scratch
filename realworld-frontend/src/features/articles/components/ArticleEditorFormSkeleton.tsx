import { Skeleton } from "@/components/ui/skeleton";

function ArticleEditorFormSkeleton() {
  const skeletonClass = "bg-(--color-border)";

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className={`h-4 w-16 ${skeletonClass}`} />
        <Skeleton className={`h-10 w-full rounded-md ${skeletonClass}`} />
      </div>

      <div className="space-y-2">
        <Skeleton className={`h-4 w-24 ${skeletonClass}`} />
        <Skeleton className={`h-10 w-full rounded-md ${skeletonClass}`} />
      </div>

      <div className="space-y-2">
        <Skeleton className={`h-4 w-14 ${skeletonClass}`} />
        <Skeleton className={`h-64 w-full rounded-md ${skeletonClass}`} />
      </div>

      <div className="space-y-2">
        <Skeleton className={`h-4 w-12 ${skeletonClass}`} />
        <Skeleton className={`h-10 w-full rounded-md ${skeletonClass}`} />
        <div className="flex flex-wrap gap-2 pt-1">
          <Skeleton className={`h-7 w-16 rounded-full ${skeletonClass}`} />
          <Skeleton className={`h-7 w-20 rounded-full ${skeletonClass}`} />
          <Skeleton className={`h-7 w-14 rounded-full ${skeletonClass}`} />
        </div>
      </div>

      <Skeleton className={`h-10 w-36 rounded-md ${skeletonClass}`} />
    </div>
  );
}

export default ArticleEditorFormSkeleton;
