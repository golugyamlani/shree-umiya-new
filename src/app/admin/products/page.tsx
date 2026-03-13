"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Filter } from "lucide-react";

// Using the same mock data structure as the live site for now
type ProductVariant = {
    colors?: string[];
    capacity?: string[];
    dimensions?: string[];
};

type Product = {
    id: number;
    name: string;
    category: string;
    moq: string;
    price: string;
    image: string;
    variants?: ProductVariant;
};

const MOCK_PRODUCTS: Product[] = [
    { id: 1, name: "Premium White Duvet Cover", category: "Platform Beds", moq: "50 Pieces", price: "Bulk pricing", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop", variants: { colors: ["White", "Charcoal", "Navy"], dimensions: ["Twin", "Queen", "King"] } },
    { id: 2, name: "Luxury Bath Towel Set", category: "Bath", moq: "100 Sets", price: "Bulk pricing", image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop", variants: { colors: ["White", "Beige"] } },
    { id: 3, name: "Eco-Friendly Toiletries Kit", category: "Amenities", moq: "500 Kits", price: "Bulk pricing", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Heavy Duty Cleaning Cart", category: "Paper & Bio Products", moq: "5 Units", price: "Bulk pricing", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop", variants: { capacity: ["Standard (3-Shelf)", "Large (4-Shelf, Dual Bag)"] } },
];

export default function AdminProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = MOCK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                {/* Table Header Controls */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products by name or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-sm text-sm font-semibold hover:bg-gray-50">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-xs border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Variants</th>
                                <th className="px-6 py-4">MOQ</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <div className="flex items-center gap-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={product.image} alt="" className="w-12 h-12 rounded-sm object-cover border border-gray-200" />
                                            <div>
                                                <div className="font-bold text-secondary mb-1">{product.name}</div>
                                                <div className="text-xs text-gray-400">ID: #{product.id.toString().padStart(5, '0')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.variants ? (
                                            <div className="flex flex-wrap gap-1">
                                                {Object.keys(product.variants).map(k => (
                                                    <span key={k} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase">
                                                        {k}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">None</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{product.moq}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-sm transition-colors" title="Edit Product">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors" title="Delete Product">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No products found matching "{searchQuery}"
                        </div>
                    )}
                </div>
                
                {/* Pagination Placeholder */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <div>Showing 1 to {filteredProducts.length} of {MOCK_PRODUCTS.length} entries</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-sm hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 bg-primary text-white rounded-sm">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-sm hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
