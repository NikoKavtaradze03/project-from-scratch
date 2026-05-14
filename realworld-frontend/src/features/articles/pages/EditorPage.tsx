import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { queryKeys } from "@/lib/queryKeys";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

import { createArticle, getArticle, updateArticle } from "../api/articlesApi";

import type { Article } from "../types/articlesTypes";

import ArticleEditorForm, {
  type ArticleEditorFormValues,
} from "../components/ArticleEditorForm";

function getArticleEditorInitialValues(
  article: Article,
): ArticleEditorFormValues {
  return {
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tagList,
  };
}

function parseArticleTags(tagList: string[]) {
  return tagList.map((tag) => tag.trim()).filter((tag) => tag.length > 0);
}

type EditorPageProps = { mode: "create" } | { mode: "edit"; slug: string };

function EditorPage(props: EditorPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEditMode = props.mode === "edit";
  const slug = props.mode === "edit" ? props.slug : undefined;

  const { data: currentUserResponse, isLoading: isCurrentUserLoading } =
    useCurrentUser();

  const { data: articleResponse, isLoading: isArticleLoading } = useQuery({
    queryKey: slug ? queryKeys.articles.detail(slug) : ["editor"],
    queryFn: () => getArticle(slug!),
    enabled: isEditMode,
  });

  const createArticleMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.articles.all,
      });

      navigate({
        to: "/article/$slug",
        params: { slug: response.article.slug },
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.articles.all,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.articles.detail(response.article.slug),
      });

      navigate({
        to: "/article/$slug",
        params: { slug: response.article.slug },
      });
    },
  });

  if (isCurrentUserLoading) {
    return (
      <main>
        <PageContainer>
          <p className="text-sm text-(--color-text-muted)">Loading...</p>
        </PageContainer>
      </main>
    );
  }

  if (!currentUserResponse?.user) {
    return null;
  }

  if (isEditMode && isArticleLoading) {
    return (
      <main>
        <PageContainer>
          <p className="text-sm text-(--color-text-muted)">
            Loading article...
          </p>
        </PageContainer>
      </main>
    );
  }

  const initialValues =
    isEditMode && articleResponse
      ? getArticleEditorInitialValues(articleResponse.article)
      : undefined;

  async function handleSubmit(values: ArticleEditorFormValues) {
    const tagList = parseArticleTags(values.tagList);

    if (isEditMode && slug) {
      await updateArticleMutation.mutateAsync({
        slug,
        title: values.title,
        description: values.description,
        body: values.body,
        tagList,
      });

      return;
    }

    await createArticleMutation.mutateAsync({
      title: values.title,
      description: values.description,
      body: values.body,
      tagList,
    });
  }

  return (
    <main>
      <PageContainer variant="reading">
        <PageHeader
          title={isEditMode ? "Edit Article" : "New Article"}
          description={
            isEditMode
              ? "Update your article and publish the changes."
              : "Write and publish a new article."
          }
        />

        <ArticleEditorForm
          initialValues={initialValues}
          submitLabel={isEditMode ? "Update Article" : "Publish Article"}
          onSubmit={handleSubmit}
        />
      </PageContainer>
    </main>
  );
}

export default EditorPage;
