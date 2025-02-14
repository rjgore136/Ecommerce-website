import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../helpers/redis.js";

let store;

try {
  store = new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  });
} catch (error) {
  console.log("Redis store failed using in-memory store", error);
  store = undefined;
}

// Rate limiter middleware
const rateLimiter = rateLimit({
  store,
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests, please try after 1 min.",
  headers: true, // Include rate limit headers
  handler: (req, res, next, options) => {
    console.warn(`Rate limit exceeded for ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
});

export default rateLimiter;
