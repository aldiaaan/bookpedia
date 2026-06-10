CREATE TABLE "wishlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" varchar(255) NOT NULL,
	"session_id" uuid NOT NULL
);
