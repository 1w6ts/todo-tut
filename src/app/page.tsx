import { TodoList } from "@/components/todo-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageRefresh } from "@/components/page-refresh";
import Link from "next/link";
import GithubButton from "@/components/github-button";

export default function Home() {
  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Todo App</h1>
          <div className="flex space-x-2">
            <GithubButton />
            <PageRefresh />
            <ThemeToggle />
          </div>
        </header>

        <main>
          <TodoList />
        </main>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js, tRPC, Neon, Drizzle, and shadcn by{" "}
            <Link
              href="https://github.com/1w6ts"
              className="hover:underline hover:text-white transition-all duration-300"
            >
              1w6ts
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
