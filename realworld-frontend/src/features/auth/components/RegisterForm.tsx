import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { setToken } from "@/lib/auth";
import { registerUser } from "../api/authApi";
import AuthField from "./AuthField";
import { queryKeys } from "@/lib/queryKeys";
import { registerSchema } from "../utils/authSchema";

function RegisterForm() {
  const emailSchema = registerSchema.shape.email;
  const passwordSchema = registerSchema.shape.password;
  const usernameSchema = registerSchema.shape.username;

  const queryClient = useQueryClient();
  const registerMutation = useMutation({
    mutationFn: registerUser,
  });

  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const response = await registerMutation.mutateAsync(value);
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
      <form.Field
        name="username"
        validators={{
          onBlur: ({ value }) => {
            const result = usernameSchema.safeParse(value);

            return result.success ? undefined : result.error.issues[0]?.message;
          },
          onChange: ({ value, fieldApi }) => {
            if (!fieldApi.state.meta.isBlurred) return undefined;

            const result = usernameSchema.safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <AuthField
            id={field.name}
            label="Username"
            type="text"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
            onBlur={field.handleBlur}
            placeholder="your username"
            error={field.state.meta.errors[0]}
          />
        )}
      </form.Field>

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
            onBlur={field.handleBlur}
            onChange={(value) => field.handleChange(value)}
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
            onBlur={field.handleBlur}
            onChange={(value) => field.handleChange(value)}
            placeholder="********"
            error={field.state.meta.errors[0]}
          />
        )}
      </form.Field>

      {registerMutation.isError ? (
        <p className="text-sm text-(--color-danger)">
          Registration failed. Please try again.
        </p>
      ) : null}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting || registerMutation.isPending}
            className="w-full bg-(--color-accent) py-5 font-bold transition-colors hover:bg-(--color-accent-hover)"
          >
            {registerMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

export default RegisterForm;
