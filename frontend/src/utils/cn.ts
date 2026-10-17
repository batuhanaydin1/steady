export type ClassValue = string | false | null | undefined

/** Joins conditional class names, skipping falsy values. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
