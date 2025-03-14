"use client";

import { useState, memo, useRef, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Todo } from "@/server/db/schema";
import { Loader2, Trash, Pencil, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type TodoItemProps = {
  todo: Todo;
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    data: { content?: string; completed?: boolean }
  ) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
};

export const TodoItem = memo(
  ({
    todo,
    onDelete,
    onUpdate,
    isUpdating = false,
    isDeleting = false,
  }: TodoItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(todo.content);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when editing starts
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    const handleEditSubmit = () => {
      if (editedContent.trim() !== "" && editedContent !== todo.content) {
        onUpdate(todo.id, { content: editedContent.trim() });
      }
      setIsEditing(false);
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isEditing) return;

      if (e.key === "Escape") {
        setIsEditing(false);
        setEditedContent(todo.content);
      }
    };

    const handleDeleteClick = () => {
      setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
      onDelete(todo.id);
      setIsDeleteDialogOpen(false);
    };

    return (
      <>
        <Card
          className={cn(
            "mb-2 transition-all duration-200",
            isDeleting && "opacity-50 scale-95",
            todo.completed && "bg-muted"
          )}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="relative">
                {isUpdating && todo.completed !== undefined ? (
                  <Loader2 className="h-4 w-4 animate-spin absolute inset-0" />
                ) : (
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={(checked) => {
                      if (typeof checked === "boolean") {
                        onUpdate(todo.id, { completed: checked });
                      }
                    }}
                    className={cn(
                      "transition-opacity",
                      isUpdating && "opacity-0"
                    )}
                  />
                )}
              </div>

              {isEditing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditSubmit();
                  }}
                  className="flex-1 flex space-x-2 min-w-0"
                  onKeyDown={handleKeyDown}
                >
                  <Input
                    ref={inputRef}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="flex-1 min-w-0"
                    disabled={isUpdating}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={
                      isUpdating ||
                      !editedContent.trim() ||
                      editedContent === todo.content
                    }
                    className="h-8 w-8"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(todo.content);
                    }}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <span
                  className={cn(
                    "ml-2 truncate transition-all duration-200",
                    todo.completed && "line-through text-muted-foreground"
                  )}
                  title={todo.content}
                >
                  {todo.content}
                </span>
              )}
            </div>

            {!isEditing && (
              <div className="flex space-x-2 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  disabled={isUpdating || isDeleting}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteClick}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  disabled={isUpdating || isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Todo</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this todo?
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 border-y my-4">
              <p
                className={cn(
                  "px-4 py-3 rounded-md bg-muted",
                  todo.completed && "line-through text-muted-foreground"
                )}
              >
                {todo.content}
              </p>
            </div>

            <DialogFooter className="flex space-x-2 sm:space-x-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

TodoItem.displayName = "TodoItem";
