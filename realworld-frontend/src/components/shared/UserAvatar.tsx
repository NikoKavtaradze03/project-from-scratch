import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  username: string;
  image?: string | null;
  size?: "sm" | "default" | "large";
};

const sizeStyles = {
  sm: {
    avatar: "size-7",
    fallback: "text-xs",
  },
  default: {
    avatar: "",
    fallback: "text-sm",
  },
  large: {
    avatar: "size-20",
    fallback: "text-xl",
  },
};

function UserAvatar({ username, image, size = "default" }: UserAvatarProps) {
  const userInitial = username.charAt(0).toUpperCase();
  const styles = sizeStyles[size];

  return (
    <Avatar
      className={`${styles.avatar} bg-(--color-surface-elevated) ring-1 ring-(--color-border)`}
    >
      {image ? <AvatarImage src={image} alt="" /> : null}
      <AvatarFallback
        className={`${styles.fallback} bg-(--color-accent) font-bold text-(--color-bg)`}
      >
        {userInitial}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
