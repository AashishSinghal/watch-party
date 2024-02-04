import { Server } from "socket.io";
import { Redis, RedisOptions } from "ioredis";
import prismaClient from "./prisma";
import { produceMessage } from "./kafka";

// const redisCreds: RedisOptions = {
//   host: process.env.REDIS_HOST!,
//   port: Number(process.env.PORT!),
//   username: process.env.REDIS_USERNAME!,
//   password: process.env.REDIS_PASSWORD!,
// };

const redisUri = process.env.REDIS_URI!;

const pub = new Redis(redisUri);
const sub = new Redis(redisUri);

class SocketService {
  private _io: Server;
  constructor() {
    console.log("Init Socket Server...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListerners() {
    const io = this.io;

    console.log("Init Socket Listeners...");

    io.on("connection", (socket) => {
      console.log(`New Socket connected - `, socket.id);
      socket.on("event:messsage", async (data: { message: string }) => {
        console.log("New msg rec - ", data);
        await pub.publish(
          "MESSAGES",
          JSON.stringify({ message: data.message })
        );
      });
      socket.on("room:join", async ({ roomId, user }: any) => {
        console.log("roomId - ", roomId);
        console.log("user - ", user);
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("new message from redis - ", message);
        io.emit("message", message);
        await produceMessage(message);
        console.log("Message produced to kafka broker");
        // await prismaClient.message.create({
        //   data: {
        //     text: message,
        //   },
        // });
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
