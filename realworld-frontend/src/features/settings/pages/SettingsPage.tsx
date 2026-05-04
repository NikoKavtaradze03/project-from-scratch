import { Navigate, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

import { queryKeys } from "@/lib/queryKeys";
import { removeToken, setToken } from "@/lib/auth";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { updateUser } from "@/features/auth/api/authApi";

import SettingsForm, {
  type SettingsFormValues,
} from "../components/SettingsForm";

function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: currentUserResponse, isLoading } = useCurrentUser();
  const currentUser = currentUserResponse?.user;

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async (response) => {
      setToken(response.user.token);

      await queryClient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser,
      });
    },
  });

  function handleLogout() {
    removeToken();

    queryClient.setQueryData(queryKeys.auth.currentUser, null);
    queryClient.removeQueries({
      queryKey: queryKeys.auth.currentUser,
    });

    navigate({ to: "/" });
  }

  async function handleSubmit(values: SettingsFormValues) {
    await updateUserMutation.mutateAsync({
      image: values.image || undefined,
      username: values.username,
      bio: values.bio || undefined,
      email: values.email,
      password: values.password || undefined,
    });
  }

  if (isLoading) {
    return (
      <main>
        <PageContainer>
          <p className="text-sm text-(--color-text-muted)">
            Loading settings...
          </p>
        </PageContainer>
      </main>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const initialValues: SettingsFormValues = {
    image: currentUser.image ?? "",
    username: currentUser.username,
    bio: currentUser.bio ?? "",
    email: currentUser.email,
    password: "",
  };

  return (
    <main>
      <PageContainer variant="reading">
        <PageHeader
          title="Settings"
          description="Update your profile and account information."
        />

        <SettingsForm
          initialValues={initialValues}
          isSubmitting={updateUserMutation.isPending}
          onSubmit={handleSubmit}
        />

        {updateUserMutation.isError ? (
          <p className="mt-4 text-sm text-(--color-danger)">
            Failed to update settings.
          </p>
        ) : null}

        {updateUserMutation.isSuccess ? (
          <p className="mt-4 text-sm text-(--color-accent)">
            Settings updated successfully.
          </p>
        ) : null}

        <div className="mt-8 border-t border-(--color-border) pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="border-(--color-danger) text-(--color-danger) hover:bg-(--color-danger) hover:text-(--color-text)"
          >
            Logout
          </Button>
        </div>
      </PageContainer>
    </main>
  );
}

export default SettingsPage;
