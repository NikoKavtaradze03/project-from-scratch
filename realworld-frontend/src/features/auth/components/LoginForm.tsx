import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { setToken } from "@/lib/auth";
import { loginUser } from "../api/authApi";
import AuthField from "./AuthField";
import { loginSchema } from "../utils/authSchema";
import { queryKeys } from "@/lib/queryKeys";
import { ApiError } from "@/lib/errors";
import { Route } from "@/routes/login";

function LoginForm() {
  const emailSchema = loginSchema.shape.email;
  const passwordSchema = loginSchema.shape.password;
  const search = Route.useSearch();
  const redirectTo = search.redirect ?? "/";

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
      const result = loginSchema.safeParse(value);

      if (!result.success) {
        return;
      }

      const response = await loginMutation.mutateAsync(result.data);

      setToken(response.user.token);
      queryClient.setQueryData(queryKeys.auth.currentUser, response);
      navigate({ to: redirectTo });
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
      <form.Field
        name="email"
        validators={{
          onBlur: ({ value }) => {
            const result = emailSchema.safeParse(value);

            return result.success ? undefined : result.error.issues[0]?.message;
          },
          onChange: ({ value, fieldApi }) => {
            if (!fieldApi.state.meta.isBlurred) return undefined;

            const result = emailSchema.safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <AuthField
            id={field.name}
            label="Email"
            type="email"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
            onBlur={field.handleBlur}
            placeholder="you@example.com"
            error={field.state.meta.errors[0]}
          />
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onBlur: ({ value }) => {
            const result = passwordSchema.safeParse(value);

            return result.success ? undefined : result.error.issues[0]?.message;
          },
          onChange: ({ value, fieldApi }) => {
            if (!fieldApi.state.meta.isBlurred) return undefined;

            const result = passwordSchema.safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <AuthField
            id={field.name}
            label="Password"
            type="password"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
            onBlur={field.handleBlur}
            placeholder="********"
            error={field.state.meta.errors[0]}
          />
        )}
      </form.Field>

      {loginMutation.isError ? (
        <p className="text-sm text-(--color-danger)">
          {loginMutation.error instanceof ApiError
            ? loginMutation.error.message
            : "Something went wrong. Please try again."}
        </p>
      ) : null}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting || loginMutation.isPending}
            className="w-full bg-(--color-accent) py-5 font-bold transition-colors hover:bg-(--color-accent-hover)"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

export default LoginForm;
