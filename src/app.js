import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();

const limit = "16kb";
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit }));
app.use(
  express.urlencoded({
    extended: true,
    limit,
  })
);

app.use(express.static("public"));
app.use(cookieParser());

// importing the rotes

import userRouter from "./routes/user.router.js"

app.use("/api/v1/users", userRouter)

export { app };
