import { axiosFetch } from "@/lib/axios-api";
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

  const params = {
    limit,
    offset,
    ...(author ? { author } : {}),
    ...(favorited ? { favorited } : {}),
    ...(tag ? { tag } : {}),
  };

  return axiosFetch<GetArticlesResponse>("/articles", { params });
}

export function getFeedArticles({
  page = 1,
  limit = 10,
}: GetFeedArticlesParams = {}) {
  const offset = (page - 1) * limit;

  return axiosFetch<GetArticlesResponse>("/articles/feed", {
    params: {
      limit,
      offset,
    },
  });
}

export function getArticle(slug: string) {
  return axiosFetch<GetArticleResponse>(`/articles/${slug}`);
}

export function deleteArticle(slug: string) {
  return axiosFetch<void>(`/articles/${slug}`, {
    method: "DELETE",
  });
}

export function createArticle(input: CreateArticleInput) {
  return axiosFetch<CreateArticleResponse>("/articles", {
    method: "POST",
    body: {
      article: input,
    },
  });
}

export function updateArticle(input: UpdateArticleInput) {
  const { slug, ...article } = input;

  return axiosFetch<CreateArticleResponse>(`/articles/${slug}`, {
    method: "PUT",
    body: {
      article,
    },
  });
}

export function favoriteArticle(slug: string) {
  return axiosFetch<CreateArticleResponse>(`/articles/${slug}/favorite`, {
    method: "POST",
  });
}

export function unfavoriteArticle(slug: string) {
  return axiosFetch<CreateArticleResponse>(`/articles/${slug}/favorite`, {
    method: "DELETE",
  });
}
