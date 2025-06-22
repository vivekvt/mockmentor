import * as React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <footer
      className={cn('mt-4 relative w-full ', className)}
      ref={ref}
      {...props}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-geist text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href="/interview/new"
              className="text-sm font-geist text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
            >
              New Interview
            </Link>
          </nav>

          {/* Creator Credit & Social Links */}
          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
            <div className="flex items-center gap-2 text-sm font-geist">
              <span className="text-gray-600 dark:text-gray-400">
                Created by
              </span>
              <a
                href="https://vivekthakur.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-block"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 hover:from-purple-700 hover:to-pink-600 dark:hover:from-purple-200 dark:hover:to-orange-100 transition-all duration-300">
                  Vivek Thakur
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/vivekvt_"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                aria-label="Follow on X (Twitter)"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com/in/vivekvt"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:contact@vivekthakur.dev"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                aria-label="Send email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Border Line */}
        <div className="mt-6 pt-6 nborder-t border-black/5 dark:border-white/5">
          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} MockMentor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export { Footer };
