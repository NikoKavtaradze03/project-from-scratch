import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type SettingsFormValues = {
  image: string;
  username: string;
  bio: string;
  email: string;
  password: string;
};

type SettingsFormProps = {
  initialValues: SettingsFormValues;
  isSubmitting: boolean;
  onSubmit: (values: SettingsFormValues) => Promise<void>;
};

function SettingsForm({
  initialValues,
  isSubmitting,
  onSubmit,
}: SettingsFormProps) {
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
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
      <form.Field name="image">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Profile image URL</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="https://example.com/avatar.png"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="username">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Username</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Username"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="bio">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Bio</Label>
            <Textarea
              id={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Tell us about yourself"
              className="min-h-28"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              id={field.name}
              type="email"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="you@example.com"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>New password</Label>
            <Input
              id={field.name}
              autoComplete="new-password"
              type="password"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>
        )}
      </form.Field>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-(--color-accent) font-bold  hover:bg-(--color-accent-hover)"
      >
        {isSubmitting ? "Saving..." : "Update Settings"}
      </Button>
    </form>
  );
}

export default SettingsForm;
