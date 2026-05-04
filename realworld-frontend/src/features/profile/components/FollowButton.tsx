import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/queryKeys";
import { followProfile, unfollowProfile } from "../api/profileApi";
import { UserPlus, UserMinus } from "lucide-react";

type FollowButtonProps = {
  username: string;
  following: boolean;
};

function FollowButton({ username, following }: FollowButtonProps) {
  const queryClient = useQueryClient();
  const Icon = following ? UserMinus : UserPlus;

  const followMutation = useMutation({
    mutationFn: () =>
      following ? unfollowProfile(username) : followProfile(username),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.profile.detail(username),
      });
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      disabled={followMutation.isPending}
      onClick={() => followMutation.mutate()}
      className="border-(--color-accent) text-(--color-accent) hover:bg-(--color-accent-hover) hover:text-white cursor-pointer"
    >
      {
        <>
          <Icon size={16} strokeWidth={3} />
          {following ? "Unfollow" : "Follow"} {username}
        </>
      }
    </Button>
  );
}

export default FollowButton;
