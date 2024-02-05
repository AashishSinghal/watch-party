import { Kafka, KafkaConfig, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import prismaClient from "./prisma";
import dotenv from "dotenv";

dotenv.config();

const kafkaCreds: KafkaConfig = {
  brokers: [process.env.KAFKA_HOST_WITH_PORT!],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },
  sasl: {
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PASSWORD!,
    mechanism: "plain",
  },
};

const kafka = new Kafka(kafkaCreds);

let producer: null | Producer = null;

export async function createProducer() {
  if (producer) return producer;
  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(data: string) {
  const producer = await createProducer();
  await producer.send({
    messages: [
      {
        key: `message-${Date.now()}`,
        value: data,
      },
    ],
    topic: "MESSAGES",
  });
  return true;
}

export async function startMessageConsumer() {
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      const {
        message: textMessage,
        user,
        roomId,
      } = JSON.parse(message.value.toString("utf-8"));
      try {
        await prismaClient.message.create({
          data: {
            content: textMessage,
            userId: user.id,
            roomId,
          },
        });
      } catch (error) {
        console.log("Something is wrong...");
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
}

export default kafka;
