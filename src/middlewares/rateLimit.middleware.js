import rateLimit, {ipKeyGenerator} from "express-rate-limit";

//  General API limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // max 100 requests
    message: {
        message: "Too many requests, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});


// STRICT limiter for AI routes
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
keyGenerator: (req) => {
    return ipKeyGenerator(req);
  },  message: {
    message: "AI request limit reached. Try again later.",
  },
});

// Separate limiter for auth routes to prevent brute-force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
keyGenerator: (req) => {
    return ipKeyGenerator(req);
  },
  message: {
    message: "Too many login attempts. Try later.",
  },
});