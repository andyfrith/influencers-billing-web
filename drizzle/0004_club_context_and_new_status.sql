ALTER TYPE "public"."club_status" ADD VALUE IF NOT EXISTS 'new';--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "context_markdown" text DEFAULT '' NOT NULL;--> statement-breakpoint
