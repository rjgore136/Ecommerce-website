import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../helpers/redis.js";

// Configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000,
  maxRequests: 5,
  message: "Too many requests, please try again later.",
  whitelist: ["127.0.0.1"],
  enableRedis: true,
};

let store;
if (RATE_LIMIT_CONFIG.enableRedis) {
  try {
    store = new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    });
  } catch (error) {
    console.error("Redis store failed, using in-memory store", error);
    store = undefined;
  }
}

const getKey = (req) => {
  return req.user?.id || req.ip;
};

const rateLimiter = rateLimit({
  store: RATE_LIMIT_CONFIG.enableRedis ? store : undefined,
  windowMs: RATE_LIMIT_CONFIG.windowMs,
  max: RATE_LIMIT_CONFIG.maxRequests,
  keyGenerator: getKey,
  message: RATE_LIMIT_CONFIG.message,
  headers: true,
  skip: (req) => req.method === "OPTIONS", // Allow preflight requests
  handler: (req, res, next, options) => {
    if (RATE_LIMIT_CONFIG.whitelist.includes(req.ip)) {
      return next();
    }

    console.warn(`Rate limit exceeded for ${req.ip}`);

    // Set CORS headers manually for blocked responses
    res.set({
      "Access-Control-Allow-Origin":
        process.env.CLIENT_BASE_URL || "http://localhost:5173",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Retry-After": Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000),
    });
    console.log(options);

    res
      .status(options.statusCode)
      .json({ success: false, message: options.message });
  },
});

export default rateLimiter;
