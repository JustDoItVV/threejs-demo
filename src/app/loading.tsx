import { Skeleton } from '@/ui/skeleton';

export default function Loading() {
  return (
    <main className="flex-1">
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="flex flex-col gap-6 max-w-3xl">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-4/5" />
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="flex flex-col gap-8">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-60 w-full rounded-lg" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-11/12" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
