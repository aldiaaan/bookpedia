import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function singleton<T>(name: string, valueFactory: () => T): T {
  const g = globalThis as unknown as Record<string, T>

  if (!(name in g)) {
    g[name] = valueFactory()
  }

  return g[name]
}
