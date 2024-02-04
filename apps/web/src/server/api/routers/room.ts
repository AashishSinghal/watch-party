import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prismaClient } from "@/lib/utils";

export const roomRouter = createTRPCRouter({
  createRoom: publicProcedure
    .input(
      z.object({
        name: z.string(),
        password: z.string().optional(),
        isPrivate: z.boolean(),
        createdby: z.object({
          id: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          email: z.string(),
          imageUrl: z.string(),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return prismaClient.room.create({
        data: {
          ...input,
          createdby: {
            connectOrCreate: {
              where: { email: input.createdby.email },
              create: { ...input.createdby },
            },
          },
        },
      });
    }),

  getAllRooms: publicProcedure.query(({ ctx }) => {
    return prismaClient.room.findMany();
  }),
});
