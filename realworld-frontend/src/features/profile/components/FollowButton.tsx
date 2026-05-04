import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/queryKeys";
import { followProfile, unfollowProfile } from "../api/profileApi";
import { UserPlus, UserMinus } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useNavigate } from "@tanstack/react-router";

type FollowButtonProps = {
  username: string;
  following: boolean;
};

function FollowButton({ username, following }: FollowButtonProps) {
  const queryClient = useQueryClient();
  const Icon = following ? UserMinus : UserPlus;
  const { data: currentUserResponse } = useCurrentUser();
  const currentUser = currentUserResponse?.user;
  const navigate = useNavigate();

  const followMutation = useMutation({
    mutationFn: () =>
      following ? unfollowProfile(username) : followProfile(username),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.profile.detail(username),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.articles.all,
      });
    },
  });

  return (
    currentUser?.username !== username && (
      <Button
        type="button"
        variant="outline"
        disabled={followMutation.isPending}
        onClick={
          !currentUser
            ? () => navigate({ to: "/login" })
            : () => followMutation.mutate()
        }
        className="border-(--color-accent) text-(--color-accent) hover:bg-(--color-accent-hover) hover:text-white cursor-pointer h-9"
      >
        {
          <>
            <Icon size={16} strokeWidth={3} />
            {following ? "Unfollow" : "Follow"} {username}
          </>
        }
      </Button>
    )
  );
}

export default FollowButton;
