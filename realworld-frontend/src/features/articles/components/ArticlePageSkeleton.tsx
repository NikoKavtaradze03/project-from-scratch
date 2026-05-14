import { Skeleton } from "@/components/ui/skeleton";
import PageContainer from "@/components/layout/PageContainer";
import CommentsSkeleton from "@/features/comments/components/CommentsSkeleton";

function ArticlePageSkeleton() {
  const skeletonClass = "bg-(--color-border)";

  return (
    <main>
      <PageContainer variant="reading">
        <article className="min-w-0 space-y-4">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Skeleton className={`h-7 w-16 rounded-full ${skeletonClass}`} />
              <Skeleton className={`h-7 w-20 rounded-full ${skeletonClass}`} />
              <Skeleton className={`h-7 w-14 rounded-full ${skeletonClass}`} />
            </div>

            <div className="space-y-3">
              <Skeleton className={`h-10 w-4/5 ${skeletonClass}`} />
              <Skeleton className={`h-6 w-full ${skeletonClass}`} />
              <Skeleton className={`h-6 w-2/3 ${skeletonClass}`} />
            </div>
          </header>

          <div className="flex flex-col gap-4 border-y border-(--color-border) py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className={`h-10 w-10 rounded-full ${skeletonClass}`} />
              <div className="space-y-2">
                <Skeleton className={`h-4 w-24 ${skeletonClass}`} />
                <Skeleton className={`h-3 w-16 ${skeletonClass}`} />
              </div>
            </div>

            <div className="flex gap-2">
              <Skeleton className={`h-9 w-28 rounded-md ${skeletonClass}`} />
              <Skeleton className={`h-9 w-20 rounded-md ${skeletonClass}`} />
            </div>
          </div>

          <section className="space-y-3">
            <Skeleton className={`h-5 w-full ${skeletonClass}`} />
            <Skeleton className={`h-5 w-full ${skeletonClass}`} />
            <Skeleton className={`h-5 w-11/12 ${skeletonClass}`} />
            <Skeleton className={`h-5 w-4/5 ${skeletonClass}`} />
          </section>
        </article>

        <CommentsSkeleton />
      </PageContainer>
    </main>
  );
}

export default ArticlePageSkeleton;
