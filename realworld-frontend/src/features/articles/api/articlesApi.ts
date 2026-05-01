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

export function getArticles(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  return apiFetch<GetArticlesResponse>(
    `/articles?limit=${limit}&offset=${offset}`,
  );
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
