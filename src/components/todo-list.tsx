"use client";

import { useState, useCallback } from "react";
import { TodoItem } from "./todo-item";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/utils/trpc/client";
import { TodoListSkeleton } from "./todo-list-skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2, Search } from "lucide-react";
import { Todo } from "@/server/db/schema";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Define filter types
type FilterType = "all" | "active" | "completed";

export const TodoList = () => {
  const [newTodoContent, setNewTodoContent] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedNewTodo = useDebounce(newTodoContent, 300);

  const utils = api.useContext();
  const todosQuery = api.todo.getAll.useQuery(undefined, {
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
  });

  const createMutation = api.todo.create.useMutation({
    onMutate: async (newTodo) => {
      // Cancel outgoing refetches
      await utils.todo.getAll.cancel();

      // Get current todos
      const previousTodos = utils.todo.getAll.getData() || [];

      const optimisticTodo: Todo = {
        id: Math.floor(Math.random() * -1000000),
        content: newTodo.content,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // @ts-ignore
      utils.todo.getAll.setData(undefined, [...previousTodos, optimisticTodo]);

      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      // Revert to previous state
      if (context?.previousTodos) {
        utils.todo.getAll.setData(undefined, context.previousTodos);
      }
      toast.error("Error adding todo", { description: err.message });
    },
    onSuccess: () => {
      setNewTodoContent("");
      toast.success("Success!", { description: "Todo added successfully" });
    },
    onSettled: () => {
      utils.todo.getAll.invalidate();
    },
  });

  const updateMutation = api.todo.update.useMutation({
    onMutate: async (updatedTodo) => {
      await utils.todo.getAll.cancel();

      const previousTodos = utils.todo.getAll.getData() || [];

      utils.todo.getAll.setData(
        undefined,
        previousTodos.map((todo) =>
          todo.id === updatedTodo.id
            ? { ...todo, ...updatedTodo, updatedAt: new Date().toISOString() }
            : todo
        )
      );

      return { previousTodos };
    },
    onError: (err, updatedTodo, context) => {
      if (context?.previousTodos) {
        utils.todo.getAll.setData(undefined, context.previousTodos);
      }
      toast.error("Error updating todo", { description: err.message });
    },
    onSettled: () => {
      utils.todo.getAll.invalidate();
    },
  });

  const deleteMutation = api.todo.delete.useMutation({
    onMutate: async (deletedTodo) => {
      await utils.todo.getAll.cancel();

      const previousTodos = utils.todo.getAll.getData() || [];

      utils.todo.getAll.setData(
        undefined,
        previousTodos.filter((todo) => todo.id !== deletedTodo.id)
      );

      return { previousTodos };
    },
    onError: (err, deletedTodo, context) => {
      if (context?.previousTodos) {
        utils.todo.getAll.setData(undefined, context.previousTodos);
      }
      toast.error("Error deleting todo", { description: err.message });
    },
    onSuccess: () => {
      toast.success("Success!", { description: "Todo deleted successfully" });
    },
    onSettled: () => {
      utils.todo.getAll.invalidate();
    },
  });

  const handleAddTodo = useCallback(() => {
    if (debouncedNewTodo.trim() !== "") {
      createMutation.mutate({ content: debouncedNewTodo.trim() });
    }
  }, [debouncedNewTodo, createMutation]);

  const handleUpdateTodo = useCallback(
    (id: number, data: { content?: string; completed?: boolean }) => {
      updateMutation.mutate({ id, ...data });
    },
    [updateMutation]
  );

  const handleDeleteTodo = useCallback(
    (id: number) => {
      deleteMutation.mutate({ id });
    },
    [deleteMutation]
  );

  // Get the total and completed todo counts
  const todoCount = todosQuery.data?.length || 0;
  const completedCount =
    todosQuery.data?.filter((todo) => todo.completed).length || 0;

  // Filter todos based on the selected filter and search query
  const filteredTodos = todosQuery.data?.filter((todo) => {
    // First apply the completion filter
    const matchesCompletionFilter =
      filter === "all" ||
      (filter === "active" && !todo.completed) ||
      (filter === "completed" && todo.completed);

    // Then apply the search filter if there's a search query
    const matchesSearchFilter = searchQuery
      ? todo.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCompletionFilter && matchesSearchFilter;
  });

  // If loading, show skeleton
  if (todosQuery.isLoading) {
    return <TodoListSkeleton />;
  }

  if (todosQuery.isError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-red-800 dark:text-red-200">
        <h3 className="font-bold">Error loading todos</h3>
        <p>{todosQuery.error.message}</p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => todosQuery.refetch()}
        >
          Try again
        </Button>
      </div>
    );
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
          disabled={createMutation.isLoading}
        />
        <Button
          type="submit"
          disabled={!newTodoContent.trim() || createMutation.isLoading}
        >
          {createMutation.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Add"
          )}
        </Button>
      </form>

      {todoCount > 0 && (
        <div className="text-sm text-muted-foreground">
          <div className="flex justify-between mb-2">
            <span>
              {completedCount} of {todoCount} completed
            </span>
            {completedCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-0 px-2"
                onClick={() => {
                  // Update all completed todos to be not completed
                  todosQuery.data
                    ?.filter((todo) => todo.completed)
                    .forEach((todo) => {
                      handleUpdateTodo(todo.id, { completed: false });
                    });
                }}
              >
                Clear completed
              </Button>
            )}
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500 ease-in-out"
              style={{ width: `${(completedCount / todoCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium whitespace-nowrap">Filter:</div>
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as FilterType)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search todos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div>
        {todoCount === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-2">No todos yet. Add one above!</p>
            <Button
              variant="outline"
              onClick={() => {
                setNewTodoContent("My first todo");
              }}
            >
              Add sample todo
            </Button>
          </div>
        ) : filteredTodos?.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            {searchQuery ? (
              <p>No todos matching "{searchQuery}"</p>
            ) : (
              <p>
                No {filter === "active" ? "active" : "completed"} todos found.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTodos?.map((todo) => (
              <TodoItem
                key={todo.id}
                // @ts-ignore
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
                isUpdating={
                  updateMutation.variables?.id === todo.id &&
                  updateMutation.isLoading
                }
                isDeleting={
                  deleteMutation.variables?.id === todo.id &&
                  deleteMutation.isLoading
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
