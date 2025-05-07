import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CapturedInfo, GeneratedEngineerResource } from "./api/models/types";

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

export function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}

export function getErrorStack(err: Error | unknown): string | undefined {
  if (process.env.NODE_ENV === "development" && err instanceof Error) {
    return err.stack;
  }
  return undefined;
}

export function isCapturedInfoComplete(info: CapturedInfo): boolean {
  return Object.values(info).every((value) => value.trim());
}

export function generateMissingSummary(
  engineer: GeneratedEngineerResource,
): string | null {
  const missing: string[] = [];

  if (engineer.certifications.length === 0) {
    missing.push("certifications");
  }

  const hasIncompleteProjects =
    engineer.projects.length === 0 ||
    engineer.projects.some((p) => !p.client.trim() || !p.description.trim());

  if (hasIncompleteProjects) {
    missing.push("project details");
  }

  if (missing.length === 0) return null;

  const list =
    missing.length === 1 ? missing[0] : `${missing[0]} and ${missing[1]}`;

  return list;
}
