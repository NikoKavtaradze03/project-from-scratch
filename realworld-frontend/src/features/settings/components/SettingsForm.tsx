import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { settingsSchema } from "../utils/settingsSchema";
import getZodError from "@/features/articles/utils/getZodError";

export type SettingsFormValues = {
  image: string;
  username: string;
  bio: string;
  email: string;
  password: string;
};

type SettingsFormProps = {
  initialValues: SettingsFormValues;
  isPending: boolean;
  onSubmit: (values: SettingsFormValues) => Promise<void>;
};

function SettingsForm({
  initialValues,
  isPending,
  onSubmit,
}: SettingsFormProps) {
  const imageSchema = settingsSchema.shape.image;
  const usernameSchema = settingsSchema.shape.username;
  const bioSchema = settingsSchema.shape.bio;
  const emailSchema = settingsSchema.shape.email;
  const passwordSchema = settingsSchema.shape.password;

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const result = settingsSchema.safeParse(value);

      if (!result.success) {
        return;
      }

      await onSubmit(result.data);
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="image"
        validators={{
          onBlur: ({ value }) => getZodError(imageSchema, value),
          onChange: ({ value, fieldApi }) => {
            if (!fieldApi.state.meta.isBlurred) return undefined;

            return getZodError(imageSchema, value);
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Profile image URL</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="https://example.com/avatar.png"
            />
            {field.state.meta.errors[0] ? (
              <p className="text-sm text-(--color-danger)">
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="username"
        validators={{
          onBlur: ({ value }) => getZodError(usernameSchema, value),
          onChange: ({ value, fieldApi }) => {
            if (!fieldApi.state.meta.isBlurred) return undefined;

            return getZodError(usernameSchema, value);
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Username</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Username"
            />
            {field.state.meta.errors[0] ? (
              <p className="text-sm text-(--color-danger)">
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="bio"
        validators={{
          onBlur: ({ value }) => getZodError(bioSchema, value),
          onChange: ({ value, fieldApi }) => {
            if (!fieldApi.state.meta.isBlurred) return undefined;

            return getZodError(bioSchema, value);
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Bio</Label>
            <Textarea
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Tell us about yourself"
              className="min-h-28"
            />
            {field.state.meta.errors[0] ? (
              <p className="text-sm text-(--color-danger)">
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onBlur: ({ value }) => getZodError(emailSchema, value),
          onChange: ({ value, fieldApi }) => {
            if (!fieldApi.state.meta.isBlurred) return undefined;

            return getZodError(emailSchema, value);
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              id={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="you@example.com"
            />
            {field.state.meta.errors[0] ? (
              <p className="text-sm text-(--color-danger)">
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onBlur: ({ value }) => getZodError(passwordSchema, value),
          onChange: ({ value, fieldApi }) => {
            if (!fieldApi.state.meta.isBlurred) return undefined;

            return getZodError(passwordSchema, value);
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>New password</Label>
            <Input
              id={field.name}
              autoComplete="new-password"
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Leave blank to keep current password"
            />
            {field.state.meta.errors[0] ? (
              <p className="text-sm text-(--color-danger)">
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting || isPending}
            className="bg-(--color-accent) font-bold  hover:bg-(--color-accent-hover)"
          >
            {isPending ? "Updating..." : "Update Settings"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

export default SettingsForm;
