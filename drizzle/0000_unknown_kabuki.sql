CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"internal_id" text,
	"type" text NOT NULL,
	"jumlah_bedengan" integer,
	"panjang_bedengan" integer,
	"lebar_bedengan" integer,
	"jarak_kelompok_legowo" integer,
	"jarak_dalam_legowo" integer,
	"jarak_baris_legowo" integer,
	"panjang_lahan" integer,
	"lebar_lahan" integer,
	"luas_lahan" integer,
	"nilai_tanah" integer,
	"paparan" text,
	"deskripsi" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "media_polygon" (
	"id" serial PRIMARY KEY NOT NULL,
	"media_id" integer NOT NULL,
	"area" integer,
	"center" jsonb NOT NULL,
	"path" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(150) NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "media_polygon" ADD CONSTRAINT "media_polygon_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;