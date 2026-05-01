import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { setToken } from "@/lib/auth";
import { registerUser } from "../api/authApi";
import AuthField from "./AuthField";
import { queryKeys } from "@/lib/queryKeys";

function RegisterForm() {
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
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
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
      <form.Field name="username">
        {(field) => (
          <AuthField
            id={field.name}
            label="Username"
            type="text"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
            placeholder="your username"
          />
        )}
      </form.Field>

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

      {registerMutation.isError ? (
        <p className="text-sm text-(--color-danger)">
          Registration failed. Please try again.
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full bg-(--color-accent) py-5 font-bold transition-colors hover:bg-(--color-accent-hover)"
      >
        {registerMutation.isPending ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  );
}

export default RegisterForm;
