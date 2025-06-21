'use client';

import Link from 'next/link';
import { appConfig } from '@/lib/appConfig';
import { ThemeToggle } from './theme-provider';

export default function Navbar() {
  return (
    <nav className="bg-transparent h-10 absolute top-0 left-0 w-full z-50">
      <div className="container mx-auto flex max-w-6xl items-center h-16 px-4">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">{appConfig?.title}</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </nav>
  );
}
