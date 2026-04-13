import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import globalErrorHandler from "./middlewares/error.middleware.js";
import { multerErrorHandler } from "./middlewares/file.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

//  Routes
import authRouter from "./routes/auth.routes.js";
import reportRoute from "./routes/report.routes.js";

//  App init
const app = express();

//middlewares
app.use(express.json({ limit: "5mb" })); // prevent large payload abuse
app.use(cookieParser());
//  CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(helmet());

app.use(morgan("dev"));

//  Apply general API rate limiter
app.use("/api", apiLimiter);


app.use("/api/auth", authRouter);
app.use("/api/report", reportRoute);


app.use(multerErrorHandler);

//  404 Handler
app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found",
  });
});

//  Global Error Handler
app.use(globalErrorHandler);

export default app;
