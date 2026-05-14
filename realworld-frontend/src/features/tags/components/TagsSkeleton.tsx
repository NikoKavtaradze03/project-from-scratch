import { Skeleton } from "@/components/ui/skeleton";

function TagsSkeleton() {
  const skeletonClass = "bg-(--color-border)";
  const widths = ["w-16", "w-20", "w-14", "w-24", "w-18", "w-12"];

  return (
    <div className="flex flex-wrap gap-2">
      {widths.map((width, index) => (
        <Skeleton
          key={index}
          className={`h-7 rounded-full ${width} ${skeletonClass}`}
        />
      ))}
    </div>
  );
}

export default TagsSkeleton;
