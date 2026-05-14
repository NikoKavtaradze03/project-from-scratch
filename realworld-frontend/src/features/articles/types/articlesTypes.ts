export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
};

export type GetArticlesResponse = {
  articles: Article[];
  articlesCount: number;
};

export type GetArticleResponse = {
  article: Article;
};

export type GetArticlesParams = {
  page?: number;
  limit?: number;
  author?: string;
  favorited?: string;
  tag?: string;
};

export type GetFeedArticlesParams = {
  page?: number;
  limit?: number;
};

export type CreateArticleInput = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
};

export type CreateArticleResponse = {
  article: Article;
};

export type UpdateArticleInput = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
};
