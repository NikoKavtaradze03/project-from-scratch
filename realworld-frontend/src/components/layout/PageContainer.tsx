import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  variant?: "auth" | "standard" | "reading";
  className?: string;
};

const variants = {
  auth: "max-w-md", //centered and narrow for auth pages
  standard: "max-w-6xl",
  reading: "max-w-3xl",
};

function PageContainer({
  children,
  variant = "standard",
  className,
}: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${variants[variant]} px-4 py-8 ${className || ""}`}
    >
      {children}
    </div>
  );
}

export default PageContainer;
