import { IUser } from "./types";
import { prismaClient } from "./utils";

export async function createUser({
    id,
    firstName,
    lastName,
    email,
    imageUrl,
  }: IUser) {
    const existingUser = await prismaClient.user.findFirst({
      where: {
        id,
      },
    });
    if (existingUser) {
      return;
    } else {
      try {
        await prismaClient.user.create({
          data: {
            id,
            firstName,
            lastName,
            email,
            imageUrl,
          },
        });
      } catch (error) {
        throw new Error(`Something went wrong - ${error}`);
      }
    }
  }