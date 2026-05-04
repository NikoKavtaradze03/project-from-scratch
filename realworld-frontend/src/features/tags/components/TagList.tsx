import { Link } from "@tanstack/react-router";

type TagListProps = {
  tags: string[];
};

function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          to="/"
          search={{ tag }}
          key={tag}
          className="rounded-full border border-(--color-border) px-3 py-1 text-xs text-(--color-text-secondary) transition hover:border-(--color-accent) hover:text-(--color-accent) cursor-pointer"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}

export default TagList;
