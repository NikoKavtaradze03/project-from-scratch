import { CardContent } from "@/components/ui/card";

type ArticleContentProps = {
  title: string;
  description: string;
  variant?: "preview" | "full";
};

const variantStyles = {
  preview: {
    wrapper: "p-4",
    title: "break-words text-xl font-semibold text-(--color-text)",
    description: "break-words text-sm text-(--color-text-secondary)",
  },
  full: {
    wrapper: "p-0 space-y-3",
    title: "break-words text-4xl font-bold text-(--color-text)",
    description:
      "break-words text-lg leading-8 text-(--color-text-secondary)",
  },
};

function ArticleContent({
  title,
  description,
  variant = "preview",
}: ArticleContentProps) {
  const Heading = variant === "full" ? "h1" : "h2";
  const styles = variantStyles[variant];

  return (
    <CardContent className={styles.wrapper}>
      <Heading className={styles.title}>{title}</Heading>
      <p className={styles.description}>{description}</p>
    </CardContent>
  );
}

export default ArticleContent;
