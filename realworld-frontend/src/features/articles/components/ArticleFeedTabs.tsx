import ArticleFeed from "./ArticleFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";

const tabStyle = "data-active:bg-(--color-accent)";

export function ArticleFeedTabs() {
  const { data: currentUserResponse } = useCurrentUser();
  const currentUser = currentUserResponse?.user;
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const tag = typeof search.tag === "string" ? search.tag : undefined;
  const [feedType, setFeedType] = useState<"global" | "personal">("global");
  const activeTab = tag ? "tag" : feedType;

  function handleTabChange(value: string) {
    if (value === "tag") {
      return;
    }

    setFeedType(value as "global" | "personal");

    if (tag) {
      navigate({
        to: "/",
        search: {},
      });
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="bg bg-(--color-surface-elevated) border border-(--color-border) mb-2 ">
        <TabsTrigger className={tabStyle} value="global">
          Global Feed
        </TabsTrigger>
        {currentUser && (
          <TabsTrigger className={tabStyle} value="personal">
            Your Feed
          </TabsTrigger>
        )}
        {tag && (
          <TabsTrigger className={tabStyle} value="tag">
            #{tag}
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
      {tag && (
        <TabsContent value="tag">
          <ArticleFeed feedType="tag" tag={tag} />
        </TabsContent>
      )}
    </Tabs>
  );
}
