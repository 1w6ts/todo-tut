"use client";

import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Todo } from "@/server/db/schema";

type TodoItemProps = {
  todo: Todo;
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    data: { content?: string; completed?: boolean }
  ) => void;
};

export const TodoItem = ({ todo, onDelete, onUpdate }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(todo.content);

  const handleEditSubmit = () => {
    if (editedContent.trim() !== "") {
      onUpdate(todo.id, { content: editedContent.trim() });
      setIsEditing(false);
    }
  };

  return (
    <Card className="mb-2">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={(checked) => {
              if (typeof checked === "boolean") {
                onUpdate(todo.id, { completed: checked });
              }
            }}
          />
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
              className="flex-1 flex space-x-2"
            >
              <Input
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit" size="sm">
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(todo.content);
                }}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <span
              className={`ml-2 ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.content}
            </span>
          )}
        </div>
        {!isEditing && (
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(todo.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
