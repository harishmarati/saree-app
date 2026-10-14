import "dotenv/config";
import express from "express";
import cors from "cors";
import { sareesRouter } from "./routes/sarees.js";
import { initDb } from "./db.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim());

app.use(cors({ origin: allowedOrigins ?? "*" }));
app.use(express.json());

app.use("/api/sarees", sareesRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

await initDb();

app.listen(PORT, () => {
  console.log(`Saree backend listening on http://localhost:${PORT}`);
});
