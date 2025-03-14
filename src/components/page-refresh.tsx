"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export function PageRefresh() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleRefresh}
      className="rounded-full"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      <span className="sr-only">Refresh page</span>
    </Button>
  );
}
