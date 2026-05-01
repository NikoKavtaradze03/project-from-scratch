type PageHeaderProps = {
  title: string;
  description?: string;
};

function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-(--color-text)">
        {title}
      </h1>

      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-(--color-text-secondary)">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default PageHeader;
