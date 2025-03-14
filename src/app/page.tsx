import { TodoList } from "@/components/todo-list";

export default function Home() {
  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Todo App</h1>
      <TodoList />
    </div>
  );
}
