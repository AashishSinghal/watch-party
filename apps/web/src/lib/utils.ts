import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prismaClient = globalForPrisma.prisma || new PrismaClient({
  log: ["query"],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient

export const getFormatedUserData = (user: any, isClient: boolean = false) => {
  if (!user) {
    return null;
  }
  if (isClient) {
    const { id, firstName, lastName, primaryEmailAddress, imageUrl } = user;
    const { emailAddress } = primaryEmailAddress;
    return {
      id,
      firstName,
      lastName,
      email: emailAddress,
      imageUrl,
    };
  }
  const { id, firstName, lastName, emailAddresses, imageUrl } = user;
  const { emailAddress } = emailAddresses[0];

  return {
    id,
    firstName,
    lastName,
    email: emailAddress,
    imageUrl,
  };
};
