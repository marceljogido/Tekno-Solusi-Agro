CREATE TABLE "media_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"internal_id" varchar(255),
	"electronic_id" varchar(255),
	"location_type" varchar(255),
	"planting_format" varchar(255),
	"number_of_beds" integer,
	"bed_length" numeric(10, 2),
	"bed_width" numeric(10, 2),
	"area" numeric(15, 4),
	"estimated_land_value" numeric(15, 2),
	"status" varchar(255),
	"light_profile" varchar(255),
	"grazing_rest_days" integer,
	"description" text,
	"geometry" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
DROP TABLE "media" CASCADE;--> statement-breakpoint
ALTER TABLE "media_locations" ADD CONSTRAINT "media_locations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_locations" ADD CONSTRAINT "media_locations_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;