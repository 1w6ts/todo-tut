import { TodoSkeleton } from "./todo-skeleton";
import { Skeleton } from "./ui/skeleton";

export function TodoListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <TodoSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
