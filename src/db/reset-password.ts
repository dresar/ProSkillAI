import * as dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { hashPassword } from "../lib/auth";
import * as schema from "./schema";

dotenv.config();

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error("Usage: pnpm tsx src/db/reset-password.ts <email> <new_password>");
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "";
if (!connectionString) {
  throw new Error("Missing DATABASE_URL");
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function reset() {
  const existing = await db.select().from(schema.users).where(eq(schema.users.email, email));
  if (existing.length === 0) {
    console.error(`User with email ${email} not found.`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(newPassword);
  await db
    .update(schema.users)
    .set({
      passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(schema.users.email, email));

  console.log(`Password for ${email} successfully updated.`);
}

reset().catch((err) => {
  console.error("Reset password error:", err);
  process.exit(1);
});
