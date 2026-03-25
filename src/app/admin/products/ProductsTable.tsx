"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/products";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  categoryId: string;
  coverImage: string | null;
  moq: string | null;
  price: number | null;
};

export default function ProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const filtered = initialProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteProduct(id);
      setDeletingId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading font-bold text-secondary">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-sm font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products or category..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Product</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs hidden md:table-cell">Category</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs hidden lg:table-cell">MOQ</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400 font-medium">
                  {searchQuery ? "No products match your search." : "No products yet. Click \"Add New Product\" to create one."}
                </td>
              </tr>
            )}
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm bg-gray-100 overflow-hidden flex-shrink-0">
                      {product.coverImage ? (
                        <img
                          src={product.coverImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-secondary">{product.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{product.categoryId}</td>
                <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">{product.moq ?? "—"}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-2 text-gray-400 hover:text-secondary hover:bg-gray-100 rounded-sm transition-colors"
                      title="Edit product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingId === product.id || isPending}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-40"
                      title="Delete product"
                    >
                      {deletingId === product.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          Showing {filtered.length} of {initialProducts.length} products
        </div>
      </div>
    </div>
  );
}
