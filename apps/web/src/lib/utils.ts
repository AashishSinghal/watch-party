import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { PrismaClient } from "@prisma/client";

export const prismClient = new PrismaClient({
  log: ["query"],
});