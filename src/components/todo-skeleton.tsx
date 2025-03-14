import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TodoSkeleton() {
  return (
    <Card className="mb-2">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 w-full">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-full max-w-[300px]" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
