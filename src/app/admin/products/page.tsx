import { getProducts } from "@/app/actions/products";
import ProductsTable from "./ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const isDevMode = products.length === 0;

  return (
    <>
      {isDevMode && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-sm text-sm font-medium flex items-start gap-2">
          <span className="mt-0.5">⚠️</span>
          <span>
            <strong>Dev Mode:</strong> Cloudflare D1 is not available via <code>next dev</code>.
            Run <code className="bg-amber-100 px-1 rounded">npm run preview</code> to connect to the real database and R2.
          </span>
        </div>
      )}
      <ProductsTable initialProducts={products} />
    </>
  );
}
