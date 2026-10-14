import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sareesRouter } from "./routes/sarees.js";
import { authRouter } from "./routes/auth.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { initDb } from "./db.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim());

app.set("trust proxy", 1);
app.use(cors({ origin: allowedOrigins ?? "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/sarees", requireAuth, sareesRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

await initDb();

app.listen(PORT, () => {
  console.log(`Saree backend listening on http://localhost:${PORT}`);
});
