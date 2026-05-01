type TagListProps = {
  tags: string[];
};

function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          className="rounded-full border border-(--color-border) px-3 py-1 text-xs text-(--color-text-secondary) transition hover:border-(--color-accent) hover:text-(--color-accent) cursor-pointer"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export default TagList;
