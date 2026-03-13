"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, UploadCloud, X, Plus } from "lucide-react";

export default function NewProductPage() {
    // Form state
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Amenities");
    const [moq, setMoq] = useState("");
    const [price, setPrice] = useState("Bulk pricing available on request");
    const [spec, setSpec] = useState("");

    // Variant State
    const [hasColors, setHasColors] = useState(false);
    const [colors, setColors] = useState<string[]>([]);
    const [colorInput, setColorInput] = useState("");

    const [hasDimensions, setHasDimensions] = useState(false);
    const [dimensions, setDimensions] = useState<string[]>([]);
    const [dimInput, setDimInput] = useState("");

    const [hasCapacity, setHasCapacity] = useState(false);
    const [capacity, setCapacity] = useState<string[]>([]);
    const [capInput, setCapInput] = useState("");

    const handleAddVariant = (
        input: string, 
        setInput: React.Dispatch<React.SetStateAction<string>>, 
        list: string[], 
        setList: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (!input.trim() || list.includes(input.trim())) return;
        setList([...list, input.trim()]);
        setInput("");
    };

    const handleRemoveVariant = (
        itemToRemove: string,
        list: string[], 
        setList: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setList(list.filter(item => item !== itemToRemove));
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-500 hover:text-secondary transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-heading font-bold text-secondary">Add New Product</h1>
                </div>
                <button 
                    type="button"
                    className="bg-secondary hover:bg-primary text-white px-6 py-3 rounded-sm font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg"
                    onClick={() => alert("This is a UI Mockup. Backend integration will be handled in Phase 2.")}
                >
                    <Save className="w-5 h-5" /> Save Product
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                        <h2 className="text-lg font-heading font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Basic Information</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                    placeholder="e.g. Premium White Duvet Cover"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                    >
                                        <option value="Amenities">Amenities</option>
                                        <option value="Bath">Bath</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Paper & Bio Products">Paper & Bio Products</option>
                                        <option value="Platform Beds">Platform Beds</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Order Qty (MOQ) *</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                        placeholder="e.g. 50 Pieces"
                                        value={moq}
                                        onChange={e => setMoq(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Pricing Tier</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Technical Specifications *</label>
                                <textarea 
                                    rows={5}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-y"
                                    placeholder="Add commercial-grade specifications here..."
                                    value={spec}
                                    onChange={e => setSpec(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Variant Manager */}
                    <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                        <h2 className="text-lg font-heading font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Variant Options</h2>
                        <p className="text-sm text-gray-500 mb-6">Enable specific variants for this product. Customers will be able to select from these options when requesting a quote.</p>
                        
                        <div className="space-y-8">
                            {/* Color Variants */}
                            <div className="border border-gray-200 rounded-sm p-5">
                                <label className="flex items-center gap-3 cursor-pointer mb-4">
                                    <input type="checkbox" className="w-5 h-5 accent-primary" checked={hasColors} onChange={() => setHasColors(!hasColors)} />
                                    <span className="font-bold text-secondary">Has Color Variants</span>
                                </label>
                                
                                {hasColors && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <div className="flex gap-2 mb-4">
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Navy Blue" 
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-sm text-sm"
                                                value={colorInput}
                                                onChange={e => setColorInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleAddVariant(colorInput, setColorInput, colors, setColors)}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => handleAddVariant(colorInput, setColorInput, colors, setColors)}
                                                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-sm text-sm font-semibold transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {colors.length === 0 && <span className="text-xs text-gray-400 italic">No colors added yet.</span>}
                                            {colors.map(color => (
                                                <span key={color} className="inline-flex items-center gap-1 bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-sm">
                                                    {color}
                                                    <button type="button" onClick={() => handleRemoveVariant(color, colors, setColors)} className="ml-1 hover:text-primary"><X className="w-3 h-3" /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dimensions Variants */}
                            <div className="border border-gray-200 rounded-sm p-5">
                                <label className="flex items-center gap-3 cursor-pointer mb-4">
                                    <input type="checkbox" className="w-5 h-5 accent-primary" checked={hasDimensions} onChange={() => setHasDimensions(!hasDimensions)} />
                                    <span className="font-bold text-secondary">Has Dimension Variants</span>
                                </label>
                                
                                {hasDimensions && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <div className="flex gap-2 mb-4">
                                            <input 
                                                type="text" 
                                                placeholder="e.g. King Size" 
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-sm text-sm"
                                                value={dimInput}
                                                onChange={e => setDimInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleAddVariant(dimInput, setDimInput, dimensions, setDimensions)}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => handleAddVariant(dimInput, setDimInput, dimensions, setDimensions)}
                                                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-sm text-sm font-semibold transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {dimensions.length === 0 && <span className="text-xs text-gray-400 italic">No dimensions added yet.</span>}
                                            {dimensions.map(dim => (
                                                <span key={dim} className="inline-flex items-center gap-1 bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-sm">
                                                    {dim}
                                                    <button type="button" onClick={() => handleRemoveVariant(dim, dimensions, setDimensions)} className="ml-1 hover:text-primary"><X className="w-3 h-3" /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Capacity Variants */}
                            <div className="border border-gray-200 rounded-sm p-5">
                                <label className="flex items-center gap-3 cursor-pointer mb-4">
                                    <input type="checkbox" className="w-5 h-5 accent-primary" checked={hasCapacity} onChange={() => setHasCapacity(!hasCapacity)} />
                                    <span className="font-bold text-secondary">Has Capacity / Size Variants</span>
                                </label>
                                
                                {hasCapacity && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <div className="flex gap-2 mb-4">
                                            <input 
                                                type="text" 
                                                placeholder="e.g. 50 Liters" 
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-sm text-sm"
                                                value={capInput}
                                                onChange={e => setCapInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleAddVariant(capInput, setCapInput, capacity, setCapacity)}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => handleAddVariant(capInput, setCapInput, capacity, setCapacity)}
                                                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-sm text-sm font-semibold transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {capacity.length === 0 && <span className="text-xs text-gray-400 italic">No capacities added yet.</span>}
                                            {capacity.map(cap => (
                                                <span key={cap} className="inline-flex items-center gap-1 bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-sm">
                                                    {cap}
                                                    <button type="button" onClick={() => handleRemoveVariant(cap, capacity, setCapacity)} className="ml-1 hover:text-primary"><X className="w-3 h-3" /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Column - Media */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="text-lg font-heading font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Product Image</h2>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-sm bg-gray-50 flex flex-col items-center justify-center h-64 hover:bg-gray-100 hover:border-primary transition-all cursor-pointer group">
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-8 h-8 text-primary" />
                            </div>
                            <p className="font-semibold text-gray-700 text-sm mb-1">Click to upload image</p>
                            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 5MB)</p>
                            <div className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-sm text-xs font-semibold text-gray-600 shadow-sm flex items-center gap-2">
                                <Plus className="w-3 h-3" /> Browse Files
                            </div>
                        </div>
                        
                        <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-sm p-4">
                            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Note on Image Storage</h4>
                            <p className="text-sm text-blue-600/80 leading-relaxed">
                                Uploaded images will be optimized and stored in Cloudflare R2 automatically in Phase 2. For now, this is a UI mockup.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
