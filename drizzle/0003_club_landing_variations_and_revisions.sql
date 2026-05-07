CREATE TABLE "club_landing_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variation_id" uuid NOT NULL,
	"landing_content" jsonb NOT NULL,
	"note" text,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "club_landing_variations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" uuid NOT NULL,
	"key" text NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "published_landing_variation_id" uuid;--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "published_landing_revision_id" uuid;--> statement-breakpoint
ALTER TABLE "club_landing_revisions" ADD CONSTRAINT "club_landing_revisions_variation_id_club_landing_variations_id_fk" FOREIGN KEY ("variation_id") REFERENCES "public"."club_landing_variations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_landing_revisions" ADD CONSTRAINT "club_landing_revisions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_landing_variations" ADD CONSTRAINT "club_landing_variations_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "club_landing_variations_club_key_unique_idx" ON "club_landing_variations" USING btree ("club_id","key");--> statement-breakpoint
CREATE INDEX "club_landing_revisions_variation_created_idx" ON "club_landing_revisions" USING btree ("variation_id","created_at");--> statement-breakpoint

INSERT INTO "club_landing_variations" ("club_id", "key", "display_name")
SELECT c."id", 'default', 'Default'
FROM "clubs" c
WHERE NOT EXISTS (
  SELECT 1 FROM "club_landing_variations" x WHERE x."club_id" = c."id" AND x."key" = 'default'
);--> statement-breakpoint

INSERT INTO "club_landing_revisions" ("variation_id", "landing_content", "note")
SELECT v."id", c."landing_content", 'Migrated from legacy clubs.landing_content'
FROM "clubs" c
INNER JOIN "club_landing_variations" v ON v."club_id" = c."id" AND v."key" = 'default'
WHERE c."landing_content" IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM "club_landing_revisions" r WHERE r."variation_id" = v."id"
);--> statement-breakpoint

UPDATE "clubs" c
SET
  "published_landing_variation_id" = v."id",
  "published_landing_revision_id" = r."id",
  "updated_at" = now()
FROM "club_landing_variations" v
INNER JOIN "club_landing_revisions" r ON r."variation_id" = v."id"
WHERE v."club_id" = c."id"
AND v."key" = 'default'
AND c."landing_content" IS NOT NULL
AND c."published_landing_revision_id" IS NULL
AND r."note" = 'Migrated from legacy clubs.landing_content';--> statement-breakpoint

ALTER TABLE "clubs" ADD CONSTRAINT "clubs_published_landing_variation_id_club_landing_variations_id_fk" FOREIGN KEY ("published_landing_variation_id") REFERENCES "public"."club_landing_variations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_published_landing_revision_id_club_landing_revisions_id_fk" FOREIGN KEY ("published_landing_revision_id") REFERENCES "public"."club_landing_revisions"("id") ON DELETE set null ON UPDATE no action;