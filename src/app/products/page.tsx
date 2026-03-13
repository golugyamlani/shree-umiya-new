"use client";

import { useState } from "react";
import { Search, Filter, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

const CATEGORIES = [
    "All",
    "Amenities",
    "Bath",
    "Furniture",
    "Paper & Bio Products",
    "Platform Beds"
];

const PRODUCTS = [
    { id: 1, name: "Premium White Duvet Cover", category: "Platform Beds", moq: "50 Pieces", spec: "300 TC Cotton, Commercial Grade. Designed for high-cycle industrial laundering. Features a hidden zipper closure and internal corner ties to secure the duvet insert.", price: "Bulk pricing available on request", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Luxury Bath Towel Set", category: "Bath", moq: "100 Sets", spec: "600 GSM, 100% Ring Spun Cotton. Double-stitched hems for enhanced durability. Extremely plush and absorbent, perfect for 4-star and 5-star properties.", price: "Bulk pricing available on request", image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Eco-Friendly Toiletries Kit", category: "Amenities", moq: "500 Kits", spec: "Includes bamboo toothbrush, sulphate-free soaps, and biodegradable packaging. Sourced sustainably to help your property meet green certification standards.", price: "Bulk pricing available on request", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Heavy Duty Cleaning Cart", category: "Paper & Bio Products", moq: "5 Units", spec: "3-shelf capacity with a 25-gallon vinyl bag. Non-marking 8-inch wheels. Built from commercial-grade molded plastic to resist cracking and peeling.", price: "Bulk pricing available on request", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop" },
    { id: 5, name: "Hypoallergenic Mattress Protector", category: "Platform Beds", moq: "50 Pieces", spec: "Waterproof, breathable TPU layer. Protects against dust mites, fluids, and perspiration. Machine washable in warm water. Knitted skirt stretches to fit up to 18-inch deep mattresses.", price: "Bulk pricing available on request", image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=800&auto=format&fit=crop" },
    { id: 6, name: "Biodegradable Trash Bags", category: "Paper & Bio Products", moq: "1000 Rolls", spec: "Heavy-duty 50L capacity. Made from biodegradable plant-based materials. Puncture and tear resistant. Ideal for room bins and public area receptacles.", price: "Bulk pricing available on request", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800&auto=format&fit=crop" },
];

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);

    const filteredProducts = PRODUCTS.filter(p => {
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 relative">
            {/* Product Hero */}
            <section className="bg-secondary text-white py-20 border-b-8 border-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold font-heading mb-4">The Bulk Catalog</h1>
                    <p className="text-xl text-gray-300 font-light max-w-2xl">
                        Explore our comprehensive range of commercial-grade hospitality essentials. Engineered for high-cycle usage, supreme comfort, and operational efficiency.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 flex-grow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row gap-8">

                    {/* Sidebar / Filters (25%) */}
                    <aside className="w-full md:w-1/4">
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 sticky top-32">
                            <h2 className="font-heading font-bold text-lg text-secondary mb-4 flex items-center gap-2">
                                <Filter className="w-5 h-5 text-accent" /> Category Filters
                            </h2>
                            <ul className="space-y-2">
                                {CATEGORIES.map(category => (
                                    <li key={category}>
                                        <button
                                            onClick={() => setActiveCategory(category)}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-sm text-sm font-semibold transition-colors duration-200 border-l-4",
                                                activeCategory === category
                                                    ? "bg-primary/5 text-primary border-primary"
                                                    : "text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-300"
                                            )}
                                        >
                                            {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Product Grid (75%) */}
                    <div className="w-full md:w-3/4">
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-sm shadow-sm border border-gray-100">
                            <span className="text-sm font-semibold text-gray-600">Showing {filteredProducts.length} Results</span>
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search catalog..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all w-full sm:w-64"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col cursor-pointer"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <div className="relative h-56 overflow-hidden bg-gray-100">
                                        <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-md">
                                            {product.category}
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="font-heading font-bold text-lg text-secondary mb-2 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.spec}</p>

                                        <div className="mt-auto space-y-4">
                                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">MOQ</span>
                                                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-sm">{product.moq}</span>
                                            </div>
                                            <div className="w-full bg-secondary text-white py-3 rounded-sm text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 group-hover:bg-primary">
                                                View Details
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-sm shadow-sm border border-gray-100">
                                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-secondary/80 backdrop-blur-sm cursor-pointer"
                        onClick={() => setSelectedProduct(null)}
                    ></div>

                    {/* Modal Content */}
                    <div
                        className="relative bg-white rounded-sm shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    >
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-full text-secondary hover:text-primary transition-colors shadow-sm"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                            <div className="absolute top-6 left-6 bg-white text-secondary text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm shadow-lg">
                                {selectedProduct.category}
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                            <h2 className="text-3xl font-heading font-extrabold text-secondary mb-2">
                                {selectedProduct.name}
                            </h2>
                            <p className="text-sm font-semibold text-primary mb-8 pb-4 border-b border-gray-100">
                                Product ID: #{selectedProduct.id.toString().padStart(6, '0')}
                            </p>

                            <div className="space-y-8 flex-grow">
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-secondary mb-3">Product Specifications</h4>
                                    <p className="text-gray-600 text-base leading-relaxed">{selectedProduct.spec}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Pricing Tier</span>
                                        <span className="text-sm font-semibold text-secondary">{selectedProduct.price}</span>
                                    </div>
                                    <div className="bg-primary/5 p-4 rounded-sm border border-primary/20">
                                        <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider block mb-1">Minimum Order (MOQ)</span>
                                        <span className="text-lg font-bold text-primary">{selectedProduct.moq}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => alert(`Item "${selectedProduct.name}" added to your quote.`)}
                                    className="w-full bg-secondary hover:bg-primary text-white py-4 rounded-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-3 shadow-lg"
                                >
                                    <ShoppingCart className="w-5 h-5" /> Add to Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
