import { cn } from '@/lib/utils';
import React from 'react';

export default function SectionHeading({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div className={cn('text-center pt-16s spb-8', className)}>
      <h2 className=" text-2xl tracking-tighter font-geist bg-clip-text text-transparent mx-auto md:text-6xl bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
        {title}
      </h2>
      <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-xs md:text-lg leading-relaxed text-center px-4 my-4">
        {subtitle}
      </p>
    </div>
  );
}
