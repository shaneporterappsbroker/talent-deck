import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function getErrorStack(err: Error | unknown): string | undefined {
  if (process.env.NODE_ENV === "development" && err instanceof Error) {
    return err.stack;
  }
  return undefined;
}
