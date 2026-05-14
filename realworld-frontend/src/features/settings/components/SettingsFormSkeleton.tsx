import { Skeleton } from "@/components/ui/skeleton";

function SettingsFormSkeleton() {
  const skeletonClass = "bg-(--color-border)";

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className={`h-4 w-32 ${skeletonClass}`} />
        <Skeleton className={`h-10 w-full rounded-md ${skeletonClass}`} />
      </div>

      <div className="space-y-2">
        <Skeleton className={`h-4 w-20 ${skeletonClass}`} />
        <Skeleton className={`h-10 w-full rounded-md ${skeletonClass}`} />
      </div>

      <div className="space-y-2">
        <Skeleton className={`h-4 w-10 ${skeletonClass}`} />
        <Skeleton className={`h-28 w-full rounded-md ${skeletonClass}`} />
      </div>

      <div className="space-y-2">
        <Skeleton className={`h-4 w-14 ${skeletonClass}`} />
        <Skeleton className={`h-10 w-full rounded-md ${skeletonClass}`} />
      </div>

      <div className="space-y-2">
        <Skeleton className={`h-4 w-28 ${skeletonClass}`} />
        <Skeleton className={`h-10 w-full rounded-md ${skeletonClass}`} />
      </div>

      <Skeleton className={`h-10 w-40 rounded-md ${skeletonClass}`} />
    </div>
  );
}

export default SettingsFormSkeleton;
