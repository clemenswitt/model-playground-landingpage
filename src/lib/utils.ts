import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind class names, resolving conditionals via `clsx` and letting
 * later utilities of the same group win over earlier ones via `twMerge`.
 *
 * @param {...ClassValue} inputs Class names, arrays, or conditional maps.
 * @returns {string} Deduplicated class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
