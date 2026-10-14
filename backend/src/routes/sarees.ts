import { Router, type Request, type Response } from "express";
import type { Row } from "@libsql/client";
import { db } from "../db.js";
import { calculateFinalPrice } from "../pricing.js";
import type { Saree, SareeInput } from "../types.js";

export const sareesRouter = Router();

function mapRow(row: Row): Saree {
  return {
    id: Number(row.id),
    name: String(row.name),
    description: String(row.description),
    imageUrl: String(row.imageUrl),
    originalPrice: Number(row.originalPrice),
    exchangeRate: Number(row.exchangeRate),
    additionalCharges: Number(row.additionalCharges),
    marginPercentage: Number(row.marginPercentage),
    finalPrice: Number(row.finalPrice),
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt),
  };
}

function parseSareeInput(body: unknown): SareeInput | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const description = typeof b.description === "string" ? b.description.trim() : "";
  const imageUrl = typeof b.imageUrl === "string" ? b.imageUrl.trim() : "";
  const originalPrice = Number(b.originalPrice);
  const exchangeRate = Number(b.exchangeRate);
  const additionalCharges = Number(b.additionalCharges);
  const marginPercentage = Number(b.marginPercentage);

  if (!name) return null;
  if (
    !Number.isFinite(originalPrice) ||
    !Number.isFinite(exchangeRate) ||
    !Number.isFinite(additionalCharges) ||
    !Number.isFinite(marginPercentage)
  ) {
    return null;
  }

  return { name, description, imageUrl, originalPrice, exchangeRate, additionalCharges, marginPercentage };
}

sareesRouter.get("/", async (_req: Request, res: Response) => {
  const rs = await db.execute("SELECT * FROM sarees ORDER BY id DESC");
  res.json(rs.rows.map(mapRow));
});

sareesRouter.get("/:id", async (req: Request, res: Response) => {
  const rs = await db.execute({ sql: "SELECT * FROM sarees WHERE id = ?", args: [req.params.id] });
  const row = rs.rows[0];
  if (!row) {
    res.status(404).json({ error: "Saree not found" });
    return;
  }
  res.json(mapRow(row));
});

sareesRouter.post("/", async (req: Request, res: Response) => {
  const input = parseSareeInput(req.body);
  if (!input) {
    res.status(400).json({ error: "Invalid saree data" });
    return;
  }

  const finalPrice = calculateFinalPrice(
    input.originalPrice,
    input.exchangeRate,
    input.additionalCharges,
    input.marginPercentage
  );
  const now = new Date().toISOString();

  const rs = await db.execute({
    sql: `INSERT INTO sarees
        (name, description, imageUrl, originalPrice, exchangeRate, additionalCharges, marginPercentage, finalPrice, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`,
    args: [
      input.name,
      input.description,
      input.imageUrl,
      input.originalPrice,
      input.exchangeRate,
      input.additionalCharges,
      input.marginPercentage,
      finalPrice,
      now,
      now,
    ],
  });

  res.status(201).json(mapRow(rs.rows[0]));
});

sareesRouter.put("/:id", async (req: Request, res: Response) => {
  const existingRs = await db.execute({ sql: "SELECT id FROM sarees WHERE id = ?", args: [req.params.id] });
  if (!existingRs.rows[0]) {
    res.status(404).json({ error: "Saree not found" });
    return;
  }

  const input = parseSareeInput(req.body);
  if (!input) {
    res.status(400).json({ error: "Invalid saree data" });
    return;
  }

  const finalPrice = calculateFinalPrice(
    input.originalPrice,
    input.exchangeRate,
    input.additionalCharges,
    input.marginPercentage
  );
  const now = new Date().toISOString();

  const rs = await db.execute({
    sql: `UPDATE sarees SET
      name = ?,
      description = ?,
      imageUrl = ?,
      originalPrice = ?,
      exchangeRate = ?,
      additionalCharges = ?,
      marginPercentage = ?,
      finalPrice = ?,
      updatedAt = ?
     WHERE id = ?
     RETURNING *`,
    args: [
      input.name,
      input.description,
      input.imageUrl,
      input.originalPrice,
      input.exchangeRate,
      input.additionalCharges,
      input.marginPercentage,
      finalPrice,
      now,
      req.params.id,
    ],
  });

  res.json(mapRow(rs.rows[0]));
});

sareesRouter.delete("/:id", async (req: Request, res: Response) => {
  const rs = await db.execute({ sql: "DELETE FROM sarees WHERE id = ?", args: [req.params.id] });
  if (rs.rowsAffected === 0) {
    res.status(404).json({ error: "Saree not found" });
    return;
  }
  res.status(204).send();
});
