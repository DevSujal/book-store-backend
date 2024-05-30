import express from "express";

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

export { app };
