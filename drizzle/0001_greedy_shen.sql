CREATE TYPE "public"."cancellation_request_status" AS ENUM('requested', 'approved', 'rejected', 'completed');--> statement-breakpoint
CREATE TYPE "public"."club_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('active', 'incomplete', 'past_due', 'canceled', 'unpaid');--> statement-breakpoint
CREATE TYPE "public"."plan_interval" AS ENUM('month', 'year');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('member', 'admin');--> statement-breakpoint
CREATE TABLE "club_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"status" "membership_status" DEFAULT 'incomplete' NOT NULL,
	"current_period_end" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "club_subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" uuid NOT NULL,
	"name" text NOT NULL,
	"interval" "plan_interval" NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"stripe_price_id" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clubs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"status" "club_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "membership_cancellation_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"membership_id" uuid NOT NULL,
	"requested_by_user_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"status" "cancellation_request_status" DEFAULT 'requested' NOT NULL,
	"resolved_by_admin_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "club_memberships" ADD CONSTRAINT "club_memberships_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_memberships" ADD CONSTRAINT "club_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_memberships" ADD CONSTRAINT "club_memberships_plan_id_club_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."club_subscription_plans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_subscription_plans" ADD CONSTRAINT "club_subscription_plans_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_cancellation_requests" ADD CONSTRAINT "membership_cancellation_requests_membership_id_club_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."club_memberships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_cancellation_requests" ADD CONSTRAINT "membership_cancellation_requests_requested_by_user_id_users_id_fk" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_cancellation_requests" ADD CONSTRAINT "membership_cancellation_requests_resolved_by_admin_user_id_users_id_fk" FOREIGN KEY ("resolved_by_admin_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "club_memberships_stripe_sub_unique_idx" ON "club_memberships" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE UNIQUE INDEX "club_memberships_club_user_unique_idx" ON "club_memberships" USING btree ("club_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "club_plans_stripe_price_unique_idx" ON "club_subscription_plans" USING btree ("stripe_price_id");--> statement-breakpoint
CREATE UNIQUE INDEX "clubs_slug_unique_idx" ON "clubs" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "cancel_requests_pending_membership_unique_idx" ON "membership_cancellation_requests" USING btree ("membership_id","status");