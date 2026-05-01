import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowBigLeft } from "lucide-react";

type AuthCardProps = {
  title: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
};

function AuthCard({
  title,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthCardProps) {
  return (
    <div className="space-y-4">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-accent)"
      >
        <ArrowBigLeft size={16} strokeWidth={3} />
        Back to home
      </Link>

      <Card className="border-(--color-border) bg-(--color-surface-elevated) ring-(--color-border)">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-(--color-text)">
            {title}
          </CardTitle>
          <CardDescription className="text-center text-sm text-(--color-text-secondary)">
            {footerText}{" "}
            <Link
              to={footerLinkTo}
              className="text-(--color-accent) hover:text-(--color-accent-hover)"
            >
              {footerLinkText}
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

export default AuthCard;
