import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import PageContainer from "@/components/layout/PageContainer";
import { queryKeys } from "@/lib/queryKeys";
import { getProfile } from "../api/profileApi";

function ProfilePage() {
  const { username } = useParams({ from: "/profile/$username" });

  const {
    data: profileResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.profile.detail(username),
    queryFn: () => getProfile(username),
  });

  if (isLoading) {
    return (
      <main>
        <PageContainer>
          <p className="text-sm text-(--color-text-muted)">
            Loading profile...
          </p>
        </PageContainer>
      </main>
    );
  }

  if (isError || !profileResponse) {
    return (
      <main>
        <PageContainer>
          <p className="text-sm text-(--color-danger)">
            Failed to load profile.
          </p>
        </PageContainer>
      </main>
    );
  }

  const profile = profileResponse.profile;

  return (
    <main>
      <PageContainer>
        <section className="rounded-2xl border border-(--color-border) bg-(--color-surface-elevated) p-6">
          <h1 className="text-3xl font-semibold text-(--color-text)">
            {profile.username}
          </h1>

          <p className="mt-2 text-sm text-(--color-text-secondary)">
            {profile.bio ?? "No bio yet."}
          </p>
        </section>
      </PageContainer>
    </main>
  );
}

export default ProfilePage;
