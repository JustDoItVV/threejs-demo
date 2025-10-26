import Link from 'next/link';

import { Button } from '@/ui/button';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="container max-w-md">
        <div className="flex flex-col gap-6 text-center">
          <h1 className="text-4xl font-bold">Project Not Found</h1>
          <p className="text-lg text-muted-foreground">
            The project you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
