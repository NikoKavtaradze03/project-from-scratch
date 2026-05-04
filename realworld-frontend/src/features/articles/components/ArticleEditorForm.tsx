import { useForm } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ArticleEditorFormValues = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
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
  const [tagInput, setTagInput] = useState("");
  const form = useForm({
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      body: initialValues?.body || "",
      tagList: initialValues?.tagList || [],
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

      <form.Field name="tagList">
        {(field) => {
          function addTag() {
            const tag = tagInput.trim();

            if (!tag) {
              return;
            }

            if (!field.state.value.includes(tag)) {
              field.handleChange([...field.state.value, tag]);
            }

            setTagInput("");
          }

          function removeTag(tag: string) {
            field.handleChange(field.state.value.filter((item) => item !== tag));
          }

          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Tags</Label>
              <Input
                id={field.name}
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
              />

              {field.state.value.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {field.state.value.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="group inline-flex h-7 items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-surface-elevated) px-3 text-xs font-medium text-(--color-text-secondary) transition hover:border-(--color-danger) hover:text-(--color-text) cursor-pointer"
                    >
                      <span>{tag}</span>
                      <X
                        size={13}
                        strokeWidth={3}
                        className="text-(--color-text-muted) transition group-hover:text-(--color-danger)"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        }}
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
