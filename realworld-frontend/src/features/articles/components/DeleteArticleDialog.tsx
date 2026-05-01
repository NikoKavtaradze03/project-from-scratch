import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type DeleteArticleDialogProps = {
  isDeleting: boolean;
  errorMessage?: string;
  onDelete: () => void;
};

const dangerButtonStyle =
  "h-full cursor-pointer border-(--color-danger) text-(--color-danger) hover:bg-(--color-danger) hover:text-(--color-text) disabled:cursor-not-allowed py-2";

const dangerActionStyle =
  "bg-(--color-danger) font-bold text-(--color-text) hover:bg-red-500";

function DeleteArticleDialog({
  isDeleting,
  errorMessage,
  onDelete,
}: DeleteArticleDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={isDeleting}
          className={dangerButtonStyle}
        >
          <Trash size={16} strokeWidth={3} />
          {isDeleting ? "Deleting..." : "Delete Article"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border border-(--color-border) bg-(--color-surface-elevated) text-(--color-text)">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this article?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The article will be permanently
            removed from your profile and the global feed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            disabled={isDeleting}
            onClick={onDelete}
            className={dangerActionStyle}
          >
            {isDeleting ? "Deleting..." : "Delete Article"}
          </Button>
        </AlertDialogFooter>

        {errorMessage ? (
          <p className="text-sm text-(--color-danger)">{errorMessage}</p>
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteArticleDialog;
