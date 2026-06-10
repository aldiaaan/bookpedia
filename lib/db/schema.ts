import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"

export const wishlistTable = pgTable("wishlist", {
  id: uuid().primaryKey().defaultRandom(),
  book_id: varchar({ length: 255 }).notNull(),
  session_id: uuid().notNull(),
})
