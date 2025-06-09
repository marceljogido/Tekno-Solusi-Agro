CREATE TABLE "crops" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"variety" varchar(255),
	"start_method" varchar(255),
	"germination_rate" numeric(5, 2),
	"seed_per_cell" integer,
	"light_profile" varchar(255),
	"soil_condition" varchar(255),
	"days_to_emerge" integer,
	"plant_spacing" numeric(10, 2),
	"row_spacing" numeric(10, 2),
	"planting_depth" numeric(10, 2),
	"average_height" numeric(10, 2),
	"days_to_flower" integer,
	"days_to_maturity" integer,
	"harvest_window" integer,
	"loss_rate" numeric(5, 2),
	"harvest_unit" varchar(50),
	"estimated_revenue" numeric(15, 2),
	"expected_yield_per_3048m" numeric(15, 2),
	"expected_yield_per_hectare" numeric(15, 2),
	"planting_details" text,
	"pruning_details" text,
	"is_perennial" boolean DEFAULT false,
	"auto_create_tasks" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(150) NOT NULL,
	"password" text NOT NULL,
	"address" varchar(255),
	"phone" varchar(30),
	"profile_image" varchar(255),
	"background_image" varchar(255),
	"role" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "crops" ADD CONSTRAINT "crops_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crops" ADD CONSTRAINT "crops_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;