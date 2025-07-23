// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class names intelligently
 * - gère les conditions
 * - fusionne les classes conflictuelles (ex: px-2 vs px-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
