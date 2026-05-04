import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleFeed from "@/features/articles/components/ArticleFeed";

type ProfileTabsProps = {
  profile: {
    username: string;
  };
};

export function ProfileTabs({ profile }: ProfileTabsProps) {
  const tabStyle = "data-active:bg-(--color-accent)";

  return (
    <Tabs defaultValue="articles">
      <TabsList className="bg bg-(--color-surface-elevated) border border-(--color-border) mt-6 mb-2">
        <TabsTrigger className={tabStyle} value="articles">
          My Articles
        </TabsTrigger>
        <TabsTrigger className={tabStyle} value="favorited">
          Favorited Articles
        </TabsTrigger>
      </TabsList>

      <TabsContent value="articles">
        <ArticleFeed author={profile.username} />
      </TabsContent>

      <TabsContent value="favorited">
        <ArticleFeed favorited={profile.username} />
      </TabsContent>
    </Tabs>
  );
}
