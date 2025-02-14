import { Redis } from "ioredis";

const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

redisClient.on("connect", () => {
  console.log("Connected to redis...");
});

redisClient.on("error", (err) => {
  console.log("Redis error", err);
});

export default redisClient;
