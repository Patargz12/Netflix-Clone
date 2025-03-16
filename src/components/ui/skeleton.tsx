import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class name merging

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional custom className to apply to the skeleton element
   */
  className?: string;
}

/**
 * Skeleton component for loading states
 *
 * @example
 * // Basic usage
 * <Skeleton className="h-10 w-full" />
 *
 * @example
 * // Circle skeleton (for avatars)
 * <Skeleton className="h-12 w-12 rounded-full" />
 *
 * @example
 * // Text line skeleton
 * <Skeleton className="h-4 w-full mb-2" />
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn('bg-zinc-800 rounded-md animate-pulse', className)} {...props} />;
}
