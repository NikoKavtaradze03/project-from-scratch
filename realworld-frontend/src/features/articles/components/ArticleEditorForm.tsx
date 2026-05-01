import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ArticleEditorFormValues = {
  title: string;
  description: string;
  body: string;
  tags: string;
};

type ArticleEditorFormProps = {
  initialValues?: ArticleEditorFormValues;
  submitLabel?: string;
  onSubmit: (values: ArticleEditorFormValues) => Promise<void>;
};

function ArticleEditorForm({
  initialValues,
  submitLabel = "Publish Article",
  onSubmit,
}: ArticleEditorFormProps) {
  const form = useForm({
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      body: initialValues?.body || "",
      tags: initialValues?.tags || "",
    },
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
      <form.Field name="title">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Title</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Article title"
            />
          </div>
        )}
      </form.Field>
      <form.Field name="description">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Description</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Article Description"
            />
          </div>
        )}
      </form.Field>
      <form.Field name="body">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Body</Label>
            <Textarea
              id={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Write your article..."
              className="min-h-64"
            />
          </div>
        )}
      </form.Field>
      <form.Field name="tags">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Tags</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Article Tags"
            />
          </div>
        )}
      </form.Field>
      <Button
        type="submit"
        className="bg-(--color-accent) font-bold hover:bg-(--color-accent-hover) cursor-pointer"
      >
        {submitLabel}
      </Button>
    </form>
  );
}

export default ArticleEditorForm;
