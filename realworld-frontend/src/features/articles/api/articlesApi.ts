import { apiFetch } from "@/lib/api";

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

type GetArticlesResponse = {
  articles: Article[];
  articlesCount: number;
};

type GetArticlesParams = {
  page?: number;
  limit?: number;
  author?: string;
  favorited?: string;
  tag?: string;
};

export function getArticles({
  page = 1,
  limit = 10,
  author,
  favorited,
  tag,
}: GetArticlesParams = {}) {
  const offset = (page - 1) * limit;

  const params = new URLSearchParams();

  params.set("limit", String(limit));
  params.set("offset", String(offset));

  if (author) {
    params.set("author", author);
  }

  if (favorited) {
    params.set("favorited", favorited);
  }

  if (tag) {
    params.set("tag", tag);
  }

  return apiFetch<GetArticlesResponse>(`/articles?${params.toString()}`);
}

type GetArticleResponse = {
  article: Article;
};

export function getArticle(slug: string) {
  return apiFetch<GetArticleResponse>(`/articles/${slug}`);
}

export function deleteArticle(slug: string) {
  return apiFetch<void>(`/articles/${slug}`, {
    method: "DELETE",
  });
}

type CreateArticleInput = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
};

type CreateArticleResponse = {
  article: Article;
};

export function createArticle(input: CreateArticleInput) {
  return apiFetch<CreateArticleResponse>("/articles", {
    method: "POST",
    body: JSON.stringify({
      article: input,
    }),
  });
}

type UpdateArticleInput = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
};

export function updateArticle(input: UpdateArticleInput) {
  const { slug, ...article } = input;

  return apiFetch<CreateArticleResponse>(`/articles/${slug}`, {
    method: "PUT",
    body: JSON.stringify({
      article,
    }),
  });
}

export function favoriteArticle(slug: string) {
  return apiFetch<CreateArticleResponse>(`/articles/${slug}/favorite`, {
    method: "POST",
  });
}

export function unfavoriteArticle(slug: string) {
  return apiFetch<CreateArticleResponse>(`/articles/${slug}/favorite`, {
    method: "DELETE",
  });
}
