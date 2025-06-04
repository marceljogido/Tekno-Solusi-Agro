CREATE TABLE "plantings" (
	"id" serial PRIMARY KEY NOT NULL,
	"crop_id" integer,
	"location_id" integer,
	"planting_quantity" numeric(10, 2),
	"planting_method" varchar(255),
	"planting_date" timestamp,
	"seeding_date" timestamp,
	"plant_spacing" numeric(10, 2),
	"row_spacing" numeric(10, 2),
	"row_length" numeric(10, 2),
	"number_of_rows" integer,
	"electronic_id" varchar(255),
	"currently_planted" boolean DEFAULT false,
	"harvest_plan" text,
	"estimated_yield" numeric(15, 2),
	"estimated_profit" numeric(15, 2),
	"planting_info" text,
	"status" varchar(50) DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
ALTER TABLE "media_locations" ADD COLUMN "image_url" varchar(255);--> statement-breakpoint
ALTER TABLE "media_locations" ADD COLUMN "panjang_lahan" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "media_locations" ADD COLUMN "lebar_lahan" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "media_locations" ADD COLUMN "lebar_legowo" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "media_locations" ADD COLUMN "jarak_antar_tanaman" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "media_locations" ADD COLUMN "jarak_antar_baris" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "media_locations" ADD COLUMN "jumlah_baris_per_legowo" integer;--> statement-breakpoint
ALTER TABLE "media_locations" ADD COLUMN "luas_total_bedengan" numeric(15, 4);--> statement-breakpoint
ALTER TABLE "media_locations" ADD COLUMN "luas_total_jajar_legowo" numeric(15, 4);--> statement-breakpoint
ALTER TABLE "media_locations" ADD COLUMN "price_per_m2" numeric(15, 2);--> statement-breakpoint
ALTER TABLE "plantings" ADD CONSTRAINT "plantings_crop_id_crops_id_fk" FOREIGN KEY ("crop_id") REFERENCES "public"."crops"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantings" ADD CONSTRAINT "plantings_location_id_media_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."media_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantings" ADD CONSTRAINT "plantings_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantings" ADD CONSTRAINT "plantings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;