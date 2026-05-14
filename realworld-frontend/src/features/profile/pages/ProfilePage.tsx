import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import PageContainer from "@/components/layout/PageContainer";
import { queryKeys } from "@/lib/queryKeys";
import { getProfile } from "../api/profileApi";
import { ProfileTabs } from "../components/ProfileTabs";
import { ProfileHeader } from "../components/ProfileHeader";
import ProfilePageSkeleton from "../components/ProfilePageSkeleton";

function ProfilePage() {
  const { username } = useParams({ from: "/_app/profile/$username" });

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
          <ProfilePageSkeleton />
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
        <ProfileHeader profile={profile} />
        <ProfileTabs profile={profile} />
      </PageContainer>
    </main>
  );
}

export default ProfilePage;
