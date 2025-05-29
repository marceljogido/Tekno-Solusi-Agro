import { pgTable, serial, text, varchar, integer, jsonb, timestamp, bigint } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

//Tabel media utama
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  internalId: text("internal_id"),
  type: text("type").notNull(), // bedengan, baris, legowo
  jumlahBedengan: integer("jumlah_bedengan"),
  panjangBedengan: integer("panjang_bedengan"),
  lebarBedengan: integer("lebar_bedengan"),
  jarakKelompokLegowo: integer("jarak_kelompok_legowo"),
  jarakDalamLegowo: integer("jarak_dalam_legowo"),
  jarakBarisLegowo: integer("jarak_baris_legowo"),
  panjangLahan: integer("panjang_lahan"),
  lebarLahan: integer("lebar_lahan"),
  luasLahan: integer("luas_lahan"),
  nilaiTanah: bigint("nilai_tanah", { mode: "number" }),
  paparan: text("paparan"),
  deskripsi: text("deskripsi"),
  createdAt: timestamp("created_at").defaultNow(),
});

//Tabel media_polygon 
export const mediaPolygon = pgTable("media_polygon", {
  id: serial("id").primaryKey(),
  mediaId: integer("media_id")
    .references(() => media.id, { onDelete: "cascade" })
    .notNull(),
  area: integer("area"),
  center: jsonb("center").notNull(), // { lat, lng }
  path: jsonb("path").notNull(),     // [{ lat, lng }, ...]
});

export const mediaRelations = relations(media, ({ many }) => ({
  polygons: many(mediaPolygon),
}));

export const mediaPolygonRelations = relations(mediaPolygon, ({ one }) => ({
  media: one(media, {
    fields: [mediaPolygon.mediaId],
    references: [media.id],
  }),
}));



