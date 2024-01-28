import { PrismaClient } from "@prisma/client";

const prismClient = new PrismaClient({
  log: ["query"],
});

export default prismClient;
