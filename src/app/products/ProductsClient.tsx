"use client";

import { useState } from "react";
import { Search, Filter, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    "All",
    "Amenities",
    "Bath",
    "Furniture",
    "Paper & Bio Products",
    "Platform Beds",
];

type VariantOption = {
    label: string;
};

type ProductVariant = {
    colors?: VariantOption[];
    capacity?: VariantOption[];
    dimensions?: VariantOption[];
    combinations?: {
        [key: string]: string[];
    };
};

export type PublicProduct = {
    id: string;
    name: string;
    category: string;
    moq: string;
    spec: string;
    features?: string[];
    price: string;
    image: string;
    hoverImage?: string;
    gallery?: string[];
    variants?: ProductVariant;
};

export default function ProductsClient({ products }: { products: PublicProduct[] }) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<PublicProduct | null>(null);
    const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: VariantOption }>({});
    const [activeGalleryImage, setActiveGalleryImage] = useState<string | null>(null);
    const [expandedSpec, setExpandedSpec] = useState(false);

    const handleProductSelect = (product: PublicProduct) => {
        setSelectedProduct(product);
        const defaults: { [key: string]: VariantOption } = {};
        if (product.variants?.colors?.length) defaults.colors = product.variants.colors[0];
        if (product.variants?.capacity?.length) defaults.capacity = product.variants.capacity[0];
        if (product.variants?.dimensions?.length) defaults.dimensions = product.variants.dimensions[0];
        setSelectedVariants(defaults);
        setActiveGalleryImage(null);
        setExpandedSpec(false);
    };

    const handleVariantChange = (type: string, option: VariantOption) => {
        setSelectedVariants(prev => ({ ...prev, [type]: option }));
        setActiveGalleryImage(null);
    };

    const getCurrentImages = (): string[] => {
        if (!selectedProduct) return [];

        const activeLabels: string[] = [];
        if (selectedProduct.variants?.colors && selectedVariants.colors) activeLabels.push(selectedVariants.colors.label);
        if (selectedProduct.variants?.dimensions && selectedVariants.dimensions) activeLabels.push(selectedVariants.dimensions.label);
        if (selectedProduct.variants?.capacity && selectedVariants.capacity) activeLabels.push(selectedVariants.capacity.label);

        const combinationKey = activeLabels.join(' - ');

        if (selectedProduct.variants?.combinations && selectedProduct.variants.combinations[combinationKey]) {
            const images = selectedProduct.variants.combinations[combinationKey];
            if (images && images.length > 0) return images;
        }

        // Fallback to primary product image + general product gallery
        const baseGallery = [selectedProduct.image];
        if (selectedProduct.gallery && selectedProduct.gallery.length > 0) {
            baseGallery.push(...selectedProduct.gallery);
        }
        return baseGallery;
    };

    const filteredProducts = products.filter(p => {
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

                    {/* Sidebar / Filters */}
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

                    {/* Product Grid */}
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

                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-sm shadow-sm border border-gray-100">
                                <p className="text-gray-400 text-lg font-semibold">No products found.</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    {products.length === 0
                                        ? "The catalog is being built. Check back soon!"
                                        : "Try adjusting your search or category filter."}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductSelect(product)}
                                        className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col cursor-pointer"
                                    >
                                        <div className="relative h-56 overflow-hidden bg-gray-100">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={product.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"}
                                                alt={product.name}
                                                className={cn("object-cover w-full h-full transition-all duration-500 group-hover:scale-105", product.hoverImage ? "group-hover:opacity-0" : "")}
                                            />
                                            {product.hoverImage && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={product.hoverImage}
                                                    alt={`${product.name} Hover`}
                                                    className="absolute inset-0 object-cover w-full h-full opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                />
                                            )}
                                            <div className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-md z-10">
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
                        )}
                    </div>
                </div>
            </section>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
                    <div
                        className="absolute inset-0 bg-secondary/80 backdrop-blur-sm cursor-pointer"
                        onClick={() => { setSelectedProduct(null); setSelectedVariants({}); }}
                    />

                    <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => { setSelectedProduct(null); setSelectedVariants({}); }}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-full text-secondary hover:text-primary transition-colors shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative flex flex-col">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={activeGalleryImage || getCurrentImages()[0] || selectedProduct?.image} alt={selectedProduct?.name} className="w-full flex-grow h-[300px] md:h-full object-contain p-8 transition-opacity duration-300" />
                            <div className="absolute top-6 left-6 bg-white text-secondary text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm shadow-lg">
                                {selectedProduct?.category}
                            </div>
                            {selectedProduct && getCurrentImages().length > 1 && (
                                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent flex gap-3 overflow-x-auto">
                                    {getCurrentImages().map((galImg, idx) => (
                                        <button key={idx} onClick={() => setActiveGalleryImage(galImg)} className={cn("w-20 h-20 flex-shrink-0 border-2 rounded-sm overflow-hidden transition-all", (!activeGalleryImage && idx === 0) || activeGalleryImage === galImg ? "border-primary scale-105 shadow-lg opacity-100" : "border-white/50 hover:border-white/80 opacity-70 hover:opacity-100")}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={galImg} className="w-full h-full object-cover" alt="Gallery thumbnail" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                            <h2 className="text-3xl font-heading font-extrabold text-secondary mb-2">{selectedProduct.name}</h2>
                            <div className="mb-8 border-b border-gray-100" />

                            <div className="space-y-8 flex-grow">
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-secondary mb-3">Product Specifications</h4>
                                    <p className="text-gray-600 text-base leading-relaxed">
                                        {(!expandedSpec && selectedProduct.spec.length > 250) ? (
                                            <>
                                                {selectedProduct.spec.slice(0, 250)}...
                                                <button onClick={() => setExpandedSpec(true)} className="text-primary hover:text-[#B41561] font-semibold text-sm ml-2 transition-colors">
                                                    Read More...
                                                </button>
                                            </>
                                        ) : (
                                            selectedProduct.spec
                                        )}
                                    </p>

                                    {selectedProduct.features && selectedProduct.features.length > 0 && (
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-6">
                                            {selectedProduct.features.map((feat, idx) => (
                                                <div key={idx} className="text-[14px] font-medium text-primary">
                                                    {feat}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {selectedProduct.variants && (
                                    <div className="space-y-6 bg-gray-50 p-6 rounded-sm border border-gray-100">
                                        {selectedProduct.variants.colors && (
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Select Color</h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {selectedProduct.variants.colors.map(colorOpt => (
                                                        <button key={colorOpt.label} onClick={() => handleVariantChange('colors', colorOpt)} className={cn("px-4 py-2 border rounded-sm text-sm font-semibold transition-all", selectedVariants.colors?.label === colorOpt.label ? "bg-secondary text-white border-secondary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary")}>
                                                            {colorOpt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedProduct.variants.dimensions && (
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Select Dimensions</h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {selectedProduct.variants.dimensions.map(dimOpt => (
                                                        <button key={dimOpt.label} onClick={() => handleVariantChange('dimensions', dimOpt)} className={cn("px-4 py-2 border rounded-sm text-sm font-semibold transition-all", selectedVariants.dimensions?.label === dimOpt.label ? "bg-secondary text-white border-secondary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary")}>
                                                            {dimOpt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedProduct.variants.capacity && (
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Select Capacity</h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {selectedProduct.variants.capacity.map(capOpt => (
                                                        <button key={capOpt.label} onClick={() => handleVariantChange('capacity', capOpt)} className={cn("px-4 py-2 border rounded-sm text-sm font-semibold transition-all", selectedVariants.capacity?.label === capOpt.label ? "bg-secondary text-white border-secondary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary")}>
                                                            {capOpt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

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
                                    onClick={() => {
                                        const variantString = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v.label}`).join(', ');
                                        const itemDesc = variantString ? `${selectedProduct.name} (${variantString})` : selectedProduct.name;
                                        alert(`Item "${itemDesc}" added to your quote.`);
                                        setSelectedProduct(null);
                                        setSelectedVariants({});
                                    }}
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
