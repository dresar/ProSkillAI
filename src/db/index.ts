import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let cachedDb: DrizzleDb | null = null;
let lastConnectionString = "";

export function getDb(): DrizzleDb {
  const connectionString =
    process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  if (!cachedDb || lastConnectionString !== connectionString) {
    lastConnectionString = connectionString;
    const sql = neon(connectionString);
    cachedDb = drizzle(sql, { schema });
  }
  return cachedDb;
}

export const db: DrizzleDb = new Proxy({} as DrizzleDb, {
  get(target, prop, receiver) {
    const realDb = getDb();
    const val = Reflect.get(realDb, prop, receiver);
    return typeof val === "function" ? val.bind(realDb) : val;
  },
});
