CREATE TABLE "feedbacks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"user_email" text,
	"user_name" text,
	"category" text DEFAULT 'general' NOT NULL,
	"message" text NOT NULL,
	"url" text,
	"status" text DEFAULT 'unread' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "images" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "skills" ADD COLUMN "images" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feedbacks_status_idx" ON "feedbacks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "feedbacks_created_at_idx" ON "feedbacks" USING btree ("created_at");