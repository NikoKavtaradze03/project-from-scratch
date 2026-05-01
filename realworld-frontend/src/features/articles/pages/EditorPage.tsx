import { Navigate, useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { queryKeys } from "@/lib/queryKeys";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

import { createArticle, getArticle, updateArticle } from "../api/articlesApi";

import ArticleEditorForm from "../components/ArticleEditorForm";

type ArticleEditorFormValues = {
  title: string;
  description: string;
  body: string;
  tags: string;
};

function EditorPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const params = useParams({ strict: false });
  const slug = params.slug;
  const isEditMode = Boolean(slug);

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
    return <Navigate to="/login" />;
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
      ? {
          title: articleResponse.article.title,
          description: articleResponse.article.description,
          body: articleResponse.article.body,
          tags: articleResponse.article.tagList.join(", "),
        }
      : undefined;

  async function handleSubmit(values: ArticleEditorFormValues) {
    const tagList = values.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

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
