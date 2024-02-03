import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prismaClient } from "@/lib/utils";

export const roomRouter = createTRPCRouter({
  createRoom: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      // const data = prismaClient.room.create({
      //     data: {

      //     }
      // })
      return {
        ...input,
      };
    }),
});
