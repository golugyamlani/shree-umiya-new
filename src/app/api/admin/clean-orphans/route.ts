import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getProducts } from "@/app/actions/products";

function hasCloudflareContext(): boolean {
  try {
    getCloudflareContext();
    return true;
  } catch {
    return false;
  }
}

export async function POST() {
  if (!hasCloudflareContext()) {
    return NextResponse.json({ error: "No DB Access. Run preview/deploy." }, { status: 500 });
  }

  try {
    const { env } = getCloudflareContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r2 = (env as any).R2_ASSETS;

    // 1. Fetch all products to gather ACTIVE image URLs
    const products = await getProducts();
    const activeKeys = new Set<string>();

    for (const p of products) {
      if (p.coverImage) activeKeys.add(p.coverImage.replace("/api/images/", ""));
      if (p.hoverImage) activeKeys.add(p.hoverImage.replace("/api/images/", ""));
      p.gallery.forEach((g: any) => {
        if (g.url) activeKeys.add(g.url.replace("/api/images/", ""));
      });
      p.combinations.forEach((c: any) => {
        const urls: string[] = typeof c.imageUrls === "string" ? JSON.parse(c.imageUrls) : c.imageUrls || [];
        urls.forEach(u => {
          if (u) activeKeys.add(u.replace("/api/images/", ""));
        });
      });
    }

    // 2. Fetch all objects in R2
    let cursor: string | undefined = undefined;
    const allR2Keys: string[] = [];

    do {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const listed: any = await r2.list({ cursor });
      if (listed.objects && listed.objects.length > 0) {
        listed.objects.forEach((o: any) => allR2Keys.push(o.key));
      }
      cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);

    // 3. Identify and delete orphaned keys
    const keysToDelete = allR2Keys.filter(key => 
      // Only clean up product images (ignore default or static assets if they exist)
      key.startsWith("products/") && !activeKeys.has(key)
    );

    if (keysToDelete.length > 0) {
      // Delete in batches to prevent API timeout
      const BATCH_SIZE = 50;
      for (let i = 0; i < keysToDelete.length; i += BATCH_SIZE) {
        const batch = keysToDelete.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(key => r2.delete(key)));
      }
    }

    return NextResponse.json({ 
      success: true, 
      scannedProductsCount: products.length,
      activeKeysCount: activeKeys.size,
      totalR2ObjectsScanned: allR2Keys.length,
      deletedOrphansCount: keysToDelete.length,
      deletedKeys: keysToDelete
    });

  } catch (error: any) {
    console.error("Cleanup API error:", error);
    return NextResponse.json({ error: error.message || "Failed to cleanup" }, { status: 500 });
  }
}
