import { auth } from "@quarter/auth";
import { env } from "@quarter/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import userRoutes from "./api/routes/users.routes";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    message: "OK! API is running",
  });
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
