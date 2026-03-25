"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/db";
import {
  products,
  productGalleryImages,
  productVariants,
  productVariantCombinations,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

// ─── Helper: get D1 db client from Cloudflare context ────────────────────────
function getDbClient() {
  try {
    const { env } = getCloudflareContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getDb(env as any);
  } catch {
    throw new Error(
      "DB_UNAVAILABLE: Cloudflare D1 is not available in `next dev` mode. " +
      "Run `npm run preview` to test with real Cloudflare bindings."
    );
  }
}

// ─── Helper: check if we have Cloudflare context ──────────────────────────────
function hasCloudflareContext(): boolean {
  try {
    getCloudflareContext();
    return true;
  } catch {
    return false;
  }
}

// ─── Helper: upload a File to R2 and return its public URL ────────────────────
async function uploadToR2(file: File, prefix: string): Promise<string> {
  const { env } = getCloudflareContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r2 = (env as any).R2_ASSETS;
  const key = `${prefix}/${nanoid()}-${file.name.replace(/\s+/g, "_")}`;
  const buffer = await file.arrayBuffer();
  await r2.put(key, buffer, {
    httpMetadata: { contentType: file.type },
  });
  // Return the direct Custom Domain CDN link for maximum performance:
  return `https://cdn.shreeumiyaenterprise.in/${key}`;
}

// ─── Helper: Delete specific files from R2 ─────────────────────────────────────
async function deleteFromR2(urls: string[]) {
  if (!hasCloudflareContext() || !urls || urls.length === 0) return;
  const { env } = getCloudflareContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r2 = (env as any).R2_ASSETS;

  for (const url of urls) {
    if (!url) continue;
    try {
      const r2Key = url.replace("https://cdn.shreeumiyaenterprise.in/", "").replace("/api/images/", "");
      await r2.delete(r2Key);
    } catch (e) { console.error("R2 Delete Error:", e); }
  }
}

// ─── Helper: Delete entire folder prefix from R2 ──────────────────────────────
async function deletePrefixFromR2(prefix: string) {
  if (!hasCloudflareContext()) return;
  const { env } = getCloudflareContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r2 = (env as any).R2_ASSETS;

  let cursor: string | undefined = undefined;
  try {
    do {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const listed: any = await r2.list({ prefix, cursor });
      if (listed.objects && listed.objects.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await Promise.all(listed.objects.map((o: any) => r2.delete(o.key)));
      }
      cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);
  } catch (e) { console.error("R2 Prefix Delete Error:", e); }
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type ProductFormData = {
  name: string;
  categoryId: string;
  moq: string;
  price: string;
  specifications: string;
  coverImageFile?: File | null;
  hoverImageFile?: File | null;
  galleryFiles?: File[];
  variants?: string; // JSON stringified Array<{ type: string; label: string }>
  variantCombinations?: string; // JSON stringified Array<{ key: string; imageFiles?: File[] }>
  comboImageKeys?: string; // JSON stringified Array<string> mapping to comboImageFiles
  comboImageFiles?: File[]; // Flat array of newly uploaded images for combinations
  existingGalleryUrls?: string[]; // optionally stringified, but string[] works if flat
  existingVariantCombinations?: string; // JSON stringified
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────────────────────
export async function createProduct(data: ProductFormData) {
  if (!hasCloudflareContext()) {
    console.warn("[DEV] Cloudflare context not available. Run `npm run preview` to test uploads.");
    return { success: false, error: "Run `npm run preview` to test with real Cloudflare bindings." };
  }
  const db = getDbClient();
  const productId = nanoid();

  let coverImage: string | undefined;
  let hoverImage: string | undefined;

  // Upload cover image
  if (data.coverImageFile && data.coverImageFile.size > 0) {
    coverImage = await uploadToR2(data.coverImageFile, `products/${productId}/cover`);
  }

  // Upload hover image
  if (data.hoverImageFile && data.hoverImageFile.size > 0) {
    hoverImage = await uploadToR2(data.hoverImageFile, `products/${productId}/hover`);
  }

  // Insert product row
  await db.insert(products).values({
    id: productId,
    name: data.name,
    categoryId: data.categoryId,
    moq: data.moq,
    price: parseFloat(data.price) || undefined,
    specifications: data.specifications,
    coverImage,
    hoverImage,
  });
  console.log("Inserted product row.");

  // Upload and insert gallery images
  if (data.galleryFiles && data.galleryFiles.length > 0) {
    const galleryVals = [];
    for (let i = 0; i < data.galleryFiles.length; i++) {
      const file = data.galleryFiles[i];
      if (file.size > 0) {
        const url = await uploadToR2(file, `products/${productId}/gallery`);
        galleryVals.push({ id: nanoid(), productId, url, displayOrder: i });
      }
    }
    if (galleryVals.length > 0) {
      await db.insert(productGalleryImages).values(galleryVals);
    }
  }

  // Parse JSON strings back to arrays
  const parsedVariants = data.variants ? JSON.parse(data.variants) : [];
  const parsedVariantCombinations = data.variantCombinations ? JSON.parse(data.variantCombinations) : [];

  console.log("Inserting flat variants", parsedVariants.length);
  // Insert flat variant rows (e.g. Color: Red, Color: Blue, Size: King)
  if (parsedVariants && parsedVariants.length > 0) {
    const variantVals = parsedVariants.map((v: any) => ({
      id: nanoid(),
      productId,
      type: v.type,
      label: v.label,
    }));
    await db.insert(productVariants).values(variantVals);
  }

  console.log("Inserting combination rows", parsedVariantCombinations.length);
  // Insert variant combination rows with their images
  if (parsedVariantCombinations && parsedVariantCombinations.length > 0) {
    const comboVals = parsedVariantCombinations.map((combo: any) => ({
      id: nanoid(),
      productId,
      key: combo.key,
      imageUrls: JSON.stringify([]),
    }));
    await db.insert(productVariantCombinations).values(comboVals);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/", "layout");

  return { success: true, productId };
}

// ─────────────────────────────────────────────────────────────────────────────
// READ ALL (one join query)
// ─────────────────────────────────────────────────────────────────────────────
export async function getProducts() {
  if (!hasCloudflareContext()) {
    console.warn("[DEV] Cloudflare context not available — returning empty product list. Run `npm run preview` for full functionality.");
    return [];
  }
  const db = getDbClient();

  const rows = await db
    .select()
    .from(products)
    .leftJoin(productGalleryImages, eq(products.id, productGalleryImages.productId))
    .leftJoin(productVariants, eq(products.id, productVariants.productId))
    .leftJoin(productVariantCombinations, eq(products.id, productVariantCombinations.productId));

  // Group flat join rows into structured product objects
  const map = new Map<string, any>();

  for (const row of rows) {
    const p = row.products;
    if (!map.has(p.id)) {
      map.set(p.id, {
        ...p,
        gallery: [],
        variants: [],
        combinations: [],
      });
    }

    const entry = map.get(p.id);

    if (row.product_gallery_images && !entry.gallery.find((g: any) => g.id === row.product_gallery_images!.id)) {
      entry.gallery.push(row.product_gallery_images);
    }

    if (row.product_variants && !entry.variants.find((v: any) => v.id === row.product_variants!.id)) {
      entry.variants.push(row.product_variants);
    }

    if (row.product_variant_combinations && !entry.combinations.find((c: any) => c.id === row.product_variant_combinations!.id)) {
      entry.combinations.push({
        ...row.product_variant_combinations,
        imageUrls: JSON.parse(row.product_variant_combinations.imageUrls ?? "[]"),
      });
    }
  }

  const results = Array.from(map.values());
  // Remap legacy /api/images/ to the new blazing fast CDN automatically
  return results.map(product => {
    const swapCdn = (url: string) => url ? url.replace("/api/images/", "https://cdn.shreeumiyaenterprise.in/") : url;
    product.image = swapCdn(product.image);
    product.hoverImage = swapCdn(product.hoverImage);
    product.gallery = product.gallery.map((g: any) => ({ ...g, url: swapCdn(g.url) }));
    product.combinations = product.combinations.map((c: any) => ({
      ...c,
      imageUrls: c.imageUrls.map((u: string) => swapCdn(u))
    }));
    return product;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// READ ONE
// ─────────────────────────────────────────────────────────────────────────────
export async function getProductById(id: string) {
  const db = getDbClient();

  const allProducts = await getProducts();
  return allProducts.find((p) => p.id === id) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────────────────────
export async function updateProduct(id: string, data: ProductFormData) {
  const db = getDbClient();
  const existingProduct = await getProductById(id);
  const urlsToDelete: string[] = [];

  let coverImage: string | undefined;
  let hoverImage: string | undefined;

  if (data.coverImageFile && data.coverImageFile.size > 0) {
    coverImage = await uploadToR2(data.coverImageFile, `products/${id}/cover`);
    if (existingProduct?.coverImage) urlsToDelete.push(existingProduct.coverImage);
  }

  if (data.hoverImageFile && data.hoverImageFile.size > 0) {
    hoverImage = await uploadToR2(data.hoverImageFile, `products/${id}/hover`);
    if (existingProduct?.hoverImage) urlsToDelete.push(existingProduct.hoverImage);
  }

  await db
    .update(products)
    .set({
      name: data.name,
      categoryId: data.categoryId,
      moq: data.moq,
      price: parseFloat(data.price) || undefined,
      specifications: data.specifications,
      ...(coverImage ? { coverImage } : {}),
      ...(hoverImage ? { hoverImage } : {}),
    })
    .where(eq(products.id, id));

  // For simplicity: delete and re-insert all variants/gallery on update
  await db.delete(productVariants).where(eq(productVariants.productId, id));
  await db.delete(productGalleryImages).where(eq(productGalleryImages.productId, id));
  await db.delete(productVariantCombinations).where(eq(productVariantCombinations.productId, id));

  // Parse JSON strings back to arrays
  const parsedVariants = data.variants ? JSON.parse(data.variants) : [];
  const parsedVariantCombinations = data.variantCombinations ? JSON.parse(data.variantCombinations) : [];
  const parsedExistingCombinations = data.existingVariantCombinations ? JSON.parse(data.existingVariantCombinations) : [];

  // Determine dropped gallery images
  const oldGalleryUrls = existingProduct?.gallery?.map((g: any) => g.url) || [];
  const keptGalleryUrls = data.existingGalleryUrls || [];
  const droppedGallery = oldGalleryUrls.filter((u: string) => !keptGalleryUrls.includes(u));
  urlsToDelete.push(...droppedGallery);

  // Determine dropped combination images
  const keptComboUrls = parsedExistingCombinations.flatMap((c: any) => c.imageUrls) || [];
  const oldComboUrls = existingProduct?.combinations?.flatMap((c: any) => c.imageUrls) || [];
  const droppedComboUrls = oldComboUrls.filter((u: string) => !keptComboUrls.includes(u));
  urlsToDelete.push(...droppedComboUrls);

  if (urlsToDelete.length > 0) {
    await deleteFromR2(urlsToDelete);
  }

  // Re-insert variants
  if (parsedVariants && parsedVariants.length > 0) {
    const variantVals = parsedVariants.map((v: any) => ({ id: nanoid(), productId: id, type: v.type, label: v.label }));
    await db.insert(productVariants).values(variantVals);
  }

  // Re-insert gallery
  let galleryIndex = 0;
  const existingGalleryVals = [];
  if (data.existingGalleryUrls && data.existingGalleryUrls.length > 0) {
    for (const url of data.existingGalleryUrls) {
      existingGalleryVals.push({ id: nanoid(), productId: id, url, displayOrder: galleryIndex++ });
    }
    await db.insert(productGalleryImages).values(existingGalleryVals);
  }

  if (data.galleryFiles && data.galleryFiles.length > 0) {
    const newGalleryVals = [];
    for (let i = 0; i < data.galleryFiles.length; i++) {
      const file = data.galleryFiles[i];
      if (file.size > 0) {
        const url = await uploadToR2(file, `products/${id}/gallery`);
        newGalleryVals.push({ id: nanoid(), productId: id, url, displayOrder: galleryIndex++ });
      }
    }
    if (newGalleryVals.length > 0) {
      await db.insert(productGalleryImages).values(newGalleryVals);
    }
  }

  // Combinations mapping
  const combinationsMap = new Map<string, string[]>();
  if (parsedExistingCombinations) {
    for (const combo of parsedExistingCombinations) {
      combinationsMap.set(combo.key, [...combo.imageUrls]);
    }
  }

  // Process new combination uploads
  const parsedComboKeys = data.comboImageKeys ? JSON.parse(data.comboImageKeys) : [];
  const comboUploadsMap = new Map<string, string[]>(); // combo key -> new image urls
  
  if (data.comboImageFiles && data.comboImageFiles.length > 0) {
    for (let i = 0; i < data.comboImageFiles.length; i++) {
      const file = data.comboImageFiles[i];
      const comboKey = parsedComboKeys[i];
      if (file.size > 0 && comboKey) {
        const url = await uploadToR2(file, `products/${id}/combinations`);
        if (!comboUploadsMap.has(comboKey)) comboUploadsMap.set(comboKey, []);
        comboUploadsMap.get(comboKey)!.push(url);
      }
    }
  }

  // Re-insert combinations
  if (parsedVariantCombinations && parsedVariantCombinations.length > 0) {
    const comboVals = parsedVariantCombinations.map((combo: any) => {
      const existingUrls: string[] = combinationsMap.get(combo.key) || [];
      const newUrls: string[] = comboUploadsMap.get(combo.key) || [];
      return {
        id: nanoid(),
        productId: id,
        key: combo.key,
        imageUrls: JSON.stringify([...existingUrls, ...newUrls]),
      };
    });
    await db.insert(productVariantCombinations).values(comboVals);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/products");
  revalidatePath("/", "layout");

  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE COMBO IMAGES INDEPENDENTLY (Row isolated update)
// ─────────────────────────────────────────────────────────────────────────────
export async function updateCombinationImages(
  productId: string,
  comboKey: string,
  finalUrls: string[]
) {
  if (!hasCloudflareContext()) { return { error: "No DB Access" }; }
  const db = getDbClient();

  if (!productId || !comboKey) return { error: "Missing required fields" };

  const combos = await db.select().from(productVariantCombinations)
    .where(and(eq(productVariantCombinations.productId, productId), eq(productVariantCombinations.key, comboKey)))
    .limit(1);

  if (!combos || combos.length === 0) return { error: "Combination not found" };
  const comboRowId = combos[0].id;

  const existingUrls: string[] = JSON.parse(combos[0].imageUrls || "[]");
  const removedUrls = existingUrls.filter(u => !finalUrls.includes(u));
  if (removedUrls.length > 0) {
    await deleteFromR2(removedUrls);
  }

  await db.update(productVariantCombinations)
    .set({ imageUrls: JSON.stringify(finalUrls) })
    .where(eq(productVariantCombinations.id, comboRowId));

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/products");
  revalidatePath("/", "layout");

  return { success: true, finalUrls };
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteProduct(id: string) {
  const db = getDbClient();

  // Wipe all bucket files tied to this product unconditionally
  await deletePrefixFromR2(`products/${id}/`);

  // onDelete: cascade in schema handles child rows automatically
  await db.delete(products).where(eq(products.id, id));

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/", "layout");

  return { success: true };
}
