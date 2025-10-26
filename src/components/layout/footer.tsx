'use client';

import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 py-8">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Three.js Portfolio. Built with Next.js & shadcn/ui.
        </p>

        <Link
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <FaGithub size={20} />
          GitHub
        </Link>
      </div>
    </footer>
  );
}
