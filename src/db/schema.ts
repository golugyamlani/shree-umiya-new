import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: text("category_id").notNull(), // e.g., 'hotel-linen', 'bath-essentials'
  price: real("price"), // Optional
  moq: text("moq"), // Minimum order quantity
  specifications: text("specifications"), // Stored as stringified JSON or plain text
  coverImage: text("cover_image"), // R2 URL
  hoverImage: text("hover_image"), // R2 URL
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

export const productGalleryImages = sqliteTable("product_gallery_images", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(), // R2 URL
  displayOrder: integer("display_order").default(0),
});

// e.g. "Color" or "Size"
export const productVariants = sqliteTable("product_variants", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'Color', 'Capacity', etc.
  label: text("label").notNull(), // 'Red', '100ml', 'King'
  image: text("image"), // Optional isolated image for this specific variant tag
});

// The Cartisian matrix intersection, e.g. "Color: Red + Size: Large"
export const productVariantCombinations = sqliteTable("product_variant_combinations", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  key: text("key").notNull(), // e.g., "color:red|size:large"
  imageUrls: text("image_urls"), // Stringified JSON array of R2 URLs specific to this combination
});
