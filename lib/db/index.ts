import { drizzle as drizzleNodePostgres } from "drizzle-orm/node-postgres"
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless"
import { Pool as NodePostgresPool } from "pg"
import { Pool as NeonPool } from "@neondatabase/serverless"

import { singleton } from "@/lib/utils"
import * as schema from "./schema"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing!")
}

const databaseUrl = process.env.DATABASE_URL
const isNeon = databaseUrl.includes("neon.tech")

export const db = singleton("db", () => {
  if (isNeon) {
    const pool = new NeonPool({ connectionString: databaseUrl })
    return drizzleNeon(pool, { schema })
  }

  const pool = new NodePostgresPool({ connectionString: databaseUrl })
  return drizzleNodePostgres(pool, { schema })
})
