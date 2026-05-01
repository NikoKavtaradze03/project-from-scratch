export const queryKeys = {
  tags: {
    all: ["tags"] as const,
  },

  articles: {
    all: ["articles"] as const,
    list: (page: number) => ["articles", "list", page] as const,
    detail: (slug: string) => ["articles", "detail", slug] as const,
  },

  auth: {
    currentUser: ["auth", "currentUser"] as const,
  },
};
