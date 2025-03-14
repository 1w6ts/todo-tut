"use client";

import { useState } from "react";
import { TodoItem } from "./todo-item";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/utils/trpc/client";
import { toast } from "sonner";

export const TodoList = () => {
  const [newTodoContent, setNewTodoContent] = useState("");

  const utils = api.useContext();
  const todosQuery = api.todo.getAll.useQuery();

  const createMutation = api.todo.create.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
      setNewTodoContent("");
      toast.success("Success!", { description: "Todo added successfully" });
    },
    onError: (error) => {
      toast.error("Error", { description: error.message });
    },
  });

  const updateMutation = api.todo.update.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
    },
  });

  const deleteMutation = api.todo.delete.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
      toast.success("Success!", { description: "Todo deleted successfully" });
    },
  });

  const handleAddTodo = () => {
    if (newTodoContent.trim() !== "") {
      createMutation.mutate({ content: newTodoContent.trim() });
    }
  };

  const handleUpdateTodo = (
    id: number,
    data: { content?: string; completed?: boolean }
  ) => {
    updateMutation.mutate({ id, ...data });
  };

  const handleDeleteTodo = (id: number) => {
    deleteMutation.mutate({ id });
  };

  if (todosQuery.isLoading) {
    return <div>Loading todos...</div>;
  }

  if (todosQuery.isError) {
    return <div>Error loading todos: {todosQuery.error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTodo();
        }}
        className="flex space-x-2"
      >
        <Input
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1"
        />
        <Button type="submit">Add</Button>
      </form>

      <div>
        {todosQuery.data?.length === 0 ? (
          <p className="text-center text-gray-500 my-4">
            No todos yet. Add one above!
          </p>
        ) : (
          todosQuery.data?.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={{
                ...todo,
                createdAt: new Date(todo.createdAt),
                updatedAt: new Date(todo.updatedAt),
              }}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};
