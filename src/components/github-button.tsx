import { FaGithub } from "react-icons/fa";
import { Button } from "./ui/button";
import Link from "next/link";

export default function GithubButton() {
  return (
    <Link href="https://github.com/1w6ts/todo-tut" target="_blank">
      <Button variant="outline" size="icon" className="rounded-full">
        <FaGithub className={`h-4 w-4`} />
        <span className="sr-only">Github</span>
      </Button>
    </Link>
  );
}
