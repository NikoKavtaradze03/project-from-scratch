export const queryKeys = {
  tags: {
    all: ["tags"] as const,
  },

  articles: {
    all: ["articles"] as const,
    list: (params: {
      page: number;
      author?: string;
      favorited?: string;
      tag?: string;
      feedType?: string;
    }) => ["articles", "list", params] as const,
    detail: (slug: string) => ["articles", "detail", slug] as const,
  },

  auth: {
    currentUser: ["auth", "currentUser"] as const,
  },

  comments: {
    byArticle: (slug: string) => ["comments", slug] as const,
  },

  profile: {
    detail: (username: string) => ["profile", username] as const,
  },
};
