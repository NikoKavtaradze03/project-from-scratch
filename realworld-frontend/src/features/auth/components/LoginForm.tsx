import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { setToken } from "@/lib/auth";
import { loginUser } from "../api/authApi";
import AuthField from "./AuthField";

import { queryKeys } from "@/lib/queryKeys";

function LoginForm() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: loginUser,
  });
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const response = await loginMutation.mutateAsync(value);

      setToken(response.user.token);
      queryClient.setQueryData(queryKeys.auth.currentUser, response);
      navigate({ to: "/" });
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => (
          <AuthField
            id={field.name}
            label="Email"
            type="email"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
            placeholder="you@example.com"
          />
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <AuthField
            id={field.name}
            label="Password"
            type="password"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
            placeholder="********"
          />
        )}
      </form.Field>

      {loginMutation.isError ? (
        <p className="text-sm text-(--color-danger)">
          Invalid email or password.
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-(--color-accent) py-5 font-bold transition-colors hover:bg-(--color-accent-hover)"
      >
        {loginMutation.isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

export default LoginForm;
