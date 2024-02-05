import { Server } from "socket.io";
import { Redis, RedisOptions } from "ioredis";
import prismaClient from "./prisma";
import { produceMessage } from "./kafka";
import { IRedisMessageEventData } from "../utils/types";

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

    const emailToSocketIdMap = new Map();
    const socketIdToEmailMap = new Map();

    io.on("connection", (socket) => {
      console.log(`New Socket connected - `, socket.id);
      socket.on("event:messsage", async ({ remoteSocketId, ...data }: any) => {
        console.log("New msg rec - ", data);
        const { user, message, roomId } = data;
        await pub.publish(
          "MESSAGES",
          JSON.stringify({ message, user, roomId })
        );
      });
      socket.on("room:join", async ({ roomId, user }: any) => {
        emailToSocketIdMap.set(user.email, {
          user,
          roomId,
          socketId: socket.id,
        });
        socketIdToEmailMap.set(socket.id, {
          user,
          roomId,
          socketId: socket.id,
        });
        io.to(roomId).emit("user:joined", {
          user,
          roomId,
          socketId: socket.id,
        });
        socket.join(roomId);
        io.to(socket.id).emit("room:join", {
          user,
          roomId,
          socketId: socket.id,
        });
      });
    });

    sub.on("message", async (channel, data) => {
      if (channel === "MESSAGES") {
        const { message, user, roomId } = JSON.parse(data);
        // console.log("new message from redis - ", data);
        io.emit("message", data);
        await produceMessage(data);
        // console.log("Message produced to kafka broker");
        await prismaClient.message.create({
          data: {
            content: message,
            userId: user.id,
            roomId: roomId,
          },
        });
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
