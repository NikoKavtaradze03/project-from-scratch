import FollowButton from "./FollowButton";
import UserAvatar from "@/components/shared/UserAvatar";

type ProfileHeaderProps = {
  profile: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
};

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <section className=" relative rounded-2xl border border-(--color-border) bg-(--color-surface-elevated) p-6 flex flex-col items-center text-center align-center gap-2">
      <UserAvatar
        username={profile.username}
        size="large"
        image={profile.image}
      />
      <h1 className="text-3xl font-semibold text-(--color-text)">
        {profile.username}
      </h1>

      <p className="mt-2 text-sm text-(--color-text-secondary) max-w-200">
        {profile.bio ?? "No bio yet."}
      </p>
      <div className="flex justify-end w-full mt-2">
        <FollowButton
          username={profile.username}
          following={profile.following}
        ></FollowButton>
      </div>
    </section>
  );
}
