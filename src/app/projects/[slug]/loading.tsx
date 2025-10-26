import { Skeleton } from '@/ui/skeleton';

export default function Loading() {
  return (
    <main className="flex-1">
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-10 w-32" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-3/5" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-16 w-4/5" />
          </div>
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>
      </div>
    </main>
  );
}
