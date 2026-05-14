import { apiFetch } from "@/lib/api";
import type {
  CreateArticleInput,
  CreateArticleResponse,
  GetArticleResponse,
  GetArticlesParams,
  GetArticlesResponse,
  GetFeedArticlesParams,
  UpdateArticleInput,
} from "../types/articlesTypes";

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

export function getFeedArticles({
  page = 1,
  limit = 10,
}: GetFeedArticlesParams = {}) {
  const offset = (page - 1) * limit;

  const params = new URLSearchParams();

  params.set("limit", String(limit));
  params.set("offset", String(offset));

  return apiFetch<GetArticlesResponse>(`/articles/feed?${params.toString()}`);
}

export function getArticle(slug: string) {
  return apiFetch<GetArticleResponse>(`/articles/${slug}`);
}

export function deleteArticle(slug: string) {
  return apiFetch<void>(`/articles/${slug}`, {
    method: "DELETE",
  });
}

export function createArticle(input: CreateArticleInput) {
  return apiFetch<CreateArticleResponse>("/articles", {
    method: "POST",
    body: JSON.stringify({
      article: input,
    }),
  });
}

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
