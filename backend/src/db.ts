import { createClient } from "@libsql/client";
import { calculateFinalPrice } from "./pricing.js";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:./saree.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function initDb(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sarees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      imageUrl TEXT NOT NULL DEFAULT '',
      originalPrice REAL NOT NULL,
      exchangeRate REAL NOT NULL,
      additionalCharges REAL NOT NULL,
      marginPercentage REAL NOT NULL,
      finalPrice REAL NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Final price formula changed to (original + charges) / rate; recompute stored rows.
  const rows = await db.execute("SELECT id, originalPrice, exchangeRate, additionalCharges, marginPercentage, finalPrice FROM sarees");
  for (const r of rows.rows) {
    const price = calculateFinalPrice(
      Number(r.originalPrice),
      Number(r.exchangeRate),
      Number(r.additionalCharges),
      Number(r.marginPercentage)
    );
    if (price !== Number(r.finalPrice)) {
      await db.execute({ sql: "UPDATE sarees SET finalPrice = ? WHERE id = ?", args: [price, Number(r.id)] });
    }
  }
}
