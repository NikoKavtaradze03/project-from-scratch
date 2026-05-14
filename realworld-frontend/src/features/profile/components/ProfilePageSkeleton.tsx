import { Skeleton } from "@/components/ui/skeleton";
import ArticleFeedSkeleton from "@/features/articles/components/ArticleFeedSkeleton";

function ProfilePageSkeleton() {
  const skeletonClass = "bg-(--color-border)";

  return (
    <>
      <section className="relative flex flex-col items-center gap-2 rounded-2xl border border-(--color-border) bg-(--color-surface-elevated) p-6 text-center">
        <Skeleton className={`h-24 w-24 rounded-full ${skeletonClass}`} />
        <Skeleton className={`h-8 w-40 ${skeletonClass}`} />
        <Skeleton className={`mt-2 h-4 w-2/3 max-w-200 ${skeletonClass}`} />
        <Skeleton className={`h-4 w-1/2 max-w-160 ${skeletonClass}`} />
        <div className="mt-2 flex w-full justify-end">
          <Skeleton className={`h-9 w-32 rounded-md ${skeletonClass}`} />
        </div>
      </section>

      <div className="mb-2 mt-6 flex w-fit gap-1 rounded-md border border-(--color-border) bg-(--color-surface-elevated) p-1">
        <Skeleton className={`h-8 w-28 rounded-sm ${skeletonClass}`} />
        <Skeleton className={`h-8 w-36 rounded-sm ${skeletonClass}`} />
      </div>

      <ArticleFeedSkeleton count={3} />
    </>
  );
}

export default ProfilePageSkeleton;
