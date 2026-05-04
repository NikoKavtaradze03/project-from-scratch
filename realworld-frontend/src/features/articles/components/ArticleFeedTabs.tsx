import ArticleFeed from "./ArticleFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const tabStyle = "data-active:bg-(--color-accent)";

export function ArticleFeedTabs() {
  const { data: currentUserResponse } = useCurrentUser();
  const currentUser = currentUserResponse?.user;

  return (
    <Tabs defaultValue="global">
      <TabsList className="bg bg-(--color-surface-elevated) border border-(--color-border)  mb-2 ">
        <TabsTrigger className={tabStyle} value="global">
          Global Feed
        </TabsTrigger>
        {currentUser && (
          <TabsTrigger className={tabStyle} value="personal">
            Your Feed
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="global">
        <ArticleFeed feedType="global" />
      </TabsContent>
      {currentUser && (
        <TabsContent value="personal">
          <ArticleFeed feedType="personal" />
        </TabsContent>
      )}
    </Tabs>
  );
}
