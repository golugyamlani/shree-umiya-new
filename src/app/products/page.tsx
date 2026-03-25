import { getProducts } from "@/app/actions/products";
import ProductsClient, { type PublicProduct } from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const dbProducts = await getProducts();

  // Map the DB shape → the UI shape that ProductsClient expects
  const products: PublicProduct[] = dbProducts.map((p: any) => {
    // Group flat variant rows into { colors, dimensions, capacity }
    const variantGroups: { colors?: { label: string }[]; dimensions?: { label: string }[]; capacity?: { label: string }[] } = {};
    for (const v of p.variants ?? []) {
      let key = v.type;
      if (key === "color") key = "colors";
      if (key === "dimension") key = "dimensions";
      
      const typedKey = key as "colors" | "dimensions" | "capacity";
      if (!variantGroups[typedKey]) variantGroups[typedKey] = [];
      variantGroups[typedKey]!.push({ label: v.label });
    }

    // Build combinations map { "color:Red|dimension:King": ["url1"] }
    const combinations: { [key: string]: string[] } = {};
    for (const combo of p.combinations ?? []) {
      // Convert stored key "color:Red|dimension:King" → display key "Red - King"
      const displayKey = combo.key
        .split("|")
        .map((part: string) => part.split(":")[1])
        .join(" - ");
      combinations[displayKey] = combo.imageUrls ?? [];
    }

    let spec = p.specifications ?? "";
    let features: string[] = [];

    if (p.specifications?.startsWith("{")) {
      try {
        const parsed = JSON.parse(p.specifications);
        spec = parsed.description || "";
        features = parsed.features || [];
      } catch {
        spec = p.specifications;
      }
    }

    return {
      id: p.id,
      name: p.name,
      category: p.categoryId,
      moq: p.moq ?? "On Request",
      spec,
      features,
      price: p.price ? `₹${p.price} per unit` : "Bulk pricing available on request",
      image: p.coverImage ?? "",
      hoverImage: p.hoverImage ?? undefined,
      gallery: (p.gallery ?? []).map((g: any) => g.url),
      variants:
        Object.keys(variantGroups).length > 0 || Object.keys(combinations).length > 0
          ? { ...variantGroups, combinations }
          : undefined,
    };
  });

  return <ProductsClient products={products} />;
}
