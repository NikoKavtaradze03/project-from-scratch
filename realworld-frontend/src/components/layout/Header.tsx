import { Link } from "@tanstack/react-router";
import PageContainer from "./PageContainer";
import { House, LogIn, LogOut, Settings, SquarePen } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getCurrentUser } from "@/features/auth/api/authApi";
import { getToken } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { removeToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/shared/UserAvatar";

const linkStyles = "text-base font-bold [&.active]:text-(--color-accent)";

function Header() {
  const hasToken = Boolean(getToken());

  const { data } = useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: getCurrentUser,
    enabled: hasToken, // Only fetch current user if token exists
  });

  const currentUser = data?.user;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  function handleLogout() {
    removeToken();
    queryClient.setQueryData(queryKeys.auth.currentUser, null);
    queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser });
    navigate({ to: "/" });
  }

  return (
    <header className="border-b border-(--color-border) bg-(--color-bg)">
      <PageContainer className="py-0">
        <div className="flex h-12 items-center justify-between">
          <Link
            to="/"
            className="text-3xl font-bold tracking-tight text-(--color-accent)"
          >
            conduit
          </Link>

          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className={linkStyles}>
              <div className="flex gap-2">
                <House size={24} strokeWidth={3} /> Home
              </div>
            </Link>
            {currentUser ? (
              <>
                <Link to="/editor" className={linkStyles}>
                  <div className="flex gap-2">
                    <SquarePen size={24} strokeWidth={3} /> New Article
                  </div>
                </Link>
                <Link to="/settings" className={linkStyles}>
                  <div className="flex gap-2">
                    <Settings size={24} strokeWidth={3} /> Settings
                  </div>
                </Link>
                <Link
                  to="/profile/$username"
                  params={{ username: currentUser.username }}
                  className={linkStyles}
                >
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      username={currentUser.username}
                      image={currentUser.image}
                      size="sm"
                    />
                    <span>{currentUser.username}</span>
                  </div>
                </Link>
                <Button
                  type="button"
                  size="lg"
                  onClick={handleLogout}
                  className="bg-(--color-danger) font-bold text-white transition-colors hover:bg-red-500 cursor-pointer"
                >
                  <LogOut size={16} strokeWidth={3} />
                  LOGOUT
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkStyles}>
                  <div className="flex gap-2">
                    <LogIn size={24} strokeWidth={3} />
                    Sign in
                  </div>
                </Link>
                <Button
                  asChild
                  size="lg"
                  className="bg-(--color-accent) font-bold  transition-colors hover:bg-(--color-accent-hover)"
                >
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </PageContainer>
    </header>
  );
}

export default Header;
