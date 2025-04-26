CREATE TABLE "translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_id" integer NOT NULL,
	"key" text NOT NULL,
	"translations" jsonb NOT NULL
);
