'use client';

import Link from 'next/link';

import { ThemeToggle } from '@/components/theme/theme-toggle';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
          Three.js Portfolio
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
